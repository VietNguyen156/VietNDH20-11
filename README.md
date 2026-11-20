# Thiệp gửi cô

Trang dùng HTML/CSS/JavaScript và API serverless trên Vercel; không cần máy chủ riêng.

## Chỉnh sửa
Khi mở dự án trên máy bạn (file hoặc localhost), nút **Chỉnh nội dung** tự hiện ở góc trên. Trên website đã xuất bản, nút này mặc định bị ẩn; mở đường dẫn có `?edit=1` để hiện, ví dụ: `https://ten-mien-cua-ban/?edit=1`.

Chế độ công khai không hiển thị nút hoặc bảng chỉnh sửa. `?edit=1` chỉ hiện giao diện; API chỉ cho phép xuất bản khi nhập đúng `EDITOR_PASSWORD`. Nội dung, ảnh và nhạc đã xuất bản là công khai.

Khi mở bằng file hoặc Live Server, nội dung chữ được lưu trong bộ nhớ trình duyệt; ảnh và nhạc được lưu bằng IndexedDB trên chính trình duyệt đó. Khi triển khai trên Vercel và cấu hình lưu trữ bên dưới, **Lưu thay đổi** sẽ cập nhật bản dùng chung để khách truy cập thấy cùng nội dung, ảnh và nhạc. Muốn xuất bản cần nhập mật khẩu quản trị; chỉ hiện `?edit=1` không đủ quyền ghi.

Trang thử phát nhạc khi mở. Nếu trình duyệt chặn tự phát, nhạc sẽ bắt đầu khi người xem chạm hoặc nhấn phím lần đầu; có thể bật/tắt nhạc bằng nút trong cảnh tinh cầu.

## Ảnh và tinh cầu kỷ niệm
Trong **Chỉnh sửa thiệp**, dùng riêng mục **Ảnh trên thiệp** và **Ảnh trên tinh cầu** để tải lên hoặc xóa ảnh. Hai nhóm ảnh độc lập; ảnh trên thư không tự xuất hiện trên tinh cầu và ngược lại. Thiệp nhận tối đa 3 ảnh; tinh cầu không giới hạn số ảnh. Ảnh từ phiên bản cũ được giữ trong mục ảnh trên thiệp; hãy thêm riêng các ảnh muốn đưa lên tinh cầu. Mở thư, chọn **Khám phá tinh cầu kỷ niệm**; tinh cầu tự quay liên tục, có thể kéo để xoay thêm, cuộn chuột hoặc chụm hai ngón để thu phóng. Chạm vào ảnh polaroid để xem lớn, rồi chạm ảnh hoặc nút `×` để đóng. Nếu chưa thêm ảnh cho tinh cầu, trang hiện khung trang trí.

## Đưa phiên bản mới lên GitHub

Vercel phải triển khai cả `index.html`, thư mục `api`, thư mục `lib`, `package.json` và `package-lock.json`. Các tệp này phải nằm bên trong **Root Directory** của project Vercel.

