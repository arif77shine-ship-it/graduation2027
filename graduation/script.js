
/* =====================================
   PENGATURAN UNDANGAN
===================================== */

const CONFIG = {
    sekolah: "SMK SYADAM",
    tahun: "2027",
  
    // Contoh tanggal. Sesuaikan dengan jadwal resmi.
    tanggalISO: "2027-06-20T08:00:00+07:00",
    tanggalTeks: "Sabtu, 20 Juni 2027",
    waktu: "08.00 WIB sampai selesai",
  
    lokasi: "Gedung Serbaguna Anton Soedjarwo",
    alamat: "Jl Raya Tonjong, Desa Cimanggis Kecamatan Bojonggede",
  
    // Gunakan kode negara, tanpa tanda +.
    whatsapp: "62822133880"
  };
  
  
  /* =====================================
     NAMA TAMU DARI LINK
  ===================================== */
  
  const params = new URLSearchParams(location.search);
  const namaURL = params.get("to");
  
  const namaTamu = namaURL
    ? namaURL.trim().slice(0, 100) || "Tamu Undangan"
    : "Tamu Undangan";
  
  document.getElementById("guestName").textContent = namaTamu;
  document.getElementById("guestNameInside").textContent = namaTamu;
  
  
  /* =====================================
     INFORMASI ACARA
  ===================================== */
  
  document.getElementById("eventTitle").textContent =
    `Wisuda ${CONFIG.sekolah} Tahun Pelajaran ${CONFIG.tahun}`;
  
  document.getElementById("eventDate").textContent =
    `Tanggal: ${CONFIG.tanggalTeks}`;
  
  document.getElementById("eventTime").textContent =
    `Waktu: ${CONFIG.waktu}`;
  
  document.getElementById("eventLocation").textContent =
    `Tempat: ${CONFIG.lokasi} — ${CONFIG.alamat}`;
  
  document.getElementById("mapsLink").href =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(CONFIG.alamat);
  
  
  /* =====================================
     BUKA UNDANGAN DAN MUSIK
  ===================================== */
  
  const cover = document.getElementById("cover");
  const invitation = document.getElementById("invitation");
  const music = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  
  document.getElementById("openInvitation").addEventListener(
    "click",
    async () => {
      cover.hidden = true;
      invitation.hidden = false;
      musicToggle.hidden = false;
  
      // Mulai musik setelah pengguna menekan tombol.
      try {
        await music.play();
        musicToggle.textContent = "♫ Musik: ON";
      } catch (error) {
        musicToggle.textContent = "♫ Putar Musik";
      }
  
      // Jalankan video latar setelah isi dibuka.
      const video = document.querySelector(".background-video");
  
      if (video) {
        video.play().catch(() => {});
      }
  
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  );
  
  
  /* =====================================
     TOMBOL ON/OFF MUSIK
  ===================================== */
  
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.textContent = "♫ Musik: ON";
      } catch (error) {
        musicToggle.textContent = "♫ Putar Musik";
      }
    } else {
      music.pause();
      musicToggle.textContent = "♫ Musik: OFF";
    }
  });
  
  
  /* =====================================
     HITUNG MUNDUR
  ===================================== */
  
  const target = new Date(CONFIG.tanggalISO).getTime();
  
  function updateCountdown() {
    const distance = target - Date.now();
  
    if (!Number.isFinite(target)) {
      document.getElementById("countdownMessage").textContent =
        "Periksa pengaturan tanggal acara.";
      return;
    }
  
    if (distance <= 0) {
      ["days", "hours", "minutes", "seconds"].forEach(id => {
        document.getElementById(id).textContent = "00";
      });
  
      document.getElementById("countdownMessage").textContent =
        distance > -86400000
          ? "Hari wisuda telah tiba!"
          : "Acara wisuda telah berlalu.";
  
      return;
    }
  
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };
  
    Object.entries(values).forEach(([id, value]) => {
      document.getElementById(id).textContent =
        String(value).padStart(2, "0");
    });
  
    document.getElementById("countdownMessage").textContent =
      "Kami menantikan kehadiran Anda.";
  }
  
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  
  /* =====================================
     KONFIRMASI WHATSAPP
  ===================================== */
  
  document.getElementById("rsvpForm").addEventListener(
    "submit",
    event => {
      event.preventDefault();
  
      const nama =
        document.getElementById("rsvpName").value.trim();
  
      const kehadiran =
        document.getElementById("attendance").value;
  
      const jumlah =
        document.getElementById("guestCount").value;
  
      const pesan =
        document.getElementById("rsvpMessage").value.trim();
  
      if (!nama) {
        alert("Silakan isi nama terlebih dahulu.");
        return;
      }
  
      const isiPesan = [
        `KONFIRMASI WISUDA ${CONFIG.sekolah}`,
        `Tahun Pelajaran ${CONFIG.tahun}`,
        "",
        `Nama: ${nama}`,
        `Undangan untuk: ${namaTamu}`,
        `Kehadiran: ${kehadiran}`,
        `Jumlah orang: ${jumlah}`,
        `Pesan: ${pesan || "-"}`,
        "",
        `Tanggal: ${CONFIG.tanggalTeks}`,
        `Lokasi: ${CONFIG.lokasi}`
      ].join("\n");
  
      const url =
        `https://wa.me/${CONFIG.whatsapp}?text=` +
        encodeURIComponent(isiPesan);
  
      window.open(url, "_blank", "noopener");
    }
  );
  
  
  /* =====================================
     BAGIKAN LINK PERSONAL
  ===================================== */
  
  document.getElementById("shareButton").addEventListener(
    "click",
    async () => {
      const url = new URL(location.href);
      url.searchParams.set("to", namaTamu);
  
      const data = {
        title: `Undangan Wisuda ${CONFIG.sekolah}`,
        text: `Undangan wisuda untuk ${namaTamu}`,
        url: url.href
      };
  
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch (error) {
          // Pengguna mungkin membatalkan menu berbagi.
        }
      } else {
        try {
          await navigator.clipboard.writeText(url.href);
          alert("Link undangan berhasil disalin.");
        } catch (error) {
          window.prompt("Salin link undangan ini:", url.href);
        }
      }
    }
  );
  