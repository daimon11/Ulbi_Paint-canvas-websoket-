
const btn = document.querySelector('#btn')
console.log('есть', btn)

const soket = new WebSocket('ws://localhost:5000/');
soket.onopen = () => {
  soket.send(JSON.stringify({
    message: 'Привет сервер',
    method: 'connection',
    id: 555,
    username: 'daimon94',
  }));
}

soket.onmessage = (event) => {
  console.log('С сервера пришло сообщение', event.data);
}

btn.onclick = () => {
  soket.send(JSON.stringify({
    message: 'Привет сервер',
    method: 'message',
    id: 555,
    username: 'daimon94',
  }));
}