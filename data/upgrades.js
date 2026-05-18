/* ==========================================================================
   CAPY SOVEREIGN OS - UPGRADE CARDS STATIC DATABASE
   Kunci data dasar komponen mesin, harga awal, multiplier, dan jenis bonus
   ========================================================================== */

export const upgradeCardsDatabase = {
    // 1. KATEGORI COMPUTING (Menambah CPH / Coins per Hour)
    computing: [
        {
            id: "cpu_v1_alpha",
            name: "Alpha Blue V1",
            desc: "Unit pemrosesan inti tingkat dasar untuk stabilisasi jaringan awal.",
            type: "cph", // Efek menambah CPH pasif
            baseCost: 1500,
            costMultiplier: 1.5, // Harga naik 1.5x lipat tiap level
            baseBonus: 120, // Menambah +120 CPH tiap level
            maxLvl: 15,
            icon: "assets/upgrades/alpha-blue-v1.png"
        },
        {
            id: "cpu_v2_vortex",
            name: "Vortex Green V2",
            desc: "Arsitektur multi-threading kencang untuk komputasi algoritma paralel.",
            type: "cph",
            baseCost: 7500,
            costMultiplier: 1.65,
            baseBonus: 450,
            maxLvl: 12,
            icon: "assets/upgrades/vortex-green-v1.png"
        }
    ],

    // 2. KATEGORI POWER (Menambah Batas Max Energy / Atribut Lainnya)
    power: [
        {
            id: "node_cell_battery",
            name: "Lithium Core Cell",
            desc: "Mengoptimalkan kapasitas botol penyimpanan daya operasional terminal.",
            type: "max_energy", // Efek menambah kapasitas energi maks pemain
            baseCost: 2000,
            costMultiplier: 1.4,
            baseBonus: 500, // Menambah +500 Max Energy tiap level
            maxLvl: 10,
            icon: "assets/upgrades/lithium-cell.png"
        }
    ],

    // 3. KATEGORI DATA (Cadangan Pengembangan Fitur)
    data: [],

    // 4. KATEGORI SECURITY (Cadangan Pengembangan Fitur)
    security: []
};
