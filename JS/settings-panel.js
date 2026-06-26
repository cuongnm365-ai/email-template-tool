/* =========================================================
   PANEL CẤU HÌNH & THỐNG KÊ - SOC COMMAND CENTER
   Bản nâng cấp hoàn chỉnh: Khởi tạo tự động & Ép chuyển Tab
   ========================================================= */

function initSettingsPanel() {
    const tabMainBtn = document.getElementById("tabMain");
    const tabSettingsBtn = document.getElementById("tabSettings");
    const tabStatsBtn = document.getElementById("tabStats");
    
    // Gán sự kiện click bằng onclick để đảm bảo ghi đè các hàm cũ bị lỗi
    if (tabMainBtn) {
        tabMainBtn.onclick = (e) => { e.preventDefault(); switchTab("main"); };
    }
    
    if (tabSettingsBtn) {
        tabSettingsBtn.onclick = (e) => { e.preventDefault(); switchTab("settings"); };
    }

    if (tabStatsBtn) {
        tabStatsBtn.onclick = (e) => { 
            e.preventDefault(); 
            switchTab("stats"); 
            renderTemplateStatistics(); // Dựng lại dữ liệu mỗi khi mở tab
        };
    }
    
    if (typeof authManager !== "undefined" && authManager.isLoggedIn() && typeof regionManager !== "undefined" && regionManager.settings.southEmail !== "") {
        loadSettingsUI();
    } else {
        window.addEventListener("soc_auth_ready", () => loadSettingsUI());
    }
}

function switchTab(tabName) {
    // 1. Ẩn tất cả các khối nội dung tab
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.add("hidden");
        tab.style.display = "none"; // Ép ẩn tuyệt đối
    });
    
    // 2. Gỡ bỏ trạng thái active ở tất cả các nút
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // 3. Hiện khối nội dung tab được chọn
    const activeTab = document.getElementById(tabName + "Tab");
    if (activeTab) {
        activeTab.classList.remove("hidden");
        activeTab.style.display = "block"; // Ép hiện tuyệt đối
    }
    
    // 4. Kích hoạt màu cam cho nút tab tương ứng
    const activeBtn = document.getElementById("tab" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) {
        activeBtn.classList.add("active");
    }
}

function loadSettingsUI() {
    if (typeof regionManager === "undefined") return;
    
    const southEmailInput = document.getElementById("settingsSouthEmail");
    const northEmailInput = document.getElementById("settingsNorthEmail");
    const bccEmailInput = document.getElementById("settingsBccEmail");
    const southPatterns = document.getElementById("settingsSouthPatterns");
    const northPatterns = document.getElementById("settingsNorthPatterns");
    
    if (southEmailInput) southEmailInput.value = regionManager.settings.southEmail || "";
    if (northEmailInput) northEmailInput.value = regionManager.settings.northEmail || "";
    if (bccEmailInput) bccEmailInput.value = regionManager.settings.defaultBccEmail || "";
    if (southPatterns) southPatterns.value = regionManager.getSouthPatterns ? regionManager.getSouthPatterns() : "";
    if (northPatterns) northPatterns.value = regionManager.getNorthPatterns ? regionManager.getNorthPatterns() : "";
    
    disableSettingsEditing();
}

function disableSettingsEditing() {
    const inputs = ["settingsSouthEmail", "settingsNorthEmail", "settingsBccEmail", "settingsSouthPatterns", "settingsNorthPatterns"];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });

    if (!document.getElementById("adminLockNotice")) {
        const container = document.querySelector("#settingsTab > .grid") || document.getElementById("settingsTab");
        if (container) {
            const notice = document.createElement("div");
            notice.id = "adminLockNotice";
            notice.className = "mt-6 p-5 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl shadow-sm flex flex-col gap-2 col-span-full";
            notice.innerHTML = `
                <div class="flex items-center gap-2 font-bold text-amber-950">
                    <i class="fa-solid fa-user-shield text-base text-amber-600"></i>
                    <span>THÔNG BÁO QUẢN TRỊ</span>
                </div>
                <p class="text-xs text-amber-800 leading-relaxed">
                    Các ký tự diện mã Vùng Miền và luồng địa chỉ Email xử lý đã được <strong>khóa cố định cấu hình</strong> để đảm bảo gửi đúng luồng nghiệp vụ.
                </p>
                <div class="mt-2 pt-2 border-t border-amber-200/60 text-xs font-semibold text-red-600 flex items-center gap-1.5">
                    <i class="fa-solid fa-circle-exclamation text-sm"></i>
                    <span>Nếu cần điều chỉnh, vui lòng liên hệ trực tiếp với <strong>Admin Trung tâm</strong>.</span>
                </div>
            `;
            // Chèn xuống cuối
            if(container.parentNode) container.parentNode.appendChild(notice);
        }
    }
}

