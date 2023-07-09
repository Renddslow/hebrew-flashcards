import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('password-input')
export class PasswordInput extends LitElement {
  constructor() {
    super();
  }

  static styles = css`
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }

    form {
      --shadow-color: 249deg 70% 30%;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-gap: 12px;
      background: #fff;
      padding: 24px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 8px;
      box-shadow: 0.1px 0.6px 0.7px hsl(var(--shadow-color) / 0.36),
        0.4px 1.9px 2.1px -0.9px hsl(var(--shadow-color) / 0.34),
        1.1px 4.9px 5.5px -1.8px hsl(var(--shadow-color) / 0.32),
        2.8px 12px 13.4px -2.7px hsl(var(--shadow-color) / 0.31);
    }

    .form-group {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-gap: 8px;
      width: 100%;
    }

    .form-group label {
      font-weight: 600;
      font-size: 14px;
      color: #2a2734;
    }

    .form-group input {
      width: 100%;
      min-width: 240px;
      padding: 12px;
      border: 2px solid #e5e5e5;
      border-radius: 4px;
      color: #211e31;
      font-size: 16px;
    }

    .form-group input:empty.error {
      border: 2px solid #d00;
      background: #fee;
    }

    .form-group input.error ~ p {
      color: #d00;
      font-size: 12px;
    }

    button[type='submit'] {
      background: #3ebd7e;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 12px;
      display: block;
      font-size: 16px;
      font-weight: 600;
    }

    button[type='submit']:disabled {
      opacity: 0.7;
    }
  `;

  handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password;

    const button = e.target.querySelector('button');
    button.setAttribute('disabled', 'true');
    button.innerText = 'Loading...';

    const res = await fetch('/.netlify/functions/login', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'token',
          attributes: {
            password: password.value,
          },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((d) => d.json());

    if (res.errors?.length) {
      button.removeAttribute('disabled');
      button.innerText = 'Login';
      password.value = '';
      password.classList.add('error');
      password.dataset.error = res.errors[0].message;

      const element = document.createElement('p');
      element.innerText = res.errors[0].message;
      element.setAttribute('describes', 'password');
      password.parentNode.appendChild(element);

      return false;
    }

    window.location.href = '/';
  };

  render() {
    return html`
      <form @submit="${this.handleSubmit}">
        <h2>Login to Start Practicing</h2>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" name="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    `;
  }
}
