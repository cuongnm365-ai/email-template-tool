window.SOC_TEMPLATES = window.SOC_TEMPLATES || {};

window.SOC_TEMPLATES["t_da_xu_ly"] = {
    name: "Mẫu Mới 2: KH đã xử lý xong (Giới thiệu báo hỏng nhanh)",
    subject: "[FPT Telecom] Phản hồi thông tin dịch vụ đường truyền Internet",
    
    // Thêm đúng 1 trường SĐT đăng ký
    fields: [
        { id: "phone", label: "Số điện thoại đăng ký", type: "text", placeholder: "Ví dụ: 0912345689" }
    ],
    
    qrType: "bao_hong",
    
    boxContent: `
        <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 4px;"><b>Thời gian xử lý dự kiến:</b> [Thời gian dự kiến]</li>
            <li style="margin-bottom: 4px;"><b>Kỹ thuật viên phục vụ:</b> [Tên KTV - Số ĐT]</li>
        </ul>
        <p style="margin-top: 10px; margin-bottom: 0; font-style: italic;">➔ Chi tiết tiến độ xử lý và thông tin KTV, vui lòng xem tại ứng dụng <b>Hi FPT</b> (quét hoặc chạm mã QR, đăng nhập bằng SĐT <b>{{phone}}</b>)</p>
    `,

    body: `
        Thân chào {{honorific}} <b>{{customerName}}</b>,<br><br>
        Em là <b>{{staffName}}</b> – CSKH FPT Telecom.<br><br>
        Em cảm ơn {{pronoun}} đã phản hồi tích cực ạ. {INFO_BOX}<br><br>
        Lần tới khi cần báo hỏng hoặc yêu cầu phục vụ khác, {{honorific}} có thể gửi yêu cầu trực tiếp ngay trên Ứng dụng Hi FPT mà không cần gọi lên tổng đài ạ.<br><br>
        Chúc {{honorific}} cuối tuần vui vẻ!
    `
};
