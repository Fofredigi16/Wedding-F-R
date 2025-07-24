const firebaseConfig = {
  apiKey: "AIzaSyCyrzKXSIME9yAlIXuE8zcAdrehk9SrrFo",
  authDomain: "weddingfadlirosi.firebaseapp.com",
  databaseURL: "https://weddingfadlirosi-default-rtdb.firebaseio.com",
  projectId: "weddingfadlirosi",
  storageBucket: "weddingfadlirosi.firebasestorage.app",
  messagingSenderId: "773143374207",
  appId: "1:773143374207:web:83a262d26b5dc817a0124a",
};
// Init Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

firebase
  .database()
  .ref("BestWishes")
  .on("child_added", function (snapshot) {
    // tampilkan ucapan ke semua orang
  });

/* Slide Hal1 ke Hal2 */
const lihatBtn = document.getElementById("lihatUndangan");
const landing = document.getElementById("landing");
const mainContent = document.getElementById("mainContent");

lihatBtn.addEventListener("click", function () {
  landing.style.display = "none"; // langsung hilang tanpa animasi
  mainContent.classList.add("visible"); // muncul dengan fade-in
  AOS.refresh();
});

/* List RSVP */
const rsvpForm = document.getElementById("rsvpForm");
const rsvpList = document.getElementById("rsvpList");
const rsvpPageNumbers = document.getElementById("rsvpPageNumbers");

const rsvpPerPage = 3;
let rsvpCurrentPage = 1;
let rsvpData = [];

// == SUBMIT HANDLER == //
rsvpForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("rsvpName").value.trim();
  const address = document.getElementById("rsvpAddress").value.trim();
  const attend = document.getElementById("rsvpAttend").value;

  if (name && address && attend) {
    firebase.database().ref("rsvp").push({
      name,
      address,
      attend,
      timestamp: Date.now(),
    });
    rsvpData.unshift({ name, address, attend });
    renderRSVP();
    rsvpForm.reset();
    alert("RSVP berhasil dikirim 🙏");
  }
});
// Ambil semua data dari Firebase saat halaman dibuka
function fetchRSVPs() {
  firebase
    .database()
    .ref("rsvp")
    .orderByChild("timestamp")
    .once("value", (snapshot) => {
      const entries = [];
      snapshot.forEach((child) => {
        entries.unshift(child.val()); // agar yang baru ada di atas
      });
      rsvpData = entries;
      renderRSVP();
    });
}

// Render RSVP sesuai halaman
function renderRSVP() {
  rsvpList.innerHTML = "";
  const start = (rsvpCurrentPage - 1) * rsvpPerPage;
  const end = start + rsvpPerPage;
  const currentData = rsvpData.slice(start, end);

  currentData.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "rsvp-item";
    div.innerHTML = `<strong>${entry.name}</strong> dari ${entry.address} — <em>${entry.attend}</em>`;
    rsvpList.appendChild(div);
  });

  renderPageNumbers();
}

// Render nomor halaman RSVP
function renderPageNumbers() {
  const totalPages = Math.ceil(rsvpData.length / rsvpPerPage);
  rsvpPageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === rsvpCurrentPage) btn.style.fontWeight = "bold";
    btn.onclick = () => {
      rsvpCurrentPage = i;
      renderRSVP();
    };
    rsvpPageNumbers.appendChild(btn);
  }
}

// Fungsi pindah halaman
function prevRsvpPage() {
  if (rsvpCurrentPage > 1) {
    rsvpCurrentPage--;
    renderRSVP();
  }
}
function nextRsvpPage() {
  const totalPages = Math.ceil(rsvpData.length / rsvpPerPage);
  if (rsvpCurrentPage < totalPages) {
    rsvpCurrentPage++;
    renderRSVP();
  }
}
// Jalankan ketika DOM siap
document.addEventListener("DOMContentLoaded", fetchRSVPs);

/* Gift */
function toggleGift() {
  const info = document.getElementById("giftInfo");
  info.classList.toggle("hidden");
}