/* =========================================================
   MÔ-ĐUN: THỐNG KÊ TẦN SUẤT SỬ DỤNG MẪU EMAIL
   ========================================================= */
function renderTemplateStatistics() {
    const container = document.getElementById("statsTabContent");
    if (!container) return;
    
    let stats = {};
    try {
        stats = JSON.parse(localStorage.getItem('soc_template_stats')) || {};
    } catch(e) {
        console.error("Lỗi đọc dữ liệu thống kê:", e);
    }
    
    const templates = window.SOC_TEMPLATES || {};
    let totalUsage = 0;
    let rowsHtml = "";
    
    Object.keys(stats).forEach(id => {
        totalUsage += (stats[id] || 0);
    });
    
    const sortedTemplates = Object.keys(templates).map(id => {
        return {
            id: id,
            name: templates[id].name ? templates[id].name.replace(/^Mẫu (Mới|Cũ) \d+: /, "") : id,
            count: stats[id] || 0
        };
    }).sort((a, b) => b.count - a.count);
    
    if (sortedTemplates.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-slate-400">Không tìm thấy danh sách mẫu email hoạt động trên hệ thống.</div>`;
        return;
    }
    
    sortedTemplates.forEach((item, index) => {
        const percentage = totalUsage > 0 ? ((item.count / totalUsage) * 100).toFixed(1) : 0;
        
        rowsHtml += `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition">
                <td class="p-4 text-center font-medium text-slate-400 text-xs">${index + 1}</td>
                <td class="p-4">
                    <div class="font-semibold text-slate-800 text-sm">${item.name}</div>
                    <div class="text-xs text-slate-400 font-mono mt-0.5">${item.id}</div>
                </td>
                <td class="p-4 text-center font-bold text-indigo-600 text-sm font-mono">${item.count} lượt</td>
                <td class="p-4">
                    <div class="flex items-center gap-3">
                        <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div class="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full" style="width: ${percentage}%"></div>
                        </div>
                        <span class="text-xs font-bold text-slate-500 w-12 text-right font-mono">${percentage}%</span>
                    </div>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div class="bg-gradient-to-br from-slate-800 to-slate-950 p-5 rounded-2xl text-white shadow-sm border border-slate-700">
                <div class="text-white/60 text-xs font-bold uppercase tracking-wider">Tổng số lượt sử dụng</div>
                <div class="text-4xl font-black mt-1 font-mono text-amber-500">${totalUsage}</div>
                <div class="text-xs text-white/40 mt-2 flex items-center gap-1">
                    <i class="fa-solid fa-clock-rotate-left"></i> Tổng số lượt click Copy thành công
                </div>
            </div>
            <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
                <div class="text-slate-400 text-xs font-bold uppercase tracking-wider">Mẫu email sử dụng cao nhất</div>
                <div class="text-base font-bold text-slate-800 mt-2 truncate">${sortedTemplates[0].count > 0 ? sortedTemplates[0].name : 'Chưa có dữ liệu'}</div>
                <div class="text-xs text-slate-500 mt-0.5 font-mono">${sortedTemplates[0].count > 0 ? `Đã dùng: ${sortedTemplates[0].count} lần` : '0 thao tác'}</div>
            </div>
            <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
                <div class="text-slate-400 text-xs font-bold uppercase tracking-wider">Dữ liệu hệ thống</div>
                <button onclick="clearTemplateStatistics()" class="w-full btn-danger-soft py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition border border-red-100">
                    <i class="fa-solid fa-trash-can"></i> Xóa lịch sử thống kê
                </button>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 class="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-list-ol text-amber-500"></i> Bảng xếp hạng tần suất sử dụng mẫu email
                </h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-600 border-collapse">
                    <thead>
                        <tr class="bg-slate-50 text-slate-400 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                            <th class="p-4 text-center w-16">STT</th>
                            <th class="p-4">Tên nghiệp vụ mẫu</th>
                            <th class="p-4 text-center w-36">Tổng lượt dùng</th>
                            <th class="p-4 w-56">Tỷ lệ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function clearTemplateStatistics() {
    if (confirm("Hệ thống sẽ xóa sạch toàn bộ số lượt đếm tích lũy của các mẫu email trên thiết bị này. Bạn vẫn muốn tiếp tục?")) {
        localStorage.removeItem('soc_template_stats');
        renderTemplateStatistics();
        if (typeof showToast === 'function') showToast("Đã làm sạch bộ đếm thống kê!");
    }
}

// Bắt buộc hệ thống tự động chạy hàm khởi tạo ngay sau khi nạp xong giao diện
document.addEventListener("DOMContentLoaded", () => {
    initSettingsPanel();
});
