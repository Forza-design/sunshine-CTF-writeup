document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "matrix";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
  resize(); window.addEventListener('resize', resize);
  canvas.style.position = "fixed"; canvas.style.top = 0; canvas.style.left = 0;
  canvas.style.zIndex = -1; canvas.style.opacity = "0.12"; canvas.style.pointerEvents = "none";
  const fontSize = 14; const columns = Math.floor(canvas.width / fontSize) + 1;
  const drops = new Array(columns).fill(0);
  function draw(){
    ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#00ff9f"; ctx.font = fontSize + "px monospace";
    for(let i=0;i<drops.length;i++){
      const text = String.fromCharCode(0x30A0 + Math.random() * 96);
      const x = i * fontSize; const y = drops[i] * fontSize;
      ctx.fillText(text,x,y);
      drops[i] = (y > canvas.height && Math.random() > 0.975) ? 0 : drops[i] + 1;
    }
  }
  setInterval(draw,50);
});
