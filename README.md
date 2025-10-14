# DormDeals 🏠

A modern marketplace for college students to buy and sell items on campus. Built with Node.js, Express, and MySQL, now featuring a secure Passport.js Google OAuth flow and direct-to-Cloudinary image uploads.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js**
- **MySQL**
- **Passport.js** (for Google OAuth 2.0)
- **Cloudinary** (for image storage)
- **Multer** (for handling uploads in memory)
- **Express Session** (for session management)

### Frontend
- **HTML5**
- **Tailwind CSS** (via CDN)
- **JavaScript**

---

## 📁 Project Structure
```
dormdeals/
├── config/
│   ├── cloudinary.js
│   ├── database.js
│   ├── multer.js
│   └── passport.js
├── controllers/
│   ├── productController.js
│   ├── userController.js
│   └── userProductController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── redirectMiddleware.js
├── models/
│   ├── product.js
│   ├── productimage.js
│   └── user.js
├── public/
│   ├── assets/
│   ├── Main Page/
│   └── ... (other pages)
├── routes/
│   ├── productRoutes.js
│   ├── userProductRoutes.js
│   └── userRoutes.js
├── services/
│   ├── productService.js
│   └── userProductService.js
├── app.js
├── index.js
└── package.json
```

---

## 🔧 Setup

### 1. Environment Variables
Create a `.env` file in the root directory.

```env
# Server
PORT=8080
NODE_ENV=development
SESSION_SECRET=your_super_secret_key

# Database
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=dormdeals

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 2. Database Schema

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NULL,
    mobile_number VARCHAR(15) NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    googleId VARCHAR(255) UNIQUE NULL,
    picture VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    college VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email)
);

-- Product images table
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### 3. Run the App
```bash
# Install dependencies
npm install

# Run for development
npm run dev
```
The app will be available at `http://localhost:8080`.

---

## 📚 API Routes
All API routes are prefixed with `/api`.

### Auth
- `GET /auth/google` - Initiates Google login.
- `GET /auth/google/callback` - Callback URL for Google.
- `GET /users/logout` - Logs the user out.
- `GET /users/status` - Checks if a user is currently logged in.

### User
- `POST /users/register` - Finishes registration for a new user.

### Products
- `GET /products` - Get products by college.
- `GET /product/:id` - Get a single product.
- `POST /submit-product` - **(Protected)** Create a new product.

### User's Products
- `GET /user-products` - **(Protected)** Get the logged-in user's products.
- `PUT /product/:id` - **(Protected)** Update one of your products.
- `DELETE /product/:id` - **(Protected)** Delete one of your products.
- `PUT /product/:id/status` - **(Protected)** Mark a product as sold/available.

## 🎯 Supported Colleges

- IIIT Surat
- IIIT Pune
- IIIT Bhopal
- IIIT Nagpur
- IIIT Vadodara

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

**Prakhar Mishra**
- LinkedIn: [prakhar-mishraa](https://www.linkedin.com/in/prakhar-mishraa)
- Instagram: [prakharmishraaaa](https://www.instagram.com/prakharmishraaaa)
- GitHub: [prakharmi](https://github.com/prakharmi)

## 📞 Support

For support, email prakharmishraa30@gmail.com or create an issue in this repository.

---

⭐ **Star this repository if you find it helpful!**