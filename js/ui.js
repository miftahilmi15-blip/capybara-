/* ==========================================================================
   CAPY SOVEREIGN OS - INTERFACE UI CONTROLLER
   Pengendali Sistem Navigasi Tab, Routing Iframe, dan Animasi Mikro Pendar
   ========================================================================== */

import { triggerChildUIUpdate } from './engine.js';

/**
 * Fungsi Utama Perpindahan Halaman Anak Melalui Gerbang Iframe
 * @param {string} pageUrl - Nama file html tujuan (misal: 'market.html')
 * @param {HTMLElement} element - Elemen tombol kotak navigasi yang diklik
 */
window.changePage = function(pageUrl, element) {
    const frame = document.getElementById('content-frame');
    if (!frame) return;

    // Jembatan khusus: Jika index manggil cpu.html, belokkan langsung ke market.html yang baru
    let targetUrl = pageUrl;
    if (pageUrl === 'cpu.html') {
        targetUrl = 'market.html';
    }

    // Ubah src iframe untuk memuat file halaman anak yang baru
    frame.src = targetUrl;

    // Perbarui status kelas aktif pada bar navigasi bawah jika dipicu oleh klik menu
    if (element) {
        document.querySelectorAll('.nav-item-box').forEach(item => {
            item.classList.remove('active');
        });
        element.classList.add('active');
    }

    // Berikan feedback getaran ketukan halus khas Telegram WebApp
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    // Paksa sinkronisasi ulang angka saldo koin setelah frame halaman sukses termuat
    frame.onload = () => {
        triggerChildUIUpdate();
    };
};

// Pasang pengamat global untuk memastikan seluruh klik menu berjalan tanpa hambatan
document.addEventListener('DOMContentLoaded', () => {
    console.log("Sovereign Navigation Engine Online.");
});
