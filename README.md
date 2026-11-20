# Thiệp gửi cô

Thiệp chạy dưới dạng website tĩnh, không cần backend hoặc cài thư viện.

## Chỉnh sửa
Khi mở dự án trên máy bạn (file hoặc localhost), nút **Chỉnh nội dung** tự hiện ở góc trên. Trên website đã xuất bản, nút này mặc định bị ẩn; mở đường dẫn có `?edit=1` để hiện, ví dụ: `https://ten-mien-cua-ban/?edit=1`.

Chế độ công khai không hiển thị nút hoặc bảng chỉnh sửa. Đây là ẩn giao diện, không phải xác thực bảo mật phía máy chủ; với trang tĩnh, URL và dữ liệu công khai vẫn có thể được nhà phát triển kiểm tra.

Nội dung chữ được lưu trong bộ nhớ trình duyệt; ảnh và nhạc được lưu bằng IndexedDB trên chính trình duyệt đó. Thay đổi không tự đồng bộ sang trình duyệt hoặc thiết bị của khách truy cập. Để mẹ và mọi người cùng nhìn thấy cùng một nội dung đã chỉnh, cần bổ sung dịch vụ lưu trữ dùng chung.

Trang không tự phát nhạc. Người xem có thể bật/tắt nhạc bằng nút trong cảnh tinh cầu; trình duyệt chỉ phát sau thao tác chủ động đó. Tệp nhạc đã chọn vẫn được lưu riêng trên trình duyệt hiện tại, chưa tự đưa vào website đã xuất bản.

## Ảnh và tinh cầu kỷ niệm
Trong **Chỉnh sửa thiệp**, dùng riêng mục **Ảnh trên thiệp** và **Ảnh trên tinh cầu** để tải lên hoặc xóa ảnh. Hai nhóm ảnh độc lập; ảnh trên thư không tự xuất hiện trên tinh cầu và ngược lại. Thiệp nhận tối đa 3 ảnh; tinh cầu không giới hạn số ảnh. Ảnh từ phiên bản cũ được giữ trong mục ảnh trên thiệp; hãy thêm riêng các ảnh muốn đưa lên tinh cầu. Mở thư, chọn **Khám phá tinh cầu kỷ niệm**; kéo để xoay, cuộn chuột hoặc chụm hai ngón để thu phóng. Chạm vào ảnh polaroid để xem lớn, rồi chạm ảnh hoặc nút `×` để đóng. Nếu chưa thêm ảnh cho tinh cầu, trang hiện khung trang trí.

## Deploy lên Vercel

1. Đưa thư mục `teacher-card` lên một repository Git.
2. Trên Vercel, chọn **Add New → Project** và import repository.
3. Đặt **Root Directory** là `teacher-card` (nếu repository chứa cả dự án khác).
4. Chọn framework **Other**; để trống Build Command và Output Directory.
5. Nhấn **Deploy**. `index.html` được Vercel phục vụ trực tiếp.

Có thể xem trước bằng cách mở `index.html` trên trình duyệt. Để phát nhạc và lưu nội dung, nên chạy trang qua localhost hoặc địa chỉ HTTPS thay vì `file://`.
