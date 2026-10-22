document.addEventListener("DOMContentLoaded", () => {
  // 1. Auto Close Navbar Menu di Mobile
  const navbarMenu = document.querySelector("#navbarNav");
  if (navbarMenu && window.bootstrap) {
    navbarMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (navbarMenu.classList.contains("show")) {
          window.bootstrap.Collapse.getOrCreateInstance(navbarMenu).hide();
        }
      });
    });
  }

  // 2. Data Simulasi E-Faktur (Contoh valid: 1234)
  const databaseLaundry = {
    "1234": {
      faktur: "1234",
      nama: "Ahmad Nur",
      hp: "082000000000",
      alamat: "Jl. Andi Pangeran 2 No. 12, Makassar",
      catatan: "Pakaian putih dipisah, gunakan detergen ekstra wangi.",
      currentStep: 4, // 1: Jemput, 2: Diterima, 3: Diproses, 4: Dicuci, 5: Dikeringkan, 6: Dipacking, 7: Diantar
      statusText: "Pakaian sedang dicuci"
    }
  };

  const trackingForm = document.getElementById("trackingForm");
  const trackingFormView = document.getElementById("trackingFormView");
  const trackingDetailView = document.getElementById("trackingDetailView");
  const noFakturInput = document.getElementById("noFaktur");
  const trackingError = document.getElementById("trackingError");
  const btnKembali = document.getElementById("btnKembali");

  // Elemen Detail Hasil Pelacakan
  const resFaktur = document.getElementById("resFaktur");
  const resNama = document.getElementById("resNama");
  const resHp = document.getElementById("resHp");
  const resAlamat = document.getElementById("resAlamat");
  const resCatatan = document.getElementById("resCatatan");
  const resStatusText = document.getElementById("resStatusText");

  if (trackingForm) {
    trackingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const kode = noFakturInput.value.trim();

      if (databaseLaundry[kode]) {
        // Jika E-Faktur Ditemukan
        trackingError.classList.add("d-none");
        const data = databaseLaundry[kode];

        // Isi data ke halaman detail
        resFaktur.textContent = data.faktur;
        resNama.textContent = data.nama;
        resHp.textContent = data.hp;
        resAlamat.textContent = data.alamat;
        resCatatan.textContent = data.catatan;
        resStatusText.textContent = data.statusText;

        // Render Tahapan / Progress Tracker (1 sampai 7)
        const timelineItems = document.querySelectorAll(".timeline-item");
        timelineItems.forEach((item) => {
          const stepIndex = parseInt(item.getAttribute("data-step"));
          item.classList.remove("completed", "active");

          if (stepIndex < data.currentStep) {
            item.classList.add("completed");
          } else if (stepIndex === data.currentStep) {
            item.classList.add("active");
          }
        });

        // Transisi Tampilan Form ke Detail Tanpa Reload Halaman
        trackingFormView.classList.add("d-none");
        trackingDetailView.classList.remove("d-none");
      } else {
        // Jika E-Faktur Salah atau Kosong
        trackingError.textContent = "Nomor E-Faktur tidak ditemukan atau salah.";
        trackingError.classList.remove("d-none");
      }
    });
  }

  // Tombol Kembali dari Halaman Detail Pelacakan
  if (btnKembali) {
    btnKembali.addEventListener("click", () => {
      trackingDetailView.classList.add("d-none");
      trackingFormView.classList.remove("d-none");
      noFakturInput.value = "";
      trackingError.classList.add("d-none");
    });
  }

  // 3. Logika Modal Pesan Antar-Jemput (Pengiriman ke Database & Auto Close)
  const orderModalEl = document.getElementById("orderModal");
  if (orderModalEl) {
    const orderModal = new bootstrap.Modal(orderModalEl);
    const modalLayananName = document.getElementById("modalLayananName");
    const modalLayananHarga = document.getElementById("modalLayananHarga");
    const orderForm = document.getElementById("orderForm");
    const btnSubmitOrder = document.getElementById("btnSubmitOrder");
    const submitSpinner = document.getElementById("submitSpinner");
    const btnSubmitText = document.getElementById("btnSubmitText");

    const successToastEl = document.getElementById("successToast");
    const successToast = successToastEl ? new bootstrap.Toast(successToastEl) : null;

    let currentLayanan = "";

    document.querySelectorAll(".btn-pesan-modal").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentLayanan = btn.getAttribute("data-layanan") || "Cuci Kering";
        const hargaLayanan = btn.getAttribute("data-harga") || "Rp 6.000 / kg";

        orderForm.reset();
        modalLayananName.textContent = currentLayanan;
        modalLayananHarga.textContent = hargaLayanan;
        orderModal.show();
      });
    });

    orderForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const orderData = {
        nama: document.getElementById("modalNama").value.trim(),
        hp: document.getElementById("modalHp").value.trim(),
        alamat: document.getElementById("modalAlamat").value.trim(),
        waktu: document.getElementById("modalWaktuJemput").value || "Secepatnya",
        catatan: document.getElementById("modalCatatan").value.trim() || "-",
        layanan: currentLayanan,
        created_at: newDeviceTimestamp = new Date().toISOString()
      };

      btnSubmitOrder.disabled = true;
      submitSpinner.classList.remove("d-none");
      btnSubmitText.textContent = "MEMPROSES...";

      setTimeout(() => {
        console.log("Data pesanan berhasil dikirim ke database:", orderData);
        btnSubmitOrder.disabled = false;
        submitSpinner.classList.add("d-none");
        btnSubmitText.textContent = "PESAN";
        orderModal.hide();

        if (successToast) {
          successToast.show();
        }
      }, 800);
    });
  }
});