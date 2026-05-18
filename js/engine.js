/* ==========================================================================
   CAPY SOVEREIGN OS - CORE ENGINE CONTROLLER
   Manajemen State Pemain, Sinkronisasi Cloud, Animasi Booting & Mining Ticker
   ========================================================================== */

import { db } from './firebase.js';

// Global Game State (Cadangan jika ekosistem eksternal mati)
window.playerTelegramId = "GUEST_USER"; 
window.playerData = { 
    coins: 0, 
    level: 1, 
    energy: 1000, 
    max_energy: 1000, 
    multitap_level: 1, 
    cph: 0, 
    rigs: {}, 
    upgraded_cards: {} 
}; 

/**
 * Inisialisasi Utama Mesin Core OS
 */
export function initCoreEngine() {
    // 1. Deteksi & Integrasi Telegram WebApp SDK
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();

        const userData = tg.initDataUnsafe?.user;
        if (userData) {
            window.playerTelegramId = String(userData.id);
            
            // Atur nama pengguna di Header Utama (Kapital total)
            const titleElement = document.getElementById('user-title');
            if (titleElement) {
                titleElement.innerText = userData.username ? `Capy_${userData.username}_OS`.toUpperCase() : `Capy_${userData.first_name}_OS`.toUpperCase();
            }
            
            // Ambil foto profil Telegram jika tersedia
            const avatarElement = document.getElementById('user-avatar');
            if (avatarElement) {
                avatarElement.src = userData.photo_url || "logo-192.png";
            }
            
            // Muat data dari Firestore
            checkAndLoadUserData(window.playerTelegramId, userData.first_name);
        } else {
            initTelegramAnalytics("GUEST_USER");
            startBootingAnimation();
        }
    } else {
        initTelegramAnalytics("GUEST_USER");
        startBootingAnimation();
    }

    // 2. Jalankan Mesin Penghitung Koin Pasif (Mining Ticker)
    initMiningTicker();
}

/**
 * Inisialisasi Analytics TMA
 */
function initTelegramAnalytics(userId) {
    if (typeof TMAAnalytics !== 'undefined') {
        TMAAnalytics.init({ token: "=!=", appName: "Capy Sovereign", userId: userId });
        TMAAnalytics.trackEvent('Session_Start', { user_type: userId === "GUEST_USER" ? "Guest" : "Verified" });
    }
}

/**
 * Pengecekan atau Registrasi Pengguna Baru di Database Firestore Cloud
 */
function checkAndLoadUserData(userId, name) {
    db.collection("players").doc(userId).get().then((doc) => {
        if (doc.exists) {
            window.playerData = { ...window.playerData, ...doc.data() };
            console.log("Sovereign Database Synchronized:", window.playerData);
        } else {
            // Skema registrasi awal akun baru
            const initialData = {
                telegramId: userId, 
                firstName: name, 
                coins: 0, 
                level: 1, 
                energy: 1000, 
                max_energy: 1000, 
                multitap_level: 1, 
                cph: 0, 
                rigs: {}, 
                upgraded_cards: {},
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            };
            db.collection("players").doc(userId).set(initialData).then(() => {
                window.playerData = initialData;
                console.log("New Sovereign Agent Registered!");
            });
        }
        triggerChildUIUpdate();
        initTelegramAnalytics(userId);
        startBootingAnimation();
    }).catch((error) => {
        console.error("Cloud Connection Failure:", error);
        initTelegramAnalytics(userId);
        startBootingAnimation();
    });
}

/**
 * Pemicu Sekaligus Pengendali Animasi Terminal Booting Screen
 */
function startBootingAnimation() {
    const termId = document.getElementById('terminal-tg-id');
    if (termId && window.playerTelegramId !== "GUEST_USER") {
        termId.innerText = window.playerTelegramId;
    }

    // Delai cetak log terminal militer dalam milidetik
    const delays = [300, 900, 1600, 2400, 3100, 3600, 4100];
    for (let i = 1; i <= 7; i++) {
        setTimeout(() => {
            const line = document.getElementById(`log-line-${i}`);
            if (line) line.classList.remove('hidden');
            if (i === 7 && window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        }, delays[i-1]);
    }

    // Hilangkan boot screen setelah seluruh log sukses dicetak
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.classList.add('opacity-0', 'scale-105');
            setTimeout(() => bootScreen.style.display = 'none', 700);
        }
    }, 4700);
}

/**
 * Fungsi Pengiriman Sinyal Pembaruan UI ke Halaman Anak (Iframe)
 */
export function triggerChildUIUpdate() {
    const frame = document.getElementById('content-frame');
    if (frame?.contentWindow?.updateUI) {
        frame.contentWindow.updateUI();
    }
}

