window.SOC_TEMPLATES["t_gui_noi_bo"] = {
    name: "Mẫu Mới 8: Gửi nội bộ",
    subject: "[{{source}}] {{isSOS}} - {{area}} - {{branch}} - {{contractId}} - {{summary}}",
    fields: [
        { id: "dept", label: "Gửi cho bộ phận", type: "select", options: [
            {value: "DVKH", text: "DVKH"},
            {value: "TIN", text: "TIN"}
        ]},
        { id: "source", label: "Nguồn khiếu nại", type: "select", options: [
            {value: "KN MXH", text: "KN MXH"},
            {value: "KN Email", text: "KN Email"}
        ]},
        { id: "isSOS", label: "Khẩn cấp (SOS)", type: "checkbox" },
        { id: "area", label: "Khu vực", type: "text", placeholder: "Ví dụ: HCM" },
        { id: "branch", label: "Chi nhánh", type: "text", placeholder: "Ví dụ: CN Quận 7" },
        { id: "contractId", label: "Số hợp đồng", type: "text", format: "uppercase" },
        { id: "phone", label: "Số điện thoại", type: "text" },
        { id: "address", label: "Địa chỉ", type: "text" },
        { id: "extraLink", label: "Link bài Post (nếu là MXH)", type: "text", placeholder: "Dán link bài viết..." },
        { id: "emailContact", label: "Địa chỉ Email (nếu là Email)", type: "text", placeholder: "customer@gmail.com" },
        { id: "summary", label: "Tóm tắt vấn đề", type: "text" },
        { id: "complaintDetails", label: "Nội dung phản ánh/khiếu nại", type: "textarea" },
        { id: "socAction", label: "Thông tin xử lý từ SOC", type: "textarea" },
        { id: "proposal", label: "Đề xuất/Đề nghị xử lý", type: "textarea" }
    ],
    computedVars: function(data) {
        let extraHTML = "";
        if (data.source === "KN MXH" && data.extraLink) {
            extraHTML = `<li><b>Link bài Post:</b> ${data.extraLink}</li>`;
        } else if (data.source === "KN Email" && data.emailContact) {
            extraHTML = `<li><b>Email KH:</b> ${data.emailContact}</li>`;
        }
        return {
            isSOS: data.isSOS ? "[Khẩn Cấp/SOS]" : "",
            extraInfo: extraHTML
        };
    },
    body: `
        Dear {{dept}},<br><br>
        SOC tiếp nhận thông tin phản ánh/khiếu nại từ Khách hàng với chi tiết như sau:<br><br>
        <b>1. Thông tin khách hàng:</b>
        <ul style="margin: 0; padding-left: 20px;">
            <li><b>Số hợp đồng:</b> {{contractId}}</li>
            <li><b>Số điện thoại:</b> {{phone}}</li>
            <li><b>Địa chỉ:</b> {{address}}</li>
            {{extraInfo}}
        </ul><br>
        <b>2. Thông tin phản ánh/khiếu nại từ KH:</b><br>
        {{complaintDetails}}<br><br>
        <b>3. Thông tin xử lý từ SOC:</b><br>
        {{socAction}}<br><br>
        <b>4. Đề xuất/Đề nghị xử lý:</b><br>
        {{proposal}}<br><br>
        Trân trọng,<br>
        Đội ngũ SOC.`
};
