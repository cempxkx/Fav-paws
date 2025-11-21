const NUM_CATS = 10;
let currentIndex = 0;
let liked = [];
let cards = [];

const likeSound = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2022/01/Cute-cat-meow-sound-effect.mp3');
const dislikeSound = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2021/04/Angry-cat-sound-effect.mp3');
likeSound.volume = 0.5;
dislikeSound.volume = 0.5;

const cardContainer = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCountEl = document.getElementById("like-count");
const likedImagesEl = document.getElementById("liked-images");
const restartBtn = document.getElementById("restart-btn");
const loadingEl = document.getElementById("loading");
const header = document.getElementById("header");
const pagination = document.getElementById("pagination");
const currentEl = document.getElementById("current");
const totalEl = document.getElementById("total");
const summaryTitle = document.getElementById("summary-title");

if (totalEl) totalEl.textContent = NUM_CATS;

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve;
  });
}

function showLoader() {
  loadingEl.classList.remove("hidden");
  cardContainer.classList.add("hidden");
  header.classList.add("hidden");
  pagination.classList.add("hidden");
  summary.classList.add("hidden");
}

function hideLoader() {
  loadingEl.classList.add("hidden");
  cardContainer.classList.remove("hidden");
  header.classList.remove("hidden");
  pagination.classList.remove("hidden");
}


// Load cat images and show stack after preloading
async function loadCats() {
  liked = [];
  currentIndex = 0;
  cards = [];
  cardContainer.innerHTML = '';
  showLoader();

// build image URLs (using cataas smaller size to increase speed)
  const images = [];
  for (let i = 0; i < NUM_CATS; i++) {
    images.push(`https://cataas.com/cat?width=600&height=800&random=${Date.now()}-${i}`);
  }

  // Preload all images in background
  await Promise.all(images.map(src => preloadImage(src)));

  images.forEach((src, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.style.zIndex = NUM_CATS - index;

    const img = document.createElement("img");
    img.src = src;
    card.appendChild(img);

    const info = document.createElement("div");
    info.innerHTML = `<strong>Kitty ${index + 1}</strong><div style="font-size:12px; opacity:0.85;">Cute & cuddly</div>`;

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    card.appendChild(overlay);

    cardContainer.appendChild(card);
    cards.push(card);

    addSwipe(card, overlay, src);
  });

  hideLoader();
  updatePagination();
}

function createCard(src, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = src;
  card.appendChild(img);

const overlay = document.createElement("div");
overlay.classList.add("overlay");
card.appendChild(overlay);

 cardContainer.appendChild(card);
  addSwipe(card, overlay, src);
  card.push(card);
}

function addSwipe(card, overlay, src) {
  let startX = 0, currentX = 0; 
  let dragging=false;

  card.addEventListener("touchstart", (e) => {
    dragging = true;
    startX = e.touches[0].clientX;
  });

card.addEventListener("touchmove", (e) => {
  if (!dragging) return;
  currentX = e.touches[0].clientX - startX;
  card.style.transform = `translateX(${currentX}px) rotate(${currentX/18}deg)`;

const opacity = Math.min(Math.abs(currentX) / 140, 0.8);
overlay.style.opacity = opacity;

if (currentX > 30) {
  overlay.textContent = "❤️";
  overlay.style.backgroundColor = `rgba(255, 192, 203, ${opacity})`; // pink
} else if (currentX < -30) {
  overlay.textContent = "✕";
  overlay.style.backgroundColor = `rgba(135, 206, 250, ${opacity})`; // blue
} else {
  overlay.textContent = "";
  overlay.style.backgroundColor = "transparent";
}

});

  card.addEventListener("touchend", () => {
    dragging = false;

    if (currentX > 120) {
      handleSwipe("right", src, card);
    } else if (currentX < -120) {
      handleSwipe("left", src, card);
    } else {
          card.style.transform = "";
          overlay.style.opacity = 0;
    }
    currentX = 0;
  });

  card.addEventListener("touchcancel", () => {
    card.style.transform = "";
    overlay.style.opacity = 0;
    dragging = false;
    currentX = 0;
  });

}

function handleSwipe(direction, src, card) {
  card.style.transition = "350ms cubic-bezier(.2,.9,.3,1)";
  card.style.transform = direction === "right"
    ? "translateX(600px) rotate(25deg)"
    : "translateX(-600px) rotate(-25deg)";


  if (direction === "right") {
    liked.push(src);
  }

  setTimeout(() => {
    card.remove();
    currentIndex++;
    updatePagination();
    if (currentIndex === NUM_CATS) showSummary();
  }, 300);
}

function updatePagination() {
  const cur = Math.min(currentIndex + 1, NUM_CATS);
  const currentSpan = document.getElementById("current");
  if (currentSpan) currentSpan.textContent = cur;
  
  const totalSpan = document.getElementById("total");
  if (totalSpan) totalSpan.textContent = NUM_CATS;
}

function showSummary() {
  cardContainer.classList.add("hidden");
  header.classList.add("hidden");
  summary.classList.remove("hidden");
  pagination.classList.add("hidden");

  likeCountEl.textContent = liked.length;
  likedImagesEl.innerHTML = "";

  if (liked.length === 0) {
    dislikeSound.play();
    summaryTitle.innerHTML = "";

    const sadMessage = document.createElement("header");
    sadMessage.innerHTML = 'Oh no! You didn\'t like any cats!<span class="cat">😿</span>'; 
    sadMessage.style.fontSize = "18px bold";
    sadMessage.style.color = "#white";
    sadMessage.style.left = "50%";
    summaryTitle.appendChild(sadMessage);
  } else {
    likeSound.play();
    summaryTitle.innerHTML = `You just liked <span id="like-count">${liked.length}</span> cats!`;
    liked.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      likedImagesEl.appendChild(img);
    });
  }
}

restartBtn.addEventListener("click", () => {
  currentIndex = 0;
  liked = [];
  summary.classList.add("hidden");
  cardContainer.classList.remove("hidden");
  header.classList.remove("hidden");
  loadCats();
});

loadCats();
