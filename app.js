(function () {
  const LINE_OA_URL = "https://line.me/R/ti/p/%40210dgcif";
  const STORAGE = {
    rsvp: "peemai-jerd-rsvp",
    book: "peemai-jerd-guestbook",
    photos: "peemai-jerd-guest-photos",
    day: "peemai-jerd-day",
  };

  const SEATS = [
    { name: "ลุงสมชาย", table: "โต๊ะ 3 · ญาติฝ่ายเจ้าบ่าว", day: "nks" },
    { name: "ป้าสมศรี", table: "โต๊ะ 3 · ญาติฝ่ายเจ้าบ่าว", day: "nks" },
    { name: "พี่มิ้นท์", table: "โต๊ะ 1 · เพื่อนเจ้าสาว", day: "nks" },
    { name: "คุณแม่ปีใหม่", table: "โต๊ะหัว · ครอบครัวเจ้าสาว", day: "bkk" },
    { name: "คุณพ่อเจิด", table: "โต๊ะหัว · ครอบครัวเจ้าบ่าว", day: "bkk" },
    { name: "เพื่อนออฟฟิศ", table: "โต๊ะ 5 · เพื่อนร่วมงาน", day: "bkk" },
  ];

  const CALENDARS = {
    nks: {
      title: "งานแต่ง ปีใหม่ & เจิด · นครสวรรค์",
      start: "20261227T070000",
      end: "20261227T140000",
      location: "จังหวัดนครสวรรค์",
    },
    bkk: {
      title: "งานแต่ง ปีใหม่ & เจิด · กรุงเทพฯ",
      start: "20270123T090000",
      end: "20270123T140000",
      location: "กรุงเทพมหานคร",
    },
  };

  let currentDay = localStorage.getItem(STORAGE.day) || "nks";

  function setDay(day) {
    currentDay = day === "bkk" ? "bkk" : "nks";
    localStorage.setItem(STORAGE.day, currentDay);
    document.querySelectorAll("[data-panel]").forEach(function (el) {
      el.classList.toggle("hidden", el.getAttribute("data-panel") !== currentDay);
    });
    document.querySelectorAll(".day-btn").forEach(function (btn) {
      const active = btn.getAttribute("data-day") === currentDay;
      const onCover = Boolean(btn.closest("#cover"));
      btn.classList.toggle("bg-leaf", active);
      btn.classList.toggle("text-petal", active);
      btn.classList.toggle("text-moss", !active && !onCover);
      btn.classList.toggle("text-white/70", !active && onCover);
    });
  }

  document.querySelectorAll(".day-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setDay(btn.getAttribute("data-day"));
    });
  });
  setDay(currentDay);

  const events = [
    {
      id: "nks",
      start: new Date("2026-12-27T07:00:00+07:00"),
      end: new Date("2026-12-27T14:00:00+07:00"),
      live: "กำลังจัดงานที่นครสวรรค์ ♡",
      done: "งานนครสวรรค์จบลงแล้ว",
    },
    {
      id: "bkk",
      start: new Date("2027-01-23T09:00:00+07:00"),
      end: new Date("2027-01-23T14:00:00+07:00"),
      live: "กำลังจัดงานที่กรุงเทพฯ ♡",
      done: "งานกรุงเทพฯ จบลงแล้ว",
    },
  ];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function renderCountdown(event, now) {
    const grid = document.getElementById("grid-" + event.id);
    const status = document.getElementById("status-" + event.id);
    if (!grid || !status) return;
    const set = function (part, value) {
      document.getElementById(part + "-" + event.id).textContent = value;
    };

    if (now >= event.end) {
      set("days", "00");
      set("hours", "00");
      set("minutes", "00");
      set("seconds", "00");
      grid.classList.add("opacity-50");
      status.textContent = event.done;
      status.classList.remove("hidden");
      return;
    }

    if (now >= event.start) {
      set("days", "00");
      set("hours", "00");
      set("minutes", "00");
      set("seconds", "00");
      status.textContent = event.live;
      status.classList.remove("hidden");
      return;
    }

    const diff = event.start.getTime() - now.getTime();
    set("days", pad(Math.floor(diff / 86400000)));
    set("hours", pad(Math.floor((diff % 86400000) / 3600000)));
    set("minutes", pad(Math.floor((diff % 3600000) / 60000)));
    set("seconds", pad(Math.floor((diff % 60000) / 1000)));
    status.classList.add("hidden");
  }

  function tick() {
    const now = new Date();
    events.forEach(function (event) {
      renderCountdown(event, now);
    });
  }
  tick();
  setInterval(tick, 1000);

  const YT_VIDEO_ID = "ULi50yOWMuE";
  const nksPlay = document.getElementById("nks-play");
  const nksVideo = document.getElementById("nks-video");

  function canEmbedYouTube() {
    return location.protocol === "http:" || location.protocol === "https:";
  }

  if (nksPlay && nksVideo) {
    nksPlay.addEventListener("click", function () {
      if (canEmbedYouTube()) {
        nksVideo.innerHTML =
          '<iframe class="absolute inset-0 h-full w-full" src="https://www.youtube.com/embed/' +
          YT_VIDEO_ID +
          '?autoplay=1&rel=0&modestbranding=1" title="วิดีโอบรรยากาศงาน นครสวรรค์" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
        return;
      }
      window.open("https://www.youtube.com/watch?v=" + YT_VIDEO_ID, "_blank", "noopener");
    });
  }

  function openLineOa(event) {
    if (event) event.preventDefault();
    window.location.href = LINE_OA_URL;
  }

  document.querySelectorAll("[data-line-oa], #rsvp-link").forEach(function (el) {
    el.setAttribute("href", LINE_OA_URL);
    el.addEventListener("click", openLineOa);
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  document.querySelectorAll(".gallery-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      lightboxImg.src = btn.getAttribute("data-full");
      lightbox.classList.remove("hidden");
      lightbox.classList.add("flex");
    });
  });

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    lightboxImg.src = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  const bgm = document.getElementById("bgm");
  const musicToggle = document.getElementById("music-toggle");
  const iconPlay = document.getElementById("icon-play");
  const iconMute = document.getElementById("icon-mute");

  function setMusicUi(playing) {
    if (!musicToggle) return;
    musicToggle.setAttribute("aria-pressed", playing ? "true" : "false");
    musicToggle.setAttribute("aria-label", playing ? "ปิดเสียงเพลง" : "เปิดเพลงประกอบ");
    iconPlay.classList.toggle("hidden", playing);
    iconMute.classList.toggle("hidden", !playing);
  }

  setMusicUi(false);
  if (musicToggle && bgm) {
    musicToggle.addEventListener("click", function () {
      if (bgm.paused) {
        const playPromise = bgm.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {
            setMusicUi(false);
          });
        }
        setMusicUi(true);
      } else {
        bgm.pause();
        setMusicUi(false);
      }
    });
  }

  const moreSheet = document.getElementById("more-sheet");
  const moreOpen = document.getElementById("more-open");
  const moreClose = document.getElementById("more-close");
  const moreBackdrop = document.getElementById("more-backdrop");

  function openMore() {
    moreSheet.classList.remove("translate-y-full");
    moreBackdrop.classList.remove("hidden");
  }
  function closeMore() {
    moreSheet.classList.add("translate-y-full");
    moreBackdrop.classList.add("hidden");
  }
  if (moreOpen) moreOpen.addEventListener("click", openMore);
  if (moreClose) moreClose.addEventListener("click", closeMore);
  if (moreBackdrop) moreBackdrop.addEventListener("click", closeMore);
  document.querySelectorAll("[data-close-more]").forEach(function (el) {
    el.addEventListener("click", closeMore);
  });

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const value = btn.getAttribute("data-copy");
      if (!value) return;
      navigator.clipboard.writeText(value).then(function () {
        const old = btn.textContent;
        btn.textContent = "คัดลอกแล้ว";
        setTimeout(function () {
          btn.textContent = old;
        }, 1400);
      });
    });
  });

  function downloadIcs(key) {
    const item = CALENDARS[key];
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Peemai Jerd Wedding//TH",
      "BEGIN:VEVENT",
      "DTSTART;TZID=Asia/Bangkok:" + item.start,
      "DTEND;TZID=Asia/Bangkok:" + item.end,
      "SUMMARY:" + item.title,
      "LOCATION:" + item.location,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-" + key + ".ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  document.querySelectorAll("[data-ics]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      downloadIcs(btn.getAttribute("data-ics"));
    });
  });

  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpDone = document.getElementById("rsvp-done");
  if (localStorage.getItem(STORAGE.rsvp) && rsvpForm && rsvpDone) {
    rsvpForm.classList.add("hidden");
    rsvpDone.classList.remove("hidden");
  }
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(rsvpForm).entries());
      if (!data.name || !data.plan) return;
      localStorage.setItem(STORAGE.rsvp, JSON.stringify(data));
      rsvpForm.classList.add("hidden");
      rsvpDone.classList.remove("hidden");
    });
  }

  const seatForm = document.getElementById("seat-form");
  const seatResult = document.getElementById("seat-result");
  if (seatForm) {
    seatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const q = String(new FormData(seatForm).get("guest") || "").trim();
      if (!q) return;
      const daySeats = SEATS.filter(function (s) {
        return s.day === currentDay;
      });
      const found = daySeats.find(function (s) {
        return s.name.indexOf(q) !== -1 || q.indexOf(s.name) !== -1;
      });
      seatResult.classList.remove("hidden");
      seatResult.textContent = found
        ? found.name + " · " + found.table
        : "ยังไม่พบชื่อนี้ในผังที่นั่งวันนั้น ส่งชื่อทาง LINE ได้นะคะ เราจะจัดโต๊ะให้เอง";
    });
  }

  function readBook() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.book) || "[]");
    } catch (err) {
      return [];
    }
  }

  function renderBook() {
    const list = document.getElementById("book-list");
    if (!list) return;
    const items = readBook();
    if (!items.length) {
      list.innerHTML = '<p class="text-sm text-moss">ยังไม่มีคำอวยพร เป็นคนแรกได้เลยนะ</p>';
      return;
    }
    list.innerHTML = items
      .map(function (item) {
        return (
          '<article class="rounded-2xl bg-blush/70 px-4 py-4"><p class="font-serif text-lg">' +
          escapeHtml(item.name) +
          '</p><p class="mt-1 text-sm text-moss leading-relaxed">' +
          escapeHtml(item.message) +
          "</p></article>"
        );
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const bookForm = document.getElementById("book-form");
  if (bookForm) {
    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(bookForm).entries());
      if (!data.name || !data.message) return;
      const items = readBook();
      items.unshift({ name: data.name, message: data.message });
      localStorage.setItem(STORAGE.book, JSON.stringify(items.slice(0, 40)));
      bookForm.reset();
      renderBook();
    });
  }
  renderBook();

  function readPhotos() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.photos) || "[]");
    } catch (err) {
      return [];
    }
  }

  function renderPhotos() {
    const grid = document.getElementById("share-grid");
    if (!grid) return;
    const items = readPhotos();
    grid.innerHTML = items
      .map(function (src) {
        return '<img src="' + src + '" alt="รูปจากแขก" class="h-28 w-full rounded-xl object-cover" />';
      })
      .join("");
  }

  const shareInput = document.getElementById("share-input");
  if (shareInput) {
    shareInput.addEventListener("change", function () {
      const files = Array.from(shareInput.files || []).slice(0, 4);
      files.forEach(function (file) {
        const reader = new FileReader();
        reader.onload = function () {
          const items = readPhotos();
          items.unshift(reader.result);
          localStorage.setItem(STORAGE.photos, JSON.stringify(items.slice(0, 12)));
          renderPhotos();
        };
        reader.readAsDataURL(file);
      });
    });
  }
  renderPhotos();

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = ["cover", "schedule", "location", "rsvp", "gallery"];
  function onScroll() {
    let active = "cover";
    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top < 140) active = id;
    });
    navLinks.forEach(function (link) {
      const on = link.getAttribute("href") === "#" + active;
      link.classList.toggle("text-leaf", on);
      link.classList.toggle("text-moss", !on);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
