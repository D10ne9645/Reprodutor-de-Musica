const audio = document.getElementById("audio");
const title = document.getElementById("title");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const fileInput = document.getElementById("file-input");
const playlistEl = document.getElementById("playlist");

let playlist = [];
let currentIndex = -1;
let audioURL = null;
let isPlaying = false;

function formatTime(time) {
  const minutos = Math.floor(time / 60) || 0;
  const segundos = Math.floor(time % 60) || 0;
  return `${minutos < 10 ? "0" : ""}${minutos}:${segundos < 10 ? "0" : ""}${segundos}`;
}

function resetPlayer() {
  progress.value = 0;
  currentTimeEl.textContent = "00:00";
  durationEl.textContent = "00:00";
  playBtn.querySelector("#icon-play").style.display = "block";
  playBtn.querySelector("#icon-pause").style.display = "none";
  playBtn.disabled = true;
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  progress.disabled = true;
  title.textContent = "Nenhuma música selecionada";
  clearPlaylistHighlight();
}

function loadTrack(index) {
  if (index < 0 || index >= playlist.length) return;

  if (audioURL) {
    URL.revokeObjectURL(audioURL);
  }

  currentIndex = index;
  const file = playlist[index];
  audioURL = URL.createObjectURL(file);
  audio.src = audioURL;
  title.textContent = file.name;

  highlightPlaylistItem(index);

  playBtn.disabled = false;
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === playlist.length - 1;
  progress.disabled = false;
  isPlaying = false;

  audio.pause();
  progress.value = 0;
  currentTimeEl.textContent = "00:00";
  durationEl.textContent = "00:00";
}

function highlightPlaylistItem(index) {
  clearPlaylistHighlight();
  const items = playlistEl.querySelectorAll("li");
  if (items[index]) {
    items[index].classList.add("active");
  }
}

function clearPlaylistHighlight() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((item) => item.classList.remove("active"));
}

function playPause() {
  if (!audio.src) return;
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

audio.addEventListener("play", () => {
  isPlaying = true;
  playBtn.querySelector("#icon-play").style.display = "none";
  playBtn.querySelector("#icon-pause").style.display = "block";
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playBtn.querySelector("#icon-play").style.display = "block";
  playBtn.querySelector("#icon-pause").style.display = "none";
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (progress.value / 100) * audio.duration;
});

playBtn.addEventListener("click", playPause);

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    loadTrack(currentIndex - 1);
    audio.play();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < playlist.length - 1) {
    loadTrack(currentIndex + 1);
    audio.play();
  }
});

fileInput.addEventListener("change", (e) => {
  if (!e.target.files.length) return;

  playlist = Array.from(e.target.files);
  playlistEl.innerHTML = "";

  playlist.forEach((file, index) => {
    const li = document.createElement("li");
    li.textContent = file.name;
    li.addEventListener("click", () => {
      loadTrack(index);
      audio.play();
    });
    playlistEl.appendChild(li);
  });

  loadTrack(0);
});

resetPlayer();
