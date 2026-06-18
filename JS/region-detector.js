/* =========================================================
   HỆ THỐNG NHẬN DIỆN VÀ CẤU HÌNH VÙNG MIỀN (EMPTY SECURE LOAD)
   ========================================================= */

class RegionManager {
    constructor() {
        this.settings = {
            southPatterns: [
                "SG","BD","DA","DN","NT","VT","BP","BT","LD","LA",
                "NN","TI","AG","BL","BE","CM","CT","DT","HG","KG",
                "ST","TG","TV","VL","BI","DL","GL","HU","KT","PY",
                "QB","QA","QI","QT","DK"
            ],
            northPatterns: [
                "DB","HM","HT","HB","HY","ND","NB","NA","SL","TB",
                "TH","BG","BN","CB","LS","LC","PT","TQ","TN","VP",
                "YB","HA","HN","HD","HP","QN"
            ],
            southEmail: "",
            northEmail: "",
            defaultBccEmail: ""
        };
    }

    clearSettings() {
        this.settings.southEmail = "";
        this.settings.northEmail = "";
        this.settings.defaultBccEmail = "";
    }

    detectRegion(contractId) {
        if (!contractId) return null;
        const code = contractId.substring(0, 2).toUpperCase();
        if (this.settings.southPatterns.includes(code)) return "south";
        if (this.settings.northPatterns.includes(code)) return "north";
        return null;
    }

    getRegionEmail(region) {
        if (region === "south") return this.settings.southEmail;
        if (region === "north") return this.settings.northEmail;
        return "";
    }

    getSouthPatterns() { return this.settings.southPatterns.join(", "); }
    getNorthPatterns() { return this.settings.northPatterns.join(", "); }
    getDefaultBcc() { return this.settings.defaultBccEmail; }
}

const regionManager = new RegionManager();