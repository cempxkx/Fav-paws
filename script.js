const NUM_CATS = 10;
let currentIndex = 0;
let liked = [];
let cards = [];

const cardContainer = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCountEl = document.getElementById("like-count");
const likedImagesEl = document.getElementById("liked-images");

// Fetch Cat Images
async function loadCats() {
  const images = [];

  for (let i = 0; i < NUM_CATS; i++) {
    images.push(`https://cataas.com/cat?random=${Date.now()}-${i}`);
  }

  images.forEach((src, index) => createCard(src, index));
}

// Create swipeable card
function createCard(src, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = src;

  card.appendChild(img);
  cardContainer.appendChild(card);

  addSwipe(card, src);

  cards.push(card);
}

function addSwipe(card, src) {
  let startX = 0, currentX = 0;

  card.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchmove", (e) => {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX/20}deg)`;
  });

  card.addEventListener("touchend", () => {
    if (currentX > 120) {
      handleSwipe("right", src, card);
    } else if (currentX < -120) {
      handleSwipe("left", src, card);
    } else {
      card.style.transform = "translateX(0)";
    }

    currentX = 0;
  });
}

function handleSwipe(direction, src, card) {
  card.style.transition = "0.3s";
  card.style.transform = direction === "right" ? "translateX(400px)" : "translateX(-400px)";

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

loadCats();
