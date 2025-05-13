const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMenu() {
  mobileMenu.classList.remove('open');
}

const canvas = document.getElementById("meteorCanvas");
const ctx = canvas.getContext("2d");

let width, height;
let meteors = [];

function initCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  meteors = Array.from({ length: 100 }, () => ({
    x: Math.random() * -width,
    y: Math.random() * height,
    length: Math.random() * 20 + 10,
    speed: Math.random() * 5 + 2,
    angle: Math.PI / 4, // 45°
    opacity: Math.random() * 0.5 + 0.3
  }));
}

function drawMeteor(meteor) {
  const xEnd = meteor.x + meteor.length * Math.cos(meteor.angle);
  const yEnd = meteor.y + meteor.length * Math.sin(meteor.angle);

  ctx.beginPath();
  ctx.moveTo(meteor.x, meteor.y);
  ctx.lineTo(xEnd, yEnd);
  ctx.strokeStyle = `rgba(78, 168, 222, ${meteor.opacity})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function update() {
  ctx.clearRect(0, 0, width, height);
  for (let meteor of meteors) {
    drawMeteor(meteor);
    meteor.x += meteor.speed * Math.cos(meteor.angle);
    meteor.y += meteor.speed * Math.sin(meteor.angle);

    if (meteor.x > width || meteor.y > height) {
      meteor.x = Math.random() * width;
      meteor.y = Math.random() * height;
    }
  }
  requestAnimationFrame(update);
}

window.addEventListener('resize', initCanvas);
initCanvas();
update();

const typedInfo = document.getElementById("typed-info");

const messageSets = [
  [
    "<p>>Code, coffee, repeat</p>",
    "<p>>Local roots, global vision</p>",
    "<p>>If you can imagine it, you can code it.</p>"
  ],
  [
    "<p>>Full-Stack Developer</p>",
    "<p>>Creative thinker</p>",
    "<p>>Tech enthusiast</p>"
  ]
];

let setIndex = 0;
let lineIndex = 0;
let charIndex = 0;
let currentSet = messageSets[setIndex];
let isDeleting = false;
let typingDelay = 50;
let holdDelay = 2000;

function typeLines() {
  let linesHTML = '';
  let doneTyping = true;

  for (let i = 0; i < currentSet.length; i++) {
    const fullLine = currentSet[i];
    if (i < lineIndex) {
      linesHTML += fullLine + '\n';
    } else if (i === lineIndex) {
      linesHTML += fullLine.substring(0, charIndex) + '\n';
      if (charIndex < fullLine.length) {
        doneTyping = false;
      }
    }
  }

  typedInfo.innerHTML = linesHTML;

  if (!isDeleting) {
    if (charIndex < currentSet[lineIndex].length) {
      charIndex++;
      setTimeout(typeLines, typingDelay);
    } else if (lineIndex < currentSet.length - 1) {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeLines, typingDelay);
    } else {
      setTimeout(() => {
        isDeleting = true;
        setTimeout(typeLines, typingDelay);
      }, holdDelay);
    }
  } else {
    if (lineIndex >= 0) {
      if (charIndex > 0) {
        charIndex--;
        typedInfo.innerHTML = currentSet
          .slice(0, lineIndex)
          .join('\n') + '\n' + currentSet[lineIndex].substring(0, charIndex);
        setTimeout(typeLines, typingDelay / 1.5);
      } else {
        lineIndex--;
        charIndex = lineIndex >= 0 ? currentSet[lineIndex].length : 0;
        setTimeout(typeLines, typingDelay / 1.5);
      }
    } else {
      setIndex = (setIndex + 1) % messageSets.length;
      currentSet = messageSets[setIndex];
      lineIndex = 0;
      charIndex = 0;
      isDeleting = false;
      setTimeout(typeLines, typingDelay);
    }
  }
}
typeLines();


document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch("../php/send-mail.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        showToast(result, true);
        form.reset();
    })
    .catch(error => {
        showToast("There was an error sending your message.", false);
    });
});

function showToast(message, isSuccess) {
    const toast = document.createElement("div");
    toast.id = "toastMessage";
    toast.textContent = message;
    toast.style.background = isSuccess 
        ? "linear-gradient(to right, #007cf0, #00dfd8)" // Éxito
        : "linear-gradient(to right, #3a0ca3, #4361ee)"; // Error

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = 1;
        toast.style.top = "20px";
    }, 100);

    setTimeout(() => {
        toast.style.opacity = 0;
        toast.style.top = "-100px";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4000);
}