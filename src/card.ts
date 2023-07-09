import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('flash-card')
export class FlashCard extends LitElement {
  @property()
  front = '';
  @property()
  back = '';

  render() {
    return html``;
  }
}
