# 🔐 Authentication & Account Security Checklist

Dokumen ini berisi checklist **Client Logic**, **Server Validation**, dan **Server Security**
untuk memastikan sistem autentikasi aman, konsisten, dan tidak membocorkan informasi sensitif.

---

## 🔑 LOGIN

### 🖥️ Client Logic (UX)

- [x] Berhasil memanggil login endpoint
- [x] Menampilkan loading state saat request
- [x] Menampilkan error **generic**  
       _(contoh: "Email atau password salah")_

### 🛡️ Client Security

- [x] Tidak log credential ke console
- [x] Menggunakan HttpOnly cookie (bukan localStorage)

### ✅ Server Validation

- [x] Validasi format email
- [x] Validasi password tidak kosong
- [x] Lookup user secara internal

### 🔒 Server Security

- [x] **Tidak mengirim error spesifik** (email tidak ditemukan / password salah)
- [x] Rate limit login attempt
- [x] set HttpOnly cookie, & samesite lax pada client

---

## 🧾 REGISTER

### 🖥️ Client Logic (UX)

- [x] Berhasil memanggil register endpoint
- [x] Menampilkan error per field (username, email, password)
- [x] Menampilkan success state (redirect / message)

### 🛡️ Client Security

- [x] Password hanya dikirim melalui HTTPS
- [x] Rate limit spam register

### ✅ Server Validation

- [x] Validasi username (length, charset)
- [x] Validasi format email
- [x] Validasi kekuatan password
- [x] Cek email telah digunakan

### 🔒 Server Security

- [x] Hash password (bcrypt / argon2)

---

## 🔁 FORGOT PASSWORD — SEND EMAIL

### 🖥️ Client Logic (UX)

- [x] Berhasil memanggil endpoint forgot password
- [x] Selalu tampilkan pesan sukses  
       _(contoh: "Jika email terdaftar, instruksi telah dikirim")_

### 🛡️ Client Security

- [x] Jangan menampilkan indikasi email ada/tidak

### ✅ Server Validation

- [x] Validasi format email
- [x] Lookup user secara internal

### 🔒 Server Security

- [x] **JANGAN kirim error email tidak ditemukan**
- [x] Selalu return response sukses
- [x] Generate OTP / token dengan expiry
- [x] Rate limit forgot password request

---

## 🔁 FORGOT PASSWORD — VERIFY OTP

### 🖥️ Client Logic (UX)

- [x] Berhasil memanggil verify OTP endpoint
- [x] Menampilkan error **generic**  
       _(contoh: "Kode tidak valid atau kadaluarsa")_

### 🛡️ Client Security

- [x] Jangan retry OTP otomatis

### ✅ Server Validation

- [x] Validasi format OTP
- [x] Validasi OTP belum expired

### 🔒 Server Security

- [x] **JANGAN kirim detail error OTP**
- [x] OTP sekali pakai (invalidate setelah sukses)
- [x] Rate limit verifikasi OTP
- [x] Hapus OTP setelah expired

---

## 🔐 RESET PASSWORD (FINAL STEP)

### 🖥️ Client Logic (UX)

- [x] Berhasil memanggil reset password endpoint
- [x] Redirect ke halaman login setelah sukses
- [x] Menampilkan pesan sukses singkat

### 🛡️ Client Security

- [x] Jangan auto-login setelah reset password
- [x] Jangan menyimpan password baru di memory

### ✅ Server Validation

- [x] Validasi kekuatan password baru
- [x] Pastikan OTP / token valid dan belum digunakan

### 🔒 Server Security

- [x] Update password dengan hash baru
- [x] **Revoke ALL sessions user**
- [x] Invalidate semua refresh token
- [x] Clear auth cookies

---

## ✉️ EMAIL VERIFICATION

### 🖥️ Client Logic (UX)

- [x] Menampilkan form input kode verifikasi (6 digit)
- [x] Tombol **Verify Email** mengirim kode ke server
- [x] Tombol **Resend Code** dengan countdown
- [x] Menampilkan pesan sukses / error secara **generic**

### 🛡️ Client Security

- [x] Disable resend selama countdown aktif

### ✅ Server Validation

- [x] Validasi format kode verifikasi
- [x] Validasi masa berlaku kode

### 🔒 Server Security

- [x] Kode verifikasi hanya bisa digunakan **sekali**
- [x] Update status email sebagai terverifikasi
- [x] Rate limit kirim & verifikasi kode

---

## 🖥️ SESSIONS MANAGEMENT

### 🖥️ Client Logic (UX)

- [x] Menampilkan daftar sesi aktif user
- [x] Menandai sesi yang sedang digunakan (current session)
- [x] Menyediakan aksi revoke satu sesi
- [x] Menyediakan aksi revoke semua sesi

### 🛡️ Client Security

- [x] Semua request sesi membutuhkan access token
- [x] Tidak menyimpan token di client storage
- [x] Revoke session memicu update UI secara langsung

### ✅ Server Validation

- [x] Validasi access token untuk semua endpoint sesi
- [x] Validasi refresh token sebelum token rotation
- [x] Validasi kepemilikan sesi sebelum revoke
- [x] Validasi session masih aktif (tidak revoked / deleted)

### 🔒 Server Security

- [x] Deteksi refresh token replay attack
- [x] Token rotation pada refresh token
- [x] Revoke session chain saat revoke per sesi
- [x] Revoke semua sesi saat terdeteksi anomali replay attack
