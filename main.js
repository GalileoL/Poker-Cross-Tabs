const card = document.querySelector(".pokerCard");

const channel = new BroadcastChannel("card-channel");

channel.onmessage = (e) => {
  console.log("message received", e.data);
  const [clientX, clientY] = screenToClient(e.data.screenX, e.data.screenY);
  card.style.left = clientX + "px";
  card.style.top = clientY + "px";
};

/**
 *
 * @param {MouseEvent} e
 */
card.onmousedown = (e) => {
  let x = e.pageX - card.offsetLeft;
  let y = e.pageY - card.offsetTop;

  window.onmousemove = (e) => {
    const cx = e.pageX - x;
    const cy = e.pageY - y;
    card.style.left = cx + "px";
    card.style.top = cy + "px";
    const [screenX, screenY] = clientToScreen(cx, cy);
    channel.postMessage({ screenX, screenY });
  };

  window.onmouseup = () => {
    window.onmousemove = null;
    window.onmouseup = null;
  };
};

const barHeight = () => window.outerHeight - window.innerHeight;

function clientToScreen(clientX, clientY) {
  const screenX = clientX + window.screenX;
  // screenY accounts for the height of the browser's title bar
  const screenY = clientY + window.screenY + barHeight();
  return [screenX, screenY];
}

function screenToClient(screenX, screenY) {
  const clientX = screenX - window.screenX;
  const clientY = screenY - window.screenY - barHeight();
  return [clientX, clientY];
}
