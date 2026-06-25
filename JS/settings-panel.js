/* =========================================================
   PANEL CẤU HÌNH & THỐNG KÊ - SOC COMMAND CENTER
   Bản nâng cấp hoàn chỉnh: Fix lỗi kẹt style Tab + Tích hợp Tab Thống kê
   ========================================================= */

function initSettingsPanel() {
    const tabMainBtn = document.getElementById("tabMain");
    const tabSettingsBtn = document.getElementById("tabSettings");
    const tabStatsBtn = document.getElementById("tabStats"); // Nút Thống kê mới
    
    if (tabMainBtn) tabMainBtn.addEventListener("click", () => switchTab("main"));
    
    if (tabSettingsBtn) {
        tabSettingsBtn.addEventListener("click", () => {
            switchTab("settings");
        });
    }

    if (tabStatsBtn) {
        tabStatsBtn.addEventListener("click", () => {
            switchTab("stats");
            renderTemplateStatistics(); // Tự động chạy hàm dựng dữ liệu khi mở tab
        });
    }
    
    if (typeof authManager !== "undefined" && authManager.isLoggedIn() && regionManager.settings.southEmail !== "") {
        loadSettingsUI();
    } else {
        window.addEventListener("soc_auth_ready", () => loadSettingsUI());
    }
}

function switchTab(tabName) {
    // Ẩn tất cả nội dung của các tab
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.add("hidden"));
    
    // Xóa class active ở tất cả các nút (Tuyệt đối không dùng inline style để tránh ghi đè CSS gốc)
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // Hiển thị nội dung của tab được chỉ định
    const activeTab = document.getElementById(tabName + "Tab");
    if (activeTab) activeTab.classList.remove("hidden");
    
    // Kích hoạt trạng thái active cho nút tab tương ứng
    const activeBtn = document.getElementById("tab" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add("active");
}

function loadSettingsUI() {
    if (typeof regionManager === "undefined") return;
    
    const southEmailInput = document.getElementById("southEmail");
    const northEmailInput = document.getElementById("northEmail");
    const bccEmailInput = document.getElementById("defaultBccEmail");
    
    if (southEmailInput) southEmailInput.value = regionManager.settings.southEmail || "";
    if (northEmailInput) northEmailInput.value = regionManager.settings.northEmail || "";
    if (bccEmailInput) bccEmailInput.value = regionManager.settings.defaultBccEmail || "";
    
    disableSettingsEditing();
}

function disableSettingsEditing() {
    const inputs = ["southEmail", "northEmail", "defaultBccEmail"];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });

    const saveBtnContainer = document.querySelector("#settingsTab button")?.parentElement;
    if (saveBtnContainer && saveBtnContainer.classList.contains("justify-end")) {
        saveBtnContainer.style.display = "none";
    }

    if (!document.getElementById("adminLockNotice")) {
        const container = document.querySelector("#settingsTab > .bg-white") || document.getElementById("settingsTab");
        if (container) {
            const notice = document.createElement("div");
            notice.id = "adminLockNotice";
            notice.className = "mt-6 p-5 bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl shadow-sm flex flex-col gap-2";
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
            container.appendChild(notice);
        }
    }
}

/* =========================================================
   MÔ-ĐUN PHÁT TRIỂN: THỐNG KÊ TẦN SUẤT SỬ DỤNG MẪU EMAIL
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
    
    // Tính tổng lượt sử dụng tổng thể
    Object.keys(stats).forEach(id => {
        totalUsage += (stats[id] || 0);
    });
    
    // Định dạng và sắp xếp danh sách mẫu theo số lượt dùng giảm dần
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
    
    // Sinh các dòng dữ liệu cho bảng xếp hạng
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
    
    // Kết xuất cấu trúc giao diện Dashboard hoàn chỉnh
    container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div class="bg-gradient-to-br from-slate-800 to-slate-950 p-5 rounded-2xl text-white shadow-sm border border-slate-700">
                <div class="text-white/60 text-xs font-bold uppercase tracking-wider">Tổng sản lượng phục vụ</div>
                <div class="text-4xl font-black mt-1 font-mono text-amber-500">${totalUsage}</div>
                <div class="text-xs text-white/40 mt-2 flex items-center gap-1">
                    <i class="fa-solid fa-clock-rotate-left"></i> Tổng số lượt click Copy thành công
                </div>
            </div>
            <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-center">
                <div class="text-slate-400 text-xs font-bold uppercase tracking-wider">Nghiệp vụ sử dụng cao nhất</div>
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
                            <th class="p-4 w-56">Tỷ trọng đóng góp</th>
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
