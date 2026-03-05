# 📘 Cẩm nang Phát triển Dự án EduSystem Mobile

Tài liệu này cung cấp cái nhìn chi tiết về kiến trúc, công nghệ và các kỹ thuật lập trình được áp dụng trong dự án EduSystem Mobile.

---

## 1. Hệ Sinh Thái Công Nghệ (Core Tech Stack)

### ⚛️ React Native & Expo (SDK 54)
Dự án sử dụng **React Native** giúp viết code một lần bằng JavaScript và chạy được trên cả iOS và Android. **Expo** được dùng làm bộ công cụ hỗ trợ giúp quá trình phát triển (hot reload), chạy thử trên điện thoại thật qua QR code và build app trở nên dễ dàng hơn.

### 🎨 Styling với NativeWind (Tailwind CSS)
Thay vì viết `StyleSheet.create`, chúng ta dùng `className`.
- **Ưu điểm**: Tốc độ viết code nhanh, giao diện nhất quán.
- **Lưu ý quan trọng**: Không phải thuộc tính Tailwind nào cũng chạy trên Mobile (ví dụ: `hover:`, `active:` chỉ hoạt động hạn chế trên một số component). Nếu NativeWind không nhận, hãy dùng inline `style`.

### 📡 Giao tiếp mạng (Axios)
Sử dụng **Axios Client** (`src/api/axios-client.js`) được bọc bởi Interceptors:
- Tự động đính kèm `Authorization: Bearer <token>` vào mọi yêu cầu.
- Xử lý tập trung các lỗi 401 (hết hạn phiên đăng nhập) để đá người dùng ra màn hình Login.

### 🏗️ Icons & Components
- **Lucide React Native**: Bộ icon chính. Lưu ý import đúng từ `lucide-react-native`.
- **Reusable Components**: Nằm trong `src/components/`, ví dụ: `ProgressBar`, `Card`.

---

## 2. Kiến Thức React Native Cần Nhớ (Project Level)

### 🧩 Thành phần cơ bản
- **`View`**: Thay thế cho `<div>`, dùng để bố cục.
- **`Text`**: Hệ thống KHÔNG tự hiểu chữ nếu không bọc trong `<Text>`.
- **`TouchableOpacity`**: Thay thế cho `<button>`, hỗ trợ hiệu ứng mờ khi nhấn.
- **`ScrollView`**: Mặc định diện tích màn hình điện thoại không tự cuộn, phải bọc nội dung trong `ScrollView`.

### 📏 Bí kíp Responsive & Chống Vỡ UI (Layout)
Mobile có màn hình rất đa dạng (notch, tai thỏ, màn hình dài/ngắn).
1.  **Flexbox là Vua**: Luôn dùng `flex-row`, `justify-between`, `items-center` để dàn trang. Hạn chế dùng `px` cố định cho chiều rộng.
2.  **`numberOfLines`**: Cực kỳ quan trọng để chống đè chữ. Luôn giới hạn dòng cho tiêu đề khóa học hoặc tên user.
3.  **`adjustsFontSizeToFit`**: Tự động co nhỏ chữ nếu text quá dài so với khung.
4.  **SafeArea**: Sử dụng `SafeAreaView` để nội dung không bị chui vào phần loa thoại hoặc thanh pin.

---

## 3. Hệ Thống Phân Quyền & Vai Trò (Roles)

Dự án có hệ thống phân quyền chặt chẽ dựa trên dữ liệu từ Backend:

### 🎭 Danh sách Roles & ID:
- **Admin (1)**: Quản trị viên hệ thống.
- **Manager (2)**: Quản lý chi nhánh/trung tâm.
- **Teacher (3)**: Giáo viên (có Dashboard riêng).
- **Student (4)**: Học sinh/Sinh viên (Dashboard tập trung vào tiến độ học tập).

### ⚙️ Cơ chế Chuẩn hóa (Normalization):
Trong `App.js` và `Sidebar.js`, chúng ta tuyệt đối không tin tưởng 100% vào định dạng role từ API. Luôn dùng hàm chuẩn hóa:
```javascript
// Ví dụ logic thực tế trong App.js
const normalizedRole = role === 1 || String(role).toLowerCase() === 'admin' ? 'Admin' : 'Student';
```

---

## 4. Cấu Trúc Điều Hướng (Navigation)

Hiện tại dự án dùng **Custom Navigation** thông qua `activeTab` trong `App.js`.

### 🧭 Luồng hiển thị (Rendering Flow):
1. **Sidebar.js**: Người dùng nhấn vào Menu -> Gọi hàm `onTabChange('tên_tab')`.
2. **App.js**: State `activeTab` thay đổi -> Hàm `renderContent()` chạy lại -> Trả về Component tương ứng.

### 📋 Danh sách Tab học sinh:
- `student_dashboard`: Tổng quan học tập (Biểu đồ, dead-line).
- `student_courses`: Danh sách khóa học & Khám phá khóa học mới.
- `student_tests`: (Coming soon) Bài kiểm tra.
- `student_progress`: (Coming soon) Lộ trình tiến độ.

---

## 5. Quy trình làm việc với API (Best Practices)

Tất cả logic gọi API KHÔNG được viết trực tiếp trong file UI. Phải tuân thủ:
1.  **Định nghĩa Service**: Tạo file tại `src/features/<feature>/api/<name>-api.js`.
2.  **Sử dụng Axios Instance**: Luôn import từ `src/api/axios-client`.
3.  **Xử lý dữ liệu**: Dữ liệu từ API thường nằm sâu trong `response.data.data`. Hãy luôn dùng **Optional Chaining (`?.`)**:
    ```javascript
    const name = res.data?.data?.fullName || 'Người dùng';
    ```

---

## 6. Mẹo Debug cho Lập trình viên mới
- **Xóa Cache**: Nếu giao diện không cập nhật dù đã lưu file, chạy `npm start -- --clear`.
- **Console Log**: Log role và tab trong `App.js` để biết tại sao màn hình không nhảy (`console.log("Active Tab:", activeTab)`).
- **Network Debug**: Dùng React Native Debugger hoặc kiểm tra interceptor trong `axios-client.js`.

---
*Cập nhật lần cuối: 06/03/2026 bởi Antigravity AI.*
