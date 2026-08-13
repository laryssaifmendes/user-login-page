const form = document.getElementById('loginForm');
const captchaText = document.getElementById('captchaText');
const captchaInput = document.getElementById('captchaInput');
const refreshCaptcha = document.getElementById('refreshCaptcha');
const adOverlay = document.getElementById('adOverlay');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const revealSecretButton = document.getElementById('revealSecret');
const secretCredentials = document.getElementById('secretCredentials');

const validUsername = 'admin';
const validPassword = '123456';

const captchaPool = [
  'X7K2Q',
  'M4R9T',
  'L1N3P',
  'V9Z2K',
  'P0P7D',
  'F8A3M',
  'Q1X9Y',
  'R2H4N',
  'C7W8L',
  'Z3E6K'
];

function randomizeCaptcha() {
  const value = captchaPool[Math.floor(Math.random() * captchaPool.length)];
  captchaText.textContent = value;
  captchaText.style.transform = `rotate(${(Math.random() * 32 - 16).toFixed(1)}deg) scale(${(Math.random() * 1.2 + 0.9).toFixed(2)}) skewX(${(Math.random() * 22 - 11).toFixed(1)}deg)`;
  captchaText.style.filter = `blur(${(Math.random() * 1.4).toFixed(1)}px) contrast(${(Math.random() * 2.5 + 1.5).toFixed(2)})`;
  captchaInput.value = '';
  captchaInput.placeholder = `TENTAR ${Math.floor(Math.random() * 99 + 1)}`;
}

function triggerAds() {
  adOverlay.classList.add('visible');
  adOverlay.setAttribute('aria-hidden', 'false');

  document.querySelectorAll('.ad').forEach((ad) => {
    ad.onclick = () => {
      form.reset();
      usernameInput.focus();
      randomizeCaptcha();
      adOverlay.classList.remove('visible');
      adOverlay.setAttribute('aria-hidden', 'true');
    };
  });

  const urgentAd = document.querySelector('.ad-urgent');
  urgentAd.onclick = () => {
    form.reset();
    usernameInput.focus();
    randomizeCaptcha();
    adOverlay.classList.remove('visible');
    adOverlay.setAttribute('aria-hidden', 'true');
  };
}

refreshCaptcha.addEventListener('click', randomizeCaptcha);

let revealAttempts = 0;

function moveRevealAway(event) {
  if (revealAttempts >= 3) {
    revealSecretButton.removeEventListener('mouseenter', moveRevealAway);
    revealSecretButton.removeEventListener('mousemove', moveRevealAway);
    revealSecretButton.style.left = '0px';
    revealSecretButton.style.top = '0px';
    revealSecretButton.style.color = '#111';
    revealSecretButton.click();
    return;
  }

  revealAttempts += 1;
  const bounds = revealSecretButton.parentElement.getBoundingClientRect();
  const offsetX = (Math.random() * 180 - 90);
  const offsetY = (Math.random() * 90 - 45);
  const maxLeft = bounds.width - 26;
  const maxTop = 50;
  const nextLeft = Math.min(Math.max(offsetX, -maxLeft), maxLeft);
  const nextTop = Math.min(Math.max(offsetY, -maxTop), maxTop);

  revealSecretButton.style.left = `${nextLeft}px`;
  revealSecretButton.style.top = `${nextTop}px`;
  revealSecretButton.style.transform = `rotate(${(Math.random() * 30 - 15).toFixed(1)}deg) scale(${(Math.random() * 0.5 + 0.9).toFixed(2)})`;

  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

revealSecretButton.addEventListener('mouseenter', moveRevealAway);
revealSecretButton.addEventListener('mousemove', moveRevealAway);

let revealLoopId = null;

function keepCredentialsMoving() {
  if (!secretCredentials.classList.contains('visible')) return;

  const moveToRandomSpot = () => {
    const parent = secretCredentials.parentElement.getBoundingClientRect();
    const maxX = Math.max(20, parent.width - 260);
    const maxY = Math.max(20, parent.height - 80);

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    secretCredentials.style.left = `${x}px`;
    secretCredentials.style.top = `${y}px`;
    secretCredentials.style.transform = `translate(0, 0) rotate(${(Math.random() * 30 - 15).toFixed(1)}deg)`;
  };

  moveToRandomSpot();
  revealLoopId = setInterval(moveToRandomSpot, 700);
}

revealSecretButton.addEventListener('click', () => {
  if (revealAttempts < 3) {
    moveRevealAway();
    return;
  }

  secretCredentials.classList.add('visible');
  secretCredentials.style.left = '50%';
  secretCredentials.style.top = '38px';
  secretCredentials.style.transform = 'translateX(-50%) scale(1)';
  clearInterval(revealLoopId);
  keepCredentialsMoving();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const captchaValue = captchaInput.value.trim().toUpperCase();

  if (username === '' || password === '') {
    triggerAds();
    return;
  }

  if (username !== validUsername || password !== validPassword || captchaValue !== captchaText.textContent) {
    triggerAds();
    randomizeCaptcha();
    return;
  }

  sessionStorage.setItem('loggedIn', 'true');
  window.location.href = 'dashboard.html';
});

usernameInput.focus();
randomizeCaptcha();
