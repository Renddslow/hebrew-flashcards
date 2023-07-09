import createState from 'state-watcher';

const [state, watcher] = createState({
  cards: {},
  next_card: null,
  password_error: null,
});

const main = async () => {
  const nextCard = await fetch('/.netlify/functions/get-card')
    .then((d) => {
      if (d.status !== 200) {
        throw new Error('Invalid response');
      }
      return d.json();
    })
    .then((d) => d.data)
    .catch(() => {
      state.password_error = true;
    });

  if (nextCard) {
    state.next_card = nextCard;
    state.password_error = false;
  }

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

watcher.on('change', ['next_card'], (state, nextCard) => {});

main();
