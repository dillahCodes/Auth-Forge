# Authentication Flow Documentation

## 📌 Flow Register (User Registration)

1. **Client mengirim data register:**

   - email
   - password
   - name (opsional)

2. **Server validasi input:**

   - format email valid
   - password memenuhi panjang minimum
   - email belum terdaftar

3. **Server hashing password** (misalnya bcrypt).

4. **Server menyimpan user baru ke database**:

   - id (UUID)
   - email
   - hashed password
   - name (opsional)

5. **Opsional — langsung membuat session:**

   - membuat row baru di tabel `Sessions`
   - mengirim refresh token + access token ke client

6. **Server mengirim response sukses ke client.**

---

## 📌 Flow Login (User Authentication)

1. **Client mengirim kredensial login:**

   - email
   - password

2. **Server validasi input**  
   (format email & panjang password).

3. **Server mencari user berdasarkan email.**

   - jika user tidak ditemukan → _login gagal_

4. **Server verifikasi password:**

   - compare password plain vs hashed password
   - jika tidak cocok → _login gagal_

5. **Server membuat session baru:**

   - generate refresh token (random string & hashed)
   - insert ke tabel Sessions:
     - userId
     - hashed refresh token
     - expiresAt (mis. 7 hari)
     - ipAddress (opsional)
     - userAgent (opsional)

6. **Server membuat access token (JWT)**  
   (umur pendek, mis. 15 menit).

7. **Server mengirim ke client:**

   - access token (header/body/cookie — sesuai arsitektur)
   - refresh token (HTTPOnly Cookie, Secure, SameSite=Strict)

8. **Client menggunakan access token**  
   untuk request selanjutnya.

---

## 📌 Flow Refresh Token Rotation

1. **Client mengirim refresh token lama**  
   (`session.id = A`).

2. **Server memvalidasi session A:**

   - belum `revoked`
   - belum `expired`

3. **Server membuat session baru**  
   (`session.id = B`) + refresh token baru.

4. **Server menandai session lama (A) sebagai invalid:**

   - set `revoked = true`
   - set `replacedBy = B`

5. **Server mengirim refresh token baru (B)** ke client.

---
