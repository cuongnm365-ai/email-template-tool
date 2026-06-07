/* =========================================================
   BỘ NÃO XỬ LÝ (ENGINE) - SOC COMMAND CENTER
   Bản cập nhật: Tự động In hoa/Titlecase, Cảnh báo SĐT
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
    document.getElementById("btnReset").addEventListener("click", () => renderForm(currentTemplateId));
    document.getElementById("btnCopy").addEventListener("click", copyEmailContent);
});

function getFieldHtml(field) {
    let formatAttr = field.format ? `data-format="${field.format}"` : "";
    let extraHtml = "";
    
    // Thêm cảnh báo nếu là trường Số điện thoại
    if (field.id === "phone") {
        extraHtml = `<div id="phone_error" style="display: none; color: #dc2626; font-size: 12px; margin-top: 4px; font-weight: 500;">Sai định dạng số ĐT (10-11 số, bắt đầu bằng 0)</div>`;
    }

    if (field.type === "textarea") {
        return `<textarea id="field_${field.id}" rows="4" class="soc-input template-input w-full" ${formatAttr} placeholder="${field.placeholder || ''}"></textarea>${extraHtml}`;
    } else if (field.type === "select") {
        let html = `<select id="field_${field.id}" class="soc-input template-input w-full">`;
        field.options.forEach(opt => html += `<option value="${opt.value}">${opt.text}</option>`);
        return html + `</select>${extraHtml}`;
    } else if (field.type === "date") {
        return `<input type="date" id="field_${field.id}" class="soc-input template-input w-full">${extraHtml}`;
    } else if (field.type === "checkbox") {
        return `<input type="checkbox" id="field_${field.id}" class="template-input cursor-pointer" style="transform: scale(1.3);">${extraHtml}`;
    } else {
        return `<input type="text" id="field_${field.id}" class="soc-input template-input w-full" ${formatAttr} placeholder="${field.placeholder || ''}">${extraHtml}`;
    }
}

function renderForm(templateId) {
    const formContainer = document.getElementById("dynamicForm");
    const template = window.SOC_TEMPLATES[templateId];
    
    if (!template) {
        formContainer.innerHTML = '<p class="text-center text-slate-400 text-sm italic py-10 font-medium">Vui lòng chọn một mẫu để hệ thống tự động lắp ráp Form...</p>';
        return;
    }

    const savedAgentName = localStorage.getItem("soc_agent_name") || "";
    let html = "";

    if (!template.hideCustomerInfo) {
        html += `
            <div class="mb-4">
                <label class="soc-label">Tên Agent xử lý:</label>
                <input type="text" id="field_staffName" class="soc-input template-input w-full" data-format="titlecase" placeholder="Ví dụ: Nguyễn Văn A" value="${savedAgentName}">
            </div>
            <div class="flex gap-3 mb-4">
                <div class="w-1/3">
                    <label class="soc-label">Danh xưng:</label>
                    <select id="field_gender" class="soc-input template-input w-full">
                        <option value="Anh">Anh</option><option value="Chị">Chị</option>
                        <option value="Cô">Cô</option><option value="Chú">Chú</option>
                        <option value="Bác">Bác</option><option value="Doanh Nghiệp">Doanh Nghiệp</option>
                    </select>
                </div>
                <div class="w-2/3">
                    <label class="soc-label">Tên khách hàng:</label>
                    <input type="text" id="field_customerName" class="soc-input template-input w-full" data-format="titlecase" placeholder="Nhập tên KH">
                </div>
            </div>
        `;
    }

    if (template.fields) {
        template.fields.forEach(field => {
            if (field.type === "row") {
                html += `<div class="flex gap-4 mb-4 items-end">`;
                field.fields.forEach(sub => {
                    let wCls = sub.width || "flex-1";
                    html += `<div class="${wCls}">`;
                    if (sub.type !== "checkbox") {
                        html += `<label class="soc-label block mb-1">${sub.label}:</label>`;
                        html += getFieldHtml(sub);
                    } else {
                        html += `<div class="flex items-center h-[38px] pb-2">`;
                        html += getFieldHtml(sub);
                        html += `<label for="field_${sub.id}" class="soc-label mb-0 ml-2 cursor-pointer font-medium">${sub.label}</label>`;
                        html += `</div>`;
                    }
                    html += `</div>`;
                });
                html += `</div>`;
            } else {
                html += `<div class="mb-4">`;
                if (field.type !== "checkbox") {
                    html += `<label class="soc-label block mb-1">${field.label}:</label>`;
                    html += getFieldHtml(field);
                } else {
                    html += `<div class="flex items-center">`;
                    html += getFieldHtml(field);
                    html += `<label for="field_${field.id}" class="soc-label mb-0 ml-2 cursor-pointer font-medium">${field.label}</label>`;
                    html += `</div>`;
                }
                html += `</div>`;
            }
        });
    }

    formContainer.innerHTML = html;
    document.querySelectorAll('.template-input').forEach(input => {
        input.addEventListener('input', (e) => {
            if (e.target.id === "field_staffName") localStorage.setItem("soc_agent_name", e.target.value);
            
            // TỰ ĐỘNG ÉP KIỂU CHỮ (UPPERCASE & TITLECASE)
            let formatAttr = e.target.getAttribute('data-format');
            if (formatAttr === 'uppercase') {
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                e.target.value = e.target.value.toUpperCase();
                e.target.setSelectionRange(start, end);
            } else if (formatAttr === 'titlecase') {
                let start = e.target.selectionStart;
                let end = e.target.selectionEnd;
                e.target.value = e.target.value.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
                e.target.setSelectionRange(start, end);
            }

            // KIỂM TRA ĐỊNH DẠNG SỐ ĐIỆN THOẠI
            if (e.target.id === 'field_phone') {
                let phoneErr = document.getElementById('phone_error');
                const phoneRegex = /^0\d{9,10}$/; 
                if (e.target.value && !phoneRegex.test(e.target.value)) {
                    e.target.style.borderColor = "#dc2626"; // Đỏ
                    e.target.style.outlineColor = "#dc2626";
                    if(phoneErr) phoneErr.style.display = "block";
                } else {
                    e.target.style.borderColor = ""; // Trả về mặc định
                    e.target.style.outlineColor = "";
                    if(phoneErr) phoneErr.style.display = "none";
                }
            }

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
        if (input.type === 'checkbox') {
            data[key] = input.checked;
        } else {
            let val = input.value;
            if (input.tagName.toLowerCase() === 'textarea' && val) {
                val = val.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;');
            }
            data[key] = val || `[${key}]`;
        }
    });
    
    data.honorific = data.gender || "Anh/Chị";
    data.pronoun = (data.gender === 'Doanh Nghiệp') ? 'Quý công ty' : (data.gender || "Anh/Chị");
    data.pronounLc = data.pronoun.toLowerCase();
    if (data.gender === 'Doanh Nghiệp') data.honorific = 'Quý công ty';

    if (typeof template.computedVars === 'function') Object.assign(data, template.computedVars(data));
    const replaceVars = (text) => text ? text.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key] !== undefined ? data[key] : match) : "";

    let infoBoxHtml = "";
    if (template.boxContent) {
        let qrSection = "";
        if (template.qrType && SYSTEM_ASSETS[template.qrType]) {
            let asset = SYSTEM_ASSETS[template.qrType];
            qrSection = `<td width="140" align="center" valign="middle" style="padding: 15px; border-left: 1px dashed #cbd5e0;"><a href="${asset.link}" target="_blank"><img src="${asset.img}" alt="QR" width="130" style="display: block; border: 1px solid #cbd5e0; padding: 4px; border-radius: 4px;"></a></td>`;
        }
        
        let formattedBox = template.boxContent
            .replace(/<ul[^>]*>/g, '<div style="margin: 0;">')
            .replace(/<\/ul>/g, '</div>')
            .replace(/<li[^>]*>/g, '<div style="margin-bottom: 6px; display: flex; align-items: flex-start;"><span style="margin-right: 8px; color: #f26f21;">➔</span><span>')
            .replace(/<\/li>/g, '</span></div>');

        infoBoxHtml = `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #f26f21; border-radius: 4px; margin: 15px 0;">
            <tr>
                <td valign="middle" style="padding: 15px; font-family: sans-serif; font-size: 14.5px; color: #2d3748; line-height: 1.6;">
                    ${replaceVars(formattedBox)}
                </td>
                ${qrSection}
            </tr>
        </table>`;
    }

    let finalBody = replaceVars(template.body).replace('{INFO_BOX}', infoBoxHtml);
    let agentName = (data.staffName && data.staffName !== "[staffName]") ? data.staffName : "[Tên Agent]";
    let finalSig = template.customSignature ? replaceVars(template.customSignature) : `Trân trọng,<br>Em <b>${agentName}</b> – CSKH FPT Telecom.`;

    if (template.hideSignature) finalSig = "";

    document.getElementById("emailSubject").innerText = replaceVars(template.subject);
    document.getElementById("emailContent").innerHTML = finalBody;
    document.getElementById("emailSignature").innerHTML = finalSig;
}

function copyEmailContent() {
    const activeTemplate = currentTemplateId || "chua_chon_mau";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'event': 'use_template', 'template_name': activeTemplate });

    const content = document.getElementById('emailContent').innerHTML;
    const sig = document.getElementById('emailSignature').innerHTML;
    const fullHtml = sig ? `<div style="font-family: 'Aptos', 'Segoe UI', Arial, sans-serif; font-size: 14.5px; color: #2d3748;">${content}<br>${sig}</div>` : `<div style="font-family: 'Aptos', 'Segoe UI', Arial, sans-serif; font-size: 14.5px; color: #2d3748;">${content}</div>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];
    
    navigator.clipboard.write(data).then(() => {
        showToast("Đã copy thành công!");
    }).catch(() => {
        alert("Trình duyệt chặn copy. Hãy bôi đen nội dung và nhấn Ctrl+C.");
    });
}
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}
