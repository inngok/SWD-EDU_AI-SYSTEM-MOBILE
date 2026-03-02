# Tài Liệu Dự Án Mobile (EduSystem)

Tài liệu này tổng hợp lại cấu trúc, công nghệ và các quy tắc phát triển trong dự án EduSystem Mobile.

## 1. Công Nghệ Sử Dụng (Tech Stack)

*   **Framework chính**: [React Native](https://reactnative.dev/) (phiên bản 0.81.5) & [Expo](https://expo.dev/) (SDK 54).
    *   Lý do: Phát triển đa nền tảng (iOS, Android) nhanh chóng, dễ dàng setup.
*   **Ngôn ngữ**: JavaScript (ES6+).
*   **Styling**: [NativeWind](https://www.nativewind.dev/) (TailwindCSS cho React Native).
    *   Lý do: Viết style nhanh gọn ngay trong JSX thông qua `className`, dễ bảo trì và đồng bộ design system.
*   **Quản lý API**: [Axios](https://axios-http.com/).
    *   Lý do: Thư viện HTTP client mạnh mẽ, hỗ trợ interceptors để xử lý global request/response.
*   **Icons**: [Lucide React Native](https://lucide.dev/).
    *   Lý do: Bộ icon đẹp, hiện đại, nhất quán.
*   **Navigation**: Tự custom Sidebar đơn giản (hiện tại), có thể nâng cấp lên `react-navigation` sau này.

---

## 2. Cấu Trúc Dự Án (Folder Structure)

Dự án được tổ chức theo kiến trúc **Feature-based** (chia theo tính năng), giúp code dễ đọc, dễ mở rộng và module hóa.

```
mobile/
├── App.js                  # Entry point chính của ứng dụng. Quản lý Auth state và Routing cơ bản.
├── global.css              # File CSS global (cấu hình Tailwind).
├── src/
│   ├── api/                # Cấu hình API chung cho toàn dự án.
│   │   └── axios-client.js # Instance axios global (Base URL, Interceptors).
│   │
│   ├── components/         # Các UI component dùng chung (Reusable components).
│   │   ├── Card.js         # Component thẻ bao ngoài (Container).
│   │   └── ProgressBar.js  # Thanh tiến trình.
│   │
│   ├── features/           # Nơi chứa logic chính, chia theo Tính Năng (Feature).
│   │   ├── auth/           # Tính năng Xác thực (Đăng nhập, Đăng ký).
│   │   │   ├── api/        # API service riêng cho Auth.
│   │   │   │   └── auth-api.js
│   │   │   └── LoginScreen.js # Màn hình đăng nhập.
│   │   │
│   │   ├── dashboard/      # Tính năng Dashboard (Bảng điều khiển).
│   │   │   ├── admin/      # Dành cho Admin.
│   │   │   ├── manager/    # Dành cho Quản lý.
│   │   │   ├── student/    # Dành cho Sinh viên.
│   │   │   └── teacher/    # Dành cho Giáo viên.
│   │   │
│   │   └── layout/         # Các thành phần bố cục chung.
│   │       └── Sidebar.js  # Menu điều hướng bên trái.
│   │
│   └── lib/                # Các hàm tiện ích (Utilities).
│       └── utils.js        # Hàm cn() để merge class Tailwind.
```

---

## 3. Luồng Hoạt Động Chính (Workflows)

### 3.1. Xác Thực & Phân Quyền (Authentication & Authorization)
1.  **Mở App**: `App.js` kiểm tra biến trạng thái `isAuthenticated`. Mặc định là `false`.
2.  **Màn Hình Login**: App hiển thị `LoginScreen`.
3.  **Gọi API**:
    *   User nhập Email/Pass.
    *   `LoginScreen` gọi `authApi.login()` -> `axiosClient` gửi POST request tới Server.
4.  **Xử Lý Sau Login**:
    *   Server trả về token và thông tin user.
    *   `handleLoginSuccess` trong `App.js` được gọi.
    *   Lưu `role` (vai trò) của user.
    *   Chuyển hướng đến Dashboard tương ứng dựa trên `role` (Admin, Manager, Teacher, Student).

### 3.2. Hiển Thị Dashboard (Rendering)
*   Sử dụng Conditional Rendering (Switch-case) trong `App.js` để hiển thị component Dashboard đúng với quyền của user.

### 3.3. Call API
*   **Quy tắc**: Không gọi `fetch` hoặc `axios` trực tiếp trong component.
*   **Cách làm đúng**:
    1.  Tạo file `api` trong folder feature tương ứng (ví dụ: `src/features/product/api/product-api.js`).
    2.  Định nghĩa các hàm gọi API tại đó.
    3.  Import hàm vào component và sử dụng.
*   **Lợi ích**: Dễ管理的 endpoint, dễ sửa đổi khi Server thay đổi API, code component gọn gàng.

---

## 4. Các Lưu Ý Quan Trọng (Best Practices)

1.  **Class Tailwind**: Sử dụng hàm `cn("class-gốc", className)` khi viết component để có thể ghi đè style từ bên ngoài (overwrite).
2.  **An Toàn (SafeArea)**: Luôn bọc màn hình chính trong `SafeAreaView` hoặc `SafeAreaProvider` để tránh bị tai thỏ, notch che mất nội dung.
3.  **Responsive**:
    *   Hạn chế dùng kích thước cố định (`width: 100`).
    *   Ưu tiên dùng Flexbox (`flex-1`, `justify-between`) hoặc phần trăm (`w-[48%]`) để giao diện đẹp trên nhiều cỡ màn hình.

---

## 5. Hướng Dẫn Chạy Dự Án

*   **Cài đặt thư viện**: `npm install`
*   **Chạy server phát triển**: `npm start` (hoặc `npx expo start`)
*   **Xóa cache (khi gặp lỗi lạ)**: `npm start -- --clear`

---
*Tài liệu được tạo ngày 06/02/2026 bởi Đội ngũ phát triển.*
