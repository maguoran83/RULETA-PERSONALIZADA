const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const form = document.getElementById("data-form");
let data = [];
let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function createWheel() {
  const input = document.getElementById("data-input").value;
  data = input.split(",").map((item) => item.trim());
  arc = Math.PI / (data.length / 2);
  drawWheel();
}

function drawWheel() {
  const outsideRadius = 200;
  const textRadius = 160;
  const insideRadius = 125;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  for (let i = 0; i < data.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = getColor(i, data.length);

    ctx.beginPath();
    ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
    ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
    ctx.stroke();
    ctx.fill();

    ctx.save();
    ctx.fillStyle = "black";
    ctx.translate(
      250 + Math.cos(angle + arc / 2) * textRadius,
      250 + Math.sin(angle + arc / 2) * textRadius
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    const text = data[i];
    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
    ctx.restore();
  }
}

function getColor(item, maxItem) {
  const hue = (item / maxItem) * 360;
  return `hsl(${hue}, 100%, 50%)`;
}

function spinWheel() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3000 + 4000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle =
    spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd);
  ctx.save();
  ctx.font = "bold 30px Helvetica, Arial";
  const text = data[index];
  ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
  ctx.restore();
}

function easeOut(t, b, c, d) {
  t /= d;
  t--;
  return c * (t * t * t + 1) + b;
}