function copyRek(id) {
  const noRek = document.getElementById(id).innerText;
  navigator.clipboard.writeText(noRek).then(() => {
    alert("Nomor rekening berhasil disalin!");
  });
}

/* Best Wishes */
// Firebase sinkronisasi untuk Best Wishes
const guestMessage = document.getElementById("guestMessage");
const charCount = document.getElementById("charCount");
const wishForm = document.getElementById("wishForm");
const wishContainer = document.getElementById("wishContainer");

const perPage = 3;
let currentPage = 1;
let wishes = [];

// Hitung karakter
guestMessage.addEventListener("input", () => {
  charCount.textContent = `${guestMessage.value.length} / 500`;
});

// Submit ke Firebase
wishForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const message = guestMessage.value.trim();

  if (name && message) {
    firebase.database().ref("bestWishes").push({
      name,
      message,
      timestamp: Date.now(),
    });

    // Tambah ke array lokal supaya langsung tampil
    wishes.unshift({ name, message });
    wishForm.reset();
    charCount.textContent = "0 / 500";
    currentPage = 1;
    renderWishes();
  }
});

// Ambil dari Firebase
function fetchBestWishes() {
  firebase
    .database()
    .ref("bestWishes")
    .orderByChild("timestamp")
    .once("value", (snapshot) => {
      const entries = [];
      snapshot.forEach((child) => {
        entries.unshift(child.val());
      });
      wishes = entries;
      renderWishes();
    });
}

document.addEventListener("DOMContentLoaded", fetchBestWishes);

function renderWishes() {
  wishContainer.innerHTML = "";
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const paginated = wishes.slice(start, end);

  paginated.forEach(({ name, message }) => {
    const div = document.createElement("div");
    div.className = "wish-item";
    div.innerHTML = `<strong>${name}</strong><p>${message}</p>`;
    wishContainer.appendChild(div);
  });

  renderPageNumbers();
}

function renderPageNumbers() {
  const totalPages = Math.ceil(wishes.length / perPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(
      (num) =>
        `<button onclick="goToPage(${num})" ${
          num === currentPage ? 'style="font-weight:bold"' : ""
        }>${num}</button>`
    )
    .join(" ");
  document.getElementById("pageNumbers").innerHTML = pageNumbers;
}

function goToPage(page) {
  currentPage = page;
  renderWishes();
}
function nextPage() {
  const totalPages = Math.ceil(wishes.length / perPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderWishes();
  }
}
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderWishes();
  }
}

/* Backsound */
const music = document.getElementById("bgMusic");
const toggleBtn = document.getElementById("toggleMusic");
let isPlaying = false;

// Putar musik saat klik tombol "Lihat Undangan"
lihatBtn.addEventListener("click", function () {
  landing.style.display = "none";
  mainContent.classList.add("visible");

  // Play music setelah user interaction
  music
    .play()
    .then(() => {
      isPlaying = true;
      toggleBtn.textContent = "▶︎";
    })
    .catch((e) => {
      console.log("Autoplay gagal:", e);
    });
});

// Toggle music tombol
toggleBtn.addEventListener("click", function () {
  if (isPlaying) {
    music.pause();
    toggleBtn.textContent = "♫";
  } else {
    music.play();
    toggleBtn.textContent = "▶︎";
  }
  isPlaying = !isPlaying;
});

const musicControl = document.getElementById("musicControl");
const journeySection = document.getElementById("Journey");

window.addEventListener("scroll", () => {
  const journeyTop = journeySection.offsetTop;
  const scrollPos = window.scrollY + window.innerHeight;

  if (scrollPos >= journeyTop + 100) {
    musicControl.classList.add("show");
  } else {
    musicControl.classList.remove("show");
  }
});

/* Distribusi */
// Ambil parameter dari URL
const urlParams = new URLSearchParams(window.location.search);
const gst = urlParams.get("to");
// Tampilkan nama jika ada
if (gst) {
  const decodedName = decodeURIComponent(gst.replace(/\+/g, " "));
  document.getElementById("gstName").textContent = decodedName;
}
