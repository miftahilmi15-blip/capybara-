/* ==========================================================================
   CAPY SOVEREIGN OS - RUNTIME STORAGE ENGINE
   Mengelola penyimpanan data level kartu upgrade secara lokal di sisi client
   ========================================================================== */

const STORAGE_PREFIX = "capy_sovereign_card_lvl_";

export const StorageEngine = {
    /**
     * Mengambil level kartu saat ini dari localStorage runtime
     * @param {string} cardId - ID unik dari kartu upgrade
     * @returns {number} Level kartu saat ini (default: 0 jika belum pernah dibeli)
     */
    getCardLevel: function(cardId) {
        try {
            const level = localStorage.getItem(STORAGE_PREFIX + cardId);
            return level ? parseInt(level, 10) : 0;
        } catch (error) {
            console.error("Runtime Storage Read Error:", error);
            return 0;
        }
    },

    /**
     * Menyimpan level terbaru kartu setelah berhasil di-upgrade
     * @param {string} cardId - ID unik dari kartu upgrade
     * @param {number} nextLevel - Tingkat level baru yang akan ditulis
     */
    saveCardLevel: function(cardId, nextLevel) {
        try {
            localStorage.setItem(STORAGE_PREFIX + cardId, nextLevel.toString());
        } catch (error) {
            console.error("Runtime Storage Write Error:", error);
        }
    },

    /**
     * Membersihkan semua cache runtime kartu (Opsional untuk reset akun)
     */
    clearAllCardStorage: function() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(STORAGE_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error("Runtime Storage Clear Error:", error);
        }
    }
};
