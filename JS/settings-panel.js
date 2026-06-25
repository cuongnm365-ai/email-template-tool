/* =========================================================
   PANEL CẤU HÌNH - TAB CÀI ĐẶT (CHẾ ĐỘ READ-ONLY)
   ========================================================= */

function initSettingsPanel() {
    const tabSettingsBtn = document.getElementById("tabSettings");
    const tabMainBtn = document.getElementById("tabMain");
    
    if (tabMainBtn) tabMainBtn.addEventListener("click", () => switchTab("main"));
    
    if (tabSettingsBtn) {
        tabSettingsBtn.addEventListener("click", () => {
            switchTab("settings");
        });
    }
    
    if (typeof authManager !== "undefined" && authManager.isLoggedIn() && regionManager.settings.southEmail !== "") {
        loadSettingsUI();
    } else {
        window.addEventListener("soc_auth_ready", () => loadSettingsUI());
    }
}

function switchTab(tabName) {
    // Ẩn tất cả nội dung tab
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
    
    // Xóa class active ở tất cả các nút (không dùng inline style để tránh ghi đè css)
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
        // Đã xóa các dòng set cứng style.color / background / borderLeft tại đây để nhường lại cho file CSS
    });
    
    // Hiển thị nội dung tab được chọn
    const activeTab = document.getElementById(tabName + "Tab");
    if (activeTab) activeTab.classList.remove("hidden");
    
    // Kích hoạt trạng thái active cho nút được chọn
    const activeBtn = document.getElementById("tab" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add("active");
}

function loadSettingsUI() {
    const fields = [
        { id: "settingsBccEmail", val: regionManager.settings.defaultBccEmail },
        { id: "settingsSouthEmail", val: regionManager.settings.southEmail },
        { id: "settingsNorthEmail", val: regionManager.settings.northEmail },
        { id: "settingsSouthPatterns", val: regionManager.getSouthPatterns() },
        { id: "settingsNorthPatterns", val: regionManager.getNorthPatterns() }
    ];
    
    fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            el.value = field.val;
            el.disabled = true; 
            el.style.opacity = "0.6"; 
            el.style.backgroundColor = "#f8fafc"; 
            el.style.cursor = "not-allowed"; 
        }
    });

    const saveBtnContainer = document.querySelector("#settingsTab .flex.justify-end");
    if (saveBtnContainer) saveBtnContainer.style.display = "none";

    if (!document.getElementById("adminLockNotice")) {
        const container = document.querySelector("#settingsTab > .bg-white") || document.getElementById("settingsTab");
        if (container) {
            const notice = document.createElement("div");
            notice.id = "adminLockNotice";
            notice.className = "mt-6 p-5 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl shadow-sm flex flex-col gap-2";
            notice.innerHTML = `
                <div class="flex items-center gap-2 font-bold text-amber-950">
                    <i class="fa-solid fa-user-shield text-base text-amber-600"></i>
                    <span>THÔNG BÁO</span>
                </div>
                <p class="text-xs text-amber-800 leading-relaxed">
                    Các ký tự diện mã Vùng Miền và luồng địa chỉ Email xử lý đã được <strong>khóa cố định cấu hình</strong> để đảm bảo gửi đúng.
                </p>
                <div class="mt-2 pt-2 border-t border-amber-200/60 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-exclamation text-sm"></i>
                    <span>Nếu cần điều chỉnh, vui lòng liên hệ trực tiếp với <strong>Admin</strong>.</span>
                </div>
            `;
            container.appendChild(notice);
        }
    }
}

document.addEventListener("DOMContentLoaded", initSettingsPanel);
