const NUM_CATS = 10;
let currentIndex = 0;
let liked = [];
let cards = [];

const cardContainer = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCountEl = document.getElementById("like-count");
const likedImagesEl = document.getElementById("liked-images");
const restartBtn = document.getElementById("restart-btn");

// Load cat images
async function loadCats() {
  liked = [];
  currentIndex = 0;
  cardContainer.innerHTML = '';
  summary.classList.add("hidden");

  const images = [];
  for (let i = 0; i < NUM_CATS; i++) {
    images.push(`https://cataas.com/cat?random=${Date.now()}-${i}`);
  }

  images.forEach((src, index) => createCard(src, index));
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

    // Overlay
    if (currentX > 50) {
      overlay.textContent = "LIKE ❤️";
      overlay.style.opacity = Math.min(currentX/100,1);
    } else if (currentX < -50) {
      overlay.textContent = "NOPE ❌";
      overlay.style.opacity = Math.min(Math.abs(currentX)/100,1);
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
  card.style.transform = direction === "right" ? "translateX(400px) rotate(30deg)" : "translateX(-400px) rotate(-30deg)";

  if (direction === "right") liked.push(src);

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
  likedImagesEl.innerHTML = liked.map(src => `<img src="${src}" />`).join("");
}

// Restart button
restartBtn.addEventListener("click", loadCats);

loadCats();
