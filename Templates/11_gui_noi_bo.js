window.SOC_TEMPLATES = window.SOC_TEMPLATES || {};

window.SOC_TEMPLATES["t_gui_noi_bo"] = {
    name: "Mẫu Mới 8: Gửi nội bộ (DVKH/TIN...)",
    hideCustomerInfo: true, // Ẩn tên Agent và danh xưng
    hideSignature: true, // Ẩn chữ ký cá nhân do nội bộ dùng "Đội ngũ SOC"
    subject: "[{{source}}] {{isSOS}} - {{area}} - {{branch}} - {{contractId}} - [Tóm tắt vấn đề]",
    
    fields: [
        {
            type: "row", // Dòng 1: Chọn bộ phận gửi (chọn nhiều)
            fields: [
                { id: "dept_DVKH", label: "Gửi DVKH", type: "checkbox", width: "w-1/4" },
                { id: "dept_TIN", label: "Gửi TIN", type: "checkbox", width: "w-1/4" },
                { id: "dept_CUS", label: "Gửi P.Cước", type: "checkbox", width: "w-1/4" },
                { id: "dept_OTHER", label: "Gửi Khác", type: "checkbox", width: "w-1/4" }
            ]
        },
        // Thêm dòng nhập liệu cho bộ phận Khác (Luôn in hoa khi xuất ra)
        { id: "dept_OTHER_text", label: "Nhập tên bộ phận khác (Nếu tick chọn 'Gửi Khác')", type: "text", format: "uppercase", placeholder: "Ví dụ: CSKH, HO, PMB..." },
        {
            type: "row", // Dòng 2: Nguồn và Khẩn cấp cùng 1 hàng
            fields: [
                { id: "source", label: "Nguồn khiếu nại", type: "select", options: [
                    {value: "KN MXH", text: "KN MXH"},
                    {value: "KN Email", text: "KN Email"}
                ], width: "w-1/2" },
                { id: "isSOS", label: "Khẩn cấp (SOS)", type: "checkbox", width: "w-1/2" }
            ]
        },
        // Gộp Link Post và Email thành 1 trường nhập liệu, hiển thị động
        { id: "sourceDetail", label: "Link bài Post / Địa chỉ Email (Tùy nguồn)", type: "text", placeholder: "Dán link bài viết hoặc Email của KH..." },
        {
            type: "row",
            fields: [
                { id: "area", label: "Khu vực", type: "text", placeholder: "Ví dụ: HCM", width: "w-1/2" },
                { id: "branch", label: "Chi nhánh", type: "text", placeholder: "Ví dụ: CN Quận 7", width: "w-1/2" }
            ]
        },
        {
            type: "row",
            fields: [
                { id: "contractId", label: "Số hợp đồng", type: "text", format: "uppercase", width: "w-1/3" },
                { id: "phone", label: "Số điện thoại", type: "text", width: "w-1/3" },
                { id: "address", label: "Địa chỉ", type: "text", width: "w-1/3" }
            ]
        },
        { id: "complaintDetails", label: "Nội dung phản ánh/khiếu nại", type: "textarea", placeholder: "Nhập nội dung KH phản ánh... (Có thể enter xuống dòng hoặc thụt lề)" },
        { id: "socAction", label: "Thông tin xử lý từ SOC", type: "textarea", placeholder: "Các bước SOC đã thực hiện/care KH..." },
        { id: "proposal", label: "Đề xuất/Đề nghị xử lý", type: "textarea", placeholder: "Đề nghị TIN hoặc DVKH xử lý..." }
    ],

    computedVars: function(data) {
        // Gom các bộ phận được tick vào mảng
        let depts = [];
        if (data.dept_DVKH) depts.push("DVKH");
        if (data.dept_TIN) depts.push("TIN");
        if (data.dept_CUS) depts.push("P.CƯỚC"); // Đảm bảo in hoa
        
        // Logic xử lý khi chọn Gửi Khác
        if (data.dept_OTHER) {
            // Kiểm tra xem người dùng có nhập nội dung vào ô không, nếu có thì DÙNG HÀM .toUpperCase() ĐỂ ÉP IN HOA TẤT CẢ
            let otherDept = (data.dept_OTHER_text && data.dept_OTHER_text !== "[dept_OTHER_text]") 
                            ? data.dept_OTHER_text.toUpperCase() 
                            : "CÁC BP LIÊN QUAN";
            depts.push(otherDept);
        }
        
        let deptStr = depts.length > 0 ? depts.join(" / ") : "[Chưa chọn bộ phận]";

        // Render động thẻ Link HTML hoặc Mailto tùy vào nguồn chọn
        let extraHTML = "";
        if (data.sourceDetail && data.sourceDetail !== "[sourceDetail]") {
            if (data.source === "KN MXH") {
                extraHTML = `<li><b>Link bài Post:</b> <a href="${data.sourceDetail}" style="color: #2b6cb0; text-decoration: underline;">Nhấn để xem</a></li>`;
            } else if (data.source === "KN Email") {
                extraHTML = `<li><b>Email KH:</b> <a href="mailto:${data.sourceDetail}" style="color: #2b6cb0;">${data.sourceDetail}</a></li>`;
            }
        }

        return {
            isSOS: data.isSOS ? "[Khẩn Cấp/SOS]" : "",
            dept: deptStr, // Chuỗi bộ phận đã được đảm bảo In Hoa 100%
            extraInfo: extraHTML
        };
    },
    
    body: `
        Dear <b>{{dept}}</b>,<br><br>
        SOC tiếp nhận thông tin phản ánh/khiếu nại từ Khách hàng với chi tiết như sau:<br><br>
        
        <b>1. Thông tin khách hàng:</b>
        <ul style="margin: 0; padding-left: 20px;">
            <li><b>Số hợp đồng:</b> {{contractId}}</li>
            <li><b>Số điện thoại:</b> {{phone}}</li>
            <li><b>Địa chỉ:</b> {{address}}</li>
            {{extraInfo}}
        </ul><br>
        
        <b>2. Thông tin phản ánh/khiếu nại từ KH:</b><br>
        <div style="padding-left: 15px; margin-top: 4px; border-left: 3px solid #e2e8f0;">{{complaintDetails}}</div><br>
        
        <b>3. Thông tin xử lý từ SOC:</b><br>
        <div style="padding-left: 15px; margin-top: 4px; border-left: 3px solid #e2e8f0;">{{socAction}}</div><br>
        
        <b>4. Đề xuất/Đề nghị xử lý:</b><br>
        <div style="padding-left: 15px; margin-top: 4px; border-left: 3px solid #e2e8f0;">{{proposal}}</div><br><br>
        
        Trân trọng,<br>
        <b>Đội ngũ SOC.</b>
    `
};