1. Mở bản clone repository trong VS Code hoặc GitHub Desktop. Repository trước đây là [VietNDH20-11](https://github.com/VietNguyen156/VietNDH20-11).
2. Chép các tệp/thư mục mới từ dự án vào đúng thư mục đang chứa `index.html`: `api/card.js`, `api/blob-upload.js`, `lib/card-auth.js`, `package.json`, `package-lock.json` và `.gitignore`; đồng thời thay `index.html` và `README.md` bằng bản mới.
3. Không chép `node_modules`, `.env`, `.env.local` hoặc bất kỳ token/mật khẩu nào vào GitHub.
4. Trong GitHub Desktop, kiểm tra danh sách **Changes**, nhập thông điệp như `Add shared card publishing`, rồi chọn **Commit to main** và **Push origin**. Nếu dùng Git trong terminal, chạy từ thư mục repository:

   ```powershell
   git status
   git add index.html api lib package.json package-lock.json .gitignore README.md
   git commit -m "Add shared card publishing"
   git push origin main
   ```

   Nếu project nằm trong thư mục con của repository, dùng đường dẫn tương ứng với thư mục con thay cho các đường dẫn ở lệnh `git add`.

## Cấu hình Vercel Blob và mật khẩu quản trị

### 1. Mở đúng project Vercel

1. Đăng nhập [Vercel Dashboard](https://vercel.com/dashboard).
2. Mở project đang gắn với `https://viethappy2011.vercel.app/`.
3. Trong **Settings → General**, kiểm tra **Root Directory**. Thư mục này phải chứa `index.html`, `package.json`, `api/` và `lib/`. Nếu các tệp nằm ngay thư mục gốc của repository, để Root Directory là `./` hoặc giá trị mặc định.

### 2. Tạo Blob Store

1. Trong project, mở **Storage** rồi chọn **Create Database / Create Storage → Blob** (tên nút có thể khác đôi chút theo giao diện Vercel).
2. Chọn quyền **Public**. Ảnh, nhạc và nội dung thiệp được hiển thị cho khách truy cập nên cần đọc công khai.
3. Khi được hỏi có tạo read-write token environment variable hay không, bật tùy chọn đó. Tên biến mặc định là `BLOB_READ_WRITE_TOKEN`.
4. Kết nối Blob Store với đúng project. Bảo đảm store được kết nối cho môi trường **Production**; có thể bật thêm **Preview** nếu muốn thử trên preview deployment.

`BLOB_READ_WRITE_TOKEN` là bí mật. Không gửi token này cho người khác, không dán vào `index.html` và không commit vào GitHub.

### 3. Tạo mật khẩu xuất bản

1. Vào **Settings → Environment Variables** của đúng project.
2. Tạo biến:
   - **Key:** `EDITOR_PASSWORD`
   - **Value:** một mật khẩu dài, khó đoán và chỉ bạn biết.
   - **Environment:** chọn ít nhất **Production**; chọn thêm **Preview** nếu cần kiểm tra bản preview.
3. Lưu biến môi trường. Không đặt tiền tố `NEXT_PUBLIC_` hoặc `VITE_`; biến này chỉ được API phía máy chủ đọc.

Mật khẩu này khác với `BLOB_READ_WRITE_TOKEN`. Không nhập Blob token làm mật khẩu quản trị.

### 4. Deploy lại

Sau khi push code và tạo/kết nối Blob Store cùng các biến môi trường:

1. Mở tab **Deployments** của project.
2. Đợi deployment mới từ commit vừa push hoàn tất và có trạng thái **Ready**. Nếu chưa có deployment mới, chọn **Redeploy** ở deployment mới nhất sau khi đã lưu biến môi trường.
3. Mở `https://viethappy2011.vercel.app/api/card`:
   - `{"state":null}` nghĩa là API hoạt động nhưng chưa có thiệp online.
   - `{"state":{...}}` nghĩa là đã có thiệp được xuất bản.
   - Nếu thấy trang 404, kiểm tra Root Directory có chứa thư mục `api`.
   - Nếu trả lỗi 503, kiểm tra Blob Store đã nối đúng project và `BLOB_READ_WRITE_TOKEN`/`EDITOR_PASSWORD` đã được đặt cho **Production**; sau đó redeploy.

### 5. Chỉnh và xuất bản thiệp lần đầu

1. Mở `https://viethappy2011.vercel.app/?edit=1`.
2. Chỉnh chữ, thêm tối đa 3 ảnh trên thiệp, thêm ảnh cho tinh cầu và chọn nhạc như bình thường.
3. Bấm **Lưu thay đổi** và nhập `EDITOR_PASSWORD`. Đợi thông báo xác nhận đã cập nhật website chính.
4. Mở `https://viethappy2011.vercel.app/` trong tab ẩn danh hoặc thiết bị khác để kiểm tra bản công khai.

Nếu chữ, ảnh hoặc nhạc trước đây chỉ được lưu trên `localhost`, `file://` hoặc một trình duyệt khác, dữ liệu đó không tự chuyển sang domain Vercel. Hãy nhập lại chữ và tải lại ảnh/nhạc ở trang `?edit=1` trên domain Vercel rồi xuất bản lần đầu.

## Bảo mật và giới hạn

- Người xem không cần mật khẩu; chỉ thao tác lưu/xuất bản yêu cầu `EDITOR_PASSWORD`.
- Ảnh và nhạc trên Blob cùng nội dung thiệp là công khai. Không tải lên dữ liệu riêng tư.
- Chế độ file/Live Server chỉ lưu trong trình duyệt hiện tại; muốn đồng bộ phải dùng domain Vercel đã cấu hình.
- Trình duyệt có thể chặn tự phát nhạc; khi đó nhạc bắt đầu sau lần chạm/phím đầu tiên của người xem.
