/* =========================================================
   UI ENHANCEMENTS — Theme Sáng/Tối + Chấm trạng thái header
   File riêng, không đụng tới logic nghiệp vụ trong engine.js
   ========================================================= */

(function () {
    // ---- 1. Theme Sáng / Tối ----
    const THEME_KEY = "soc_theme";

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        const icon = document.getElementById("themeToggleIcon");
        if (icon) icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    // Áp dụng ngay từ đầu để tránh nháy sáng/tối khi tải trang
    applyTheme(localStorage.getItem(THEME_KEY) || "light");

    document.addEventListener("DOMContentLoaded", () => {
        const toggleBtn = document.getElementById("themeToggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                const current = document.documentElement.getAttribute("data-theme") || "light";
                const next = current === "dark" ? "light" : "dark";
                applyTheme(next);
                localStorage.setItem(THEME_KEY, next);
            });
        }

        // ---- 2. Chấm trạng thái header: phản ánh đã chọn mẫu email hay chưa ----
        const selector = document.getElementById("templateSelector");
        const pill = document.getElementById("statusPill");
        const pillLabel = document.getElementById("statusPillLabel");

        function updateStatusPill() {
            if (!selector || !pill || !pillLabel) return;
            const templateId = selector.value;
            const template = templateId && window.SOC_TEMPLATES ? window.SOC_TEMPLATES[templateId] : null;

            if (template) {
                pill.classList.add("is-ready");
                pillLabel.textContent = `Đang soạn: ${template.name.replace(/^Mẫu (Mới|Cũ) \d+: /, "")}`;
            } else {
                pill.classList.remove("is-ready");
                pillLabel.textContent = "Chưa chọn mẫu";
            }
        }

        if (selector) selector.addEventListener("change", updateStatusPill);
        updateStatusPill();
    });
})();
