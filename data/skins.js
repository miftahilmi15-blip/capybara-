/* ==========================================================================
   CAPY SOVEREIGN OS - CORE SKINS STATIC DATABASE
   Kunci data kosmetik visual avatar, harga beli, rarity, dan multiplier bonus
   ========================================================================== */

export const coreSkinsDatabase = [
    {
        id: "skin_default_capy",
        name: "Sovereign Prototype",
        rarity: "COMMON",
        desc: "Visual purwarupa standar bawaan pabrik Capy Sovereign OS.",
        cost: 0, // Skin gratis bawaan awal
        multiplier: 1.0, // Tanpa bonus tambahan
        purchased: true, // Otomatis terbeli sejak awal
        icon: "logo-192.png"
    },
    {
        id: "skin_neon_cyber",
        name: "Neon Grid Overlord",
        rarity: "RARE",
        desc: "Suntikan plasma cyan pekat untuk meningkatkan daya pendar piringan core terminal.",
        cost: 50000,
        multiplier: 1.05, // Menambah 5% boost ke total pendapatan tap/pasif
        purchased: false,
        icon: "assets/skins/neon-cyber-v1.png"
    },
    {
        id: "skin_gold_consensus",
        name: "Golden Consensus",
        rarity: "MYTHIC",
        desc: "Lapisan emas murni 24 karat terenkripsi. Simbol dominasi mutlak di jaringan blockchain.",
        cost: 1000000,
        multiplier: 1.25, // Menambah 25% boost gila-gilaan
        purchased: false,
        icon: "assets/skins/gold-consensus-v1.png"
    }
];
