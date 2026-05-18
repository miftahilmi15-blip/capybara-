/* ==========================================================================
   CAPY SOVEREIGN OS - ECONOMIC BALANCE DEFINITIONS
   Konfigurasi ambang batas keuangan, tiering level, dan regulasi ekonomi game
   ========================================================================== */

export const economicBalanceConfig = {
    // Regulasi Dasar Keuangan Terminal
    minimumReserve: 0,         // Batas aman koin terendah
    maxTapHoldCapacity: 1000,  // Kapasitas energi standar awal

    // Sistem Klasifikasi Tingkat Akun (Tiering Ledger) Berdasarkan Total Aset Koin
    accountTiers: [
        { tier: 1, name: "CENTRAL NODE", minCoins: 0, bonusMultiplier: 1.0 },
        { tier: 2, name: "LIQUIDITY PROVIDER", minCoins: 50000, bonusMultiplier: 1.02 },
        { tier: 3, name: "CONSENSUS VALIDATOR", minCoins: 250000, bonusMultiplier: 1.05 },
        { tier: 4, name: "BLOCK ARCHITECT", minCoins: 1000000, bonusMultiplier: 1.10 },
        { tier: 5, name: "SOVEREIGN WHALE", minCoins: 10000000, bonusMultiplier: 1.20 }
    ],

    /**
     * Helper untuk menghitung tier akun pemain secara otomatis berdasarkan saldo saat ini
     * @param {number} currentCoins - Jumlah koin pemain saat ini
     * @returns {object} Objek data tier yang cocok
     */
    calculateAccountTier: function(currentCoins) {
        // Balik array untuk mengecek dari tier tertinggi dahulu
        const reversedTiers = [...this.accountTiers].reverse();
        return reversedTiers.find(t => currentCoins >= t.minCoins) || this.accountTiers[0];
    }
};
