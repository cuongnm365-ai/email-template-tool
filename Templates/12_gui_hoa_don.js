window.SOC_TEMPLATES = window.SOC_TEMPLATES || {};

window.SOC_TEMPLATES["t_gui_hoa_don"] = {
    name: "Mẫu Mới 9: Cung cấp hóa đơn điện tử",
    subject: "[Xử Lý] Cung cấp hóa đơn điện tử cước phí dịch vụ FPT Telecom",
    
    fields: [
        { id: "soHopDong", label: "Số hợp đồng", type: "text", note: "Ví dụ: HNABM0705" },
        { id: "diaChi", label: "Địa chỉ hợp đồng", type: "text", note: "Ghi rõ số nhà, đường, phường/xã..." },
        { id: "soDienThoai", label: "Số điện thoại đăng ký", type: "text", note: "SĐT dùng để đăng nhập Hi FPT" },
        { id: "soHoaDon", label: "Số hóa đơn/Mã dịch vụ", type: "text", note: "Ví dụ: U26HN00891068" },
        { id: "tuNgay", label: "Từ ngày (Bắt đầu kỳ cước)", type: "text", note: "Bỏ trống nếu không cần hiển thị. (VD: 01/06/2026)" },
        { id: "denNgay", label: "Đến ngày (Kết thúc kỳ cước)", type: "text", note: "Bỏ trống nếu không cần hiển thị. (VD: 30/06/2027)" }
    ],
    
    qrType: "thanh_toan", 
    
    boxContent: `
        <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 4px;"><b>Số hóa đơn / Mã dịch vụ:</b> {{soHoaDon}}</li>
            <li id="ky-cuoc-row" style="margin-bottom: 4px;"><b>Kỳ cước:</b> Từ ngày {{tuNgay}} đến ngày {{denNgay}}</li>
        </ul>
        <p style="margin-bottom:0; font-style: italic;">➔ Hoá đơn điện tử chi tiết vui lòng xem qua file đính kèm.</p>
        <script>
            // Đoạn script nhỏ gọn giúp tự động ẩn dòng kỳ cước trên giao diện tạo mail nếu Agent bỏ trống trường Từ ngày - Đến ngày
            var kyCuocRow = document.getElementById("ky-cuoc-row");
            if(kyCuocRow && kyCuocRow.innerText.includes("Từ ngày  đến ngày ")) {
                kyCuocRow.style.display = "none";
            }
        </script>
    `,

    body: `
        Thân chào {{honorific}} <b>{{customerName}}</b>,<br><br>
        Em là <b>{{staffName}}</b> – Nhân viên CSKH FPT Telecom.<br><br>
        Bên em đã ghi nhận yêu cầu về cước phí của {{pronounLc}} đối với Số hợp đồng <b>{{soHopDong}}</b> tại địa chỉ {{diaChi}}. Em đã kiểm tra và xin gửi lại {{pronounLc}} hoá đơn điện tử qua file đính kèm.<br><br>
        {{honorific}} <b>{{customerName}}</b> cũng có thể tra cứu hoá đơn điện tử qua ứng dụng <b>Hi FPT</b> hoặc website: <a href="https://fpt.vn/vi" target="_blank" style="color: #0056b3;">https://fpt.vn/vi</a> bằng cách đăng nhập số điện thoại đăng ký <b>{{soDienThoai}}</b>.<br><br>
        
        {INFO_BOX}<br><br>
        
        Thanh toán nhanh, an toàn & dễ dàng kiểm tra tình trạng thanh toán ngay tại ứng dụng <b>Hi FPT</b> (quét hoặc chạm mã QR bên cạnh, đăng nhập SĐT {{soDienThoai}}).<br><br>
        Trong quá trình sử dụng, khi cần báo hỏng hoặc yêu cầu phục vụ khác, {{pronounLc}} có thể quét mã QR để gửi yêu cầu trực tiếp trên Ứng dụng Hi FPT tại mục "Phục vụ" hoặc "Báo hỏng nhanh". Bên em sẽ xử lý nhanh chóng mà không cần gọi hotline.<br><br>
        Chân thành cảm ơn {{honorific}} <b>{{customerName}}</b> đã tin tưởng và sử dụng dịch vụ của FPT Telecom.<br><br>
        `
      };
