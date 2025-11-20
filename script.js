const NUM_CATS = 10;
let currentIndex = 0;
let liked = [];
let cards = [];


// Embedded sounds via direct URL
const likeSound = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2015/01/Meow-sound.mp3');  // right swipe
const dislikeSound = new Audio('https://cdn.pixabay.com/audio/2023/02/15/audio_6d4b2a7410.mp3');            // left swipe

// Optional: adjust volume
likeSound.volume = 0.5;
dislikeSound.volume = 0.5;

const cardContainer = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCountEl = document.getElementById("like-count");
const likedImagesEl = document.getElementById("liked-images");
const restartBtn = document.getElementById("restart-btn");
const loadingEl = document.getElementById("loading");

// Preload images
function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
  });
}

// Load cat images and show stack after preloading
async function loadCats() {
  liked = [];
  currentIndex = 0;
  cards = [];
  cardContainer.innerHTML = '';
  summary.classList.add("hidden");
  cardContainer.classList.add("hidden");
  loadingEl.classList.remove("hidden");

  const images = [];
  for (let i = 0; i < NUM_CATS; i++) {
    images.push(`https://cataas.com/cat?random=${Date.now()}-${i}`);
  }

  // Wait for all images to preload
  await Promise.all(images.map(src => preloadImage(src)));

  // Create cards after preloading
  images.forEach((src, index) => createCard(src, index));

  loadingEl.classList.add("hidden");
  cardContainer.classList.remove("hidden");
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
  cards.push(card);

  addSwipe(card, overlay, src);
}

function addSwipe(card, overlay, src) {
  let startX = 0, currentX = 0;

  card.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

card.addEventListener("touchmove", (e) => {
  currentX = e.touches[0].clientX - startX;
  card.style.transform = `translateX(${currentX}px) rotate(${currentX/15}deg)`;

  // Reset classes
  card.classList.remove("like-swipe");
  overlay.classList.remove("right");

  if (currentX > 50) {
    overlay.textContent = "LIKE ❤️";
    overlay.style.opacity = Math.min(currentX/100,1);
    card.classList.add("like-swipe"); // add pink border
  } else if (currentX < -50) {
    overlay.textContent = "NOPE ❌";
    overlay.style.opacity = Math.min(Math.abs(currentX)/100,1);
    overlay.classList.add("right"); // move overlay to right side
  } else {
    overlay.style.opacity = 0;
  }
});

  card.addEventListener("touchend", () => {
    if (currentX > 120) handleSwipe("right", src, card);
    else if (currentX < -120) handleSwipe("left", src, card);
    else card.style.transform = "translateX(0)";
    overlay.style.opacity = 0;
    currentX = 0;
  });
}

function handleSwipe(direction, src, card) {
  card.style.transition = "0.3s";
  card.style.transform = direction === "right" 
    ? "translateX(400px) rotate(30deg)" 
    : "translateX(-400px) rotate(-30deg)";

  // Play sound
  if (direction === "right") {
    liked.push(src);
    likeSound.play();
  } else if (direction === "left") {
    dislikeSound.play();
  }

  setTimeout(() => {
    card.remove();
    currentIndex++;
    if (currentIndex === NUM_CATS) showSummary();
  }, 300);
}

function showSummary() {
  cardContainer.classList.add("hidden");
  summary.classList.remove("hidden");

  likeCountEl.textContent = liked.length;
  likedImagesEl.innerHTML = ""; // clear previous list

  liked.forEach(url => {
    const div = document.createElement("div");
    div.classList.add("liked-item");
    div.innerHTML = `<img src="${url}" alt="cat">`;
    likedImagesEl.appendChild(div);
  });
}

// Restart button reloads cat cards
restartBtn.addEventListener("click", loadCats);

// Initial load
loadCats();
