/* =========================================================
   BỘ NÃO XỬ LÝ (ENGINE) - SOC COMMAND CENTER
   Đã hỗ trợ: Checkbox, Textarea, Select, Date
   ========================================================= */

const SYSTEM_ASSETS = {
    "cai_dat": { img: "https://tools.manhcuongit.online/Images/Picture/cai-dat-nhanh.jpg", link: "https://hi.fpt.vn/rev/lbq/P3M3JDZB" },
    "theo_doi_ktv": { img: "https://tools.manhcuongit.online/Images/Picture/theo-doi-ktv.jpg", link: "https://hi.fpt.vn/rev/lbq/P3M3JDZB" },
    "thanh_toan": { img: "https://tools.manhcuongit.online/Images/Picture/thanh-toan-nhanh.jpg", link: "https://hi.fpt.vn/rev/fbu/1dnN3BoM" },
    "bao_hong": { img: "https://tools.manhcuongit.online/Images/Picture/bao-hong-nhanh.jpg", link: "https://hi.fpt.vn/rev/esv/Mq9r4jlG" }
};

window.SOC_TEMPLATES = window.SOC_TEMPLATES || {};
let currentTemplateId = "";

document.addEventListener("DOMContentLoaded", () => {
    const selector = document.getElementById("templateSelector");
    selector.innerHTML = '<option value="">-- Chọn nghiệp vụ / Mẫu email phục vụ --</option>';
    for (const [id, template] of Object.entries(window.SOC_TEMPLATES)) {
        selector.innerHTML += `<option value="${id}">${template.name}</option>`;
    }
    selector.addEventListener("change", (e) => {
        currentTemplateId = e.target.value;
        renderForm(currentTemplateId);
    });
});

function renderForm(templateId) {
    const formContainer = document.getElementById("dynamicForm");
    const template = window.SOC_TEMPLATES[templateId];
    
    if (!template) {
        formContainer.innerHTML = '<p class="text-center text-slate-400 text-sm italic py-10">Vui lòng chọn mẫu...</p>';
        return;
    }

    let html = `
        <div class="mb-4">
            <label class="soc-label">Tên Agent xử lý:</label>
            <input type="text" id="field_staffName" class="soc-input template-input" placeholder="Ví dụ: Nguyễn Văn A" value="${localStorage.getItem("soc_agent_name") || ""}">
        </div>
        <div class="flex gap-3 mb-4">
            <div class="w-1/3">
                <label class="soc-label">Danh xưng:</label>
                <select id="field_gender" class="soc-input template-input">
                    <option value="Anh">Anh</option><option value="Chị">Chị</option>
                    <option value="Cô">Cô</option><option value="Chú">Chú</option>
                    <option value="Bác">Bác</option><option value="Doanh Nghiệp">Doanh Nghiệp</option>
                </select>
            </div>
            <div class="w-2/3">
                <label class="soc-label">Tên khách hàng:</label>
                <input type="text" id="field_customerName" class="soc-input template-input" placeholder="Nhập tên KH">
            </div>
        </div>
    `;

    if (template.fields) {
        template.fields.forEach(field => {
            html += `<div class="mb-4"><label class="soc-label">${field.label}:</label>`;
            if (field.type === "textarea") {
                html += `<textarea id="field_${field.id}" rows="3" class="soc-input template-input" placeholder="${field.placeholder || ''}"></textarea>`;
            } else if (field.type === "select") {
                html += `<select id="field_${field.id}" class="soc-input template-input">`;
                field.options.forEach(opt => html += `<option value="${opt.value}">${opt.text}</option>`);
                html += `</select>`;
            } else if (field.type === "checkbox") {
                html += `<input type="checkbox" id="field_${field.id}" class="template-input ml-2" style="transform: scale(1.5);">`;
            } else {
                html += `<input type="text" id="field_${field.id}" class="soc-input template-input" placeholder="${field.placeholder || ''}">`;
            }
            html += `</div>`;
        });
    }

    formContainer.innerHTML = html;
    document.querySelectorAll('.template-input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.id === "field_staffName") localStorage.setItem("soc_agent_name", input.value);
            renderEmail();
        });
    });
    renderEmail();
}

function renderEmail() {
    if (!currentTemplateId) return;
    const template = window.SOC_TEMPLATES[currentTemplateId];
    let data = {};
    document.querySelectorAll('.template-input').forEach(input => {
        let key = input.id.replace('field_', '');
        // Xử lý riêng cho checkbox
        data[key] = (input.type === 'checkbox') ? input.checked : (input.value || `[${key}]`);
    });
    
    data.honorific = data.gender;
    data.pronoun = (data.gender === 'Doanh Nghiệp') ? 'Quý công ty' : data.gender;
    data.pronounLc = data.pronoun.toLowerCase();
    if (data.gender === 'Doanh Nghiệp') data.honorific = 'Quý công ty';

    if (typeof template.computedVars === 'function') Object.assign(data, template.computedVars(data));
    
    const replaceVars = (text) => text ? text.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] !== undefined ? data[key] : match) : "";

    let infoBoxHtml = "";
    if (template.boxContent) {
        let qrSection = "";
        if (template.qrType && SYSTEM_ASSETS[template.qrType]) {
            let asset = SYSTEM_ASSETS[template.qrType];
            qrSection = `<td width="140" align="center" style="padding: 15px; border-left: 1px dashed #cbd5e0;"><a href="${asset.link}"><img src="${asset.img}" width="130"></a></td>`;
        }
        infoBoxHtml = `<table width="100%" style="background:#f8fafc; border:1px solid #e2e8f0; margin:15px 0;"><tr><td style="padding:15px;">${replaceVars(template.boxContent)}</td>${qrSection}</tr></table>`;
    }

    document.getElementById("emailSubject").innerText = replaceVars(template.subject);
    document.getElementById("emailContent").innerHTML = replaceVars(template.body).replace('{INFO_BOX}', infoBoxHtml);
}