/**
 * Jembatan Utama Penyimpanan Data ke Firestore Cloud
 */
window.saveDataToFirebase = function(updatedData) {
    window.playerData = { ...window.playerData, ...updatedData };
    if (window.playerTelegramId === "GUEST_USER") {
        triggerChildUIUpdate();
        return;
    }
    const dataToSave = { ...window.playerData, lastUpdated: firebase.firestore.FieldValue.serverTimestamp() };
    db.collection("players").doc(window.playerTelegramId).update(dataToSave)
        .then(() => triggerChildUIUpdate())
        .catch((err) => console.error("Cloud Sync Interrupted:", err));
};

/**
 * Siklus Ticker Pengisian Penambangan Pasif (3 Jam Max Capacity)
 */
function initMiningTicker() {
    let lastClaimTime = localStorage.getItem('last_mining_claim');
    if (!lastClaimTime) {
        lastClaimTime = Date.now() - (3 * 3600 * 1000);
        localStorage.setItem('last_mining_claim', lastClaimTime);
    } else {
        lastClaimTime = parseInt(lastClaimTime);
    }

    setInterval(() => {
        const hexBg = document.getElementById('hex-node-bg');
        const coinsText = document.getElementById('exec-coins-text');
        const timerText = document.getElementById('exec-timer-text');
        if (!hexBg || !coinsText || !timerText) return;

        // Jika CPH masih nol, matikan visual penambangan
        if (!window.playerData || !window.playerData.cph || window.playerData.cph === 0) {
            hexBg.style.background = "transparent";
            coinsText.innerText = "EXEC";
            coinsText.style.color = "#22d3ee";
            timerText.style.display = "none";
            return;
        }

        const cph = window.playerData.cph;
        const now = Date.now();
        const elapsedSeconds = (now - parseInt(localStorage.getItem('last_mining_claim') || lastClaimTime)) / 1000;
        
        const maxMiningSeconds = 3 * 3600; // Pembatasan siklus klaim per 3 jam
        const remainingSeconds = Math.max(0, maxMiningSeconds - elapsedSeconds);
        const effectiveSeconds = Math.min(elapsedSeconds, maxMiningSeconds);
        const accumulatedCoins = Math.floor((effectiveSeconds / 3600) * cph);
        const fillPercentage = (effectiveSeconds / maxMiningSeconds) * 100;

        // Efek isi tabung cairan koin pasif dari bawah ke atas
        hexBg.style.background = `linear-gradient(to top, rgba(34, 211, 238, 0.15) ${fillPercentage}%, transparent ${fillPercentage}%)`;
        timerText.style.display = "block";
        coinsText.style.color = '#22d3ee';
        timerText.style.color = 'rgba(34, 211, 238, 0.6)';

        if (remainingSeconds > 0) {
            const hrs = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
            const secs = String(Math.floor(remainingSeconds % 60)).padStart(2, '0');
            timerText.innerText = `${hrs}:${mins}:${secs}`;
            coinsText.innerText = accumulatedCoins > 0 ? accumulatedCoins.toLocaleString('id-ID') : "MINING";
        } else {
            coinsText.innerText = accumulatedCoins.toLocaleString('id-ID');
            timerText.innerText = "CLAIM READY";
            timerText.style.color = '#34d399'; 
        }
    }, 1000);
}

/**
 * Aksi Eksekusi Klaim Koin Pasif Saat Tombol Tengah Ditekan
 */
window.claimPassiveMining = function() {
    const frame = document.getElementById('content-frame');
    frame.src = 'home.html';
    document.querySelectorAll('.nav-item-box').forEach(item => item.classList.remove('active'));

    // Pengalihan jika belum memiliki rig penambangan koin pasif
    if (!window.playerData || !window.playerData.cph || window.playerData.cph === 0) {
        frame.src = 'market.html'; 
        return;
    }

    const cph = window.playerData.cph || 0;
    let lastClaimTime = parseInt(localStorage.getItem('last_mining_claim'));
    const elapsedSeconds = (Date.now() - lastClaimTime) / 1000;
    const maxMiningSeconds = 3 * 3600;

    if (elapsedSeconds >= maxMiningSeconds) {
        const reward = Math.floor((maxMiningSeconds / 3600) * cph);
        let currentCoins = window.playerData.coins || 0;

        localStorage.setItem('last_mining_claim', Date.now().toString());
        window.saveDataToFirebase({ coins: currentCoins + reward });

        if (typeof TMAAnalytics !== 'undefined') {
            TMAAnalytics.trackEvent('Passive_Mining_Claim', { amount: reward, cph_rate: cph });
        }
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        alert(`Sovereign Core Harvested! +${reward.toLocaleString('id-ID')} Koin sukses diklaim.`);
    } else {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }
};
