import createState from 'state-watcher';

const [state, watcher] = createState({
  cards: [],
  next_card: null,
  password_error: null,
});

const main = async () => {
  await fetch('/.netlify/functions/get-card')
    .then((d) => {
      if (d.status !== 200) {
        throw new Error('Invalid response');
      }
      return d.json();
    })
    .catch((err) => {
      state.password_error = true;
    });

  state.cards = await fetch('/cards.json').then((d) => d.text());
};

watcher.on('change', ['password_error'], (_, err) => {
  if (err) {
    const input = document.createElement('password-input');
    document.querySelector('#root').appendChild(input);
  } else {
    document.querySelector('password-input').remove();
  }
});

main();
