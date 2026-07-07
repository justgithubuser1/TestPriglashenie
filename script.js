const weddingDate = new Date("2026-08-28T11:00:00+07:00").getTime();

const swiper = new Swiper(".wedding-swiper", {
  direction: "horizontal",
  speed: 850,
  parallax: true,
  grabCursor: true,
  keyboard: {
    enabled: true,
  },
  mousewheel: {
    forceToAxis: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".nav-button.next",
    prevEl: ".nav-button.prev",
  },
});

document.querySelector("[data-next]")?.addEventListener("click", () => {
  swiper.slideNext();
});

const parts = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = Math.max(0, weddingDate - Date.now());
  const seconds = Math.floor(distance / 1000);

  parts.days.textContent = pad(Math.floor(seconds / 86400));
  parts.hours.textContent = pad(Math.floor((seconds % 86400) / 3600));
  parts.minutes.textContent = pad(Math.floor((seconds % 3600) / 60));
  parts.seconds.textContent = pad(seconds % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.querySelector("#rsvpForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  const status = document.querySelector("#formStatus");
  const submitButton = form.querySelector('button[type="submit"]');
  const googleFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSfhaXCjhxuuI5-KfU_b5iTl3tzj27etQwgmQShgyWycjRwHAw/formResponse";
  const payload = new URLSearchParams({
    "entry.933417631": data.guest_names || "",
    "entry.1435269813": data.attendance || "",
    "entry.286896690": data.message || "",
  });

  submitButton.disabled = true;
  status.textContent = "Отправляем ответ...";

  fetch(googleFormUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload,
  })
    .then(() => {
      status.textContent = "Спасибо! Ответ отправлен.";
      form.reset();
    })
    .catch(() => {
      status.textContent =
        "Не получилось отправить ответ. Пожалуйста, попробуйте еще раз.";
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
