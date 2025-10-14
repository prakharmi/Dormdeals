# DormDeals 🏠

A modern marketplace platform designed specifically for college students to buy and sell items within their campus community. Built with Node.js, Express, and MySQL, featuring Google OAuth authentication and Cloudinary integration for image management.

## 🌟 Features

### Core Functionality

- **College-Specific Marketplace**: Students can only view and interact with listings from their own college
- **User Authentication**: Secure Google OAuth integration for seamless login
- **Product Management**: Full CRUD operations for product listings
- **Image Upload**: Multiple image support with Cloudinary integration
- **Real-time Filtering**: Filter products by category and college
- **User Profiles**: Manage personal information and view listing history

### User Experience

- **Responsive Design**: Mobile-friendly interface
- **Intuitive Navigation**: Clean, modern UI with easy-to-use controls
- **Seller Information**: Direct access to seller contact details
- **Product Status**: Mark items as sold/available
- **Search & Filter**: Find products by category and college

## 🚀 Live Demo

- **Frontend**: [https://dormdeals.onrender.com](https://dormdeals.onrender.com)
- **Backend API**: [https://dormdeals-backend.onrender.com](https://dormdeals-backend.onrender.com)

## 🛠️ Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Cloudinary** - Image storage and management
- **Google OAuth** - Authentication
- **Multer** - File upload handling

### Frontend

- **HTML5** - Structure
- **CSS3** - Styling
- **JavaScript** - Client-side functionality
- **Google Sign-In API** - Authentication

### DevOps & Deployment

- **Render** - Cloud hosting platform
- **Environment Variables** - Configuration management

## 📁 Project Structure

```
dormdeals/
├── config/                 # Configuration files
│   ├── cloudinary.js       # Cloudinary setup
│   ├── database.js         # MySQL connection
│   └── multer.js           # File upload configuration
├── controllers/            # Request handlers
│   ├── productController.js
│   ├── userController.js
│   └── userProductController.js
├── models/                 # Data models
│   ├── product.js
│   ├── productimage.js
│   └── user.js
├── routes/                 # API routes
│   ├── productRoutes.js
│   ├── userRoutes.js
│   └── userProductRoutes.js
├── services/               # Business logic
│   ├── productService.js
│   └── userService.js
├── middleware/             # Custom middleware
│   └── errorHandler.js
├── public/                 # Static files
│   ├── Main Page/
│   ├── Product Detials/
│   ├── Product Listing/
│   ├── Product Page/
│   ├── User Info/
│   ├── USer Profile/
│   └── index.html
├── tmp/                    # Temporary file storage
├── app.js                  # Express app configuration
├── index.js                # Server entry point
└── package.json
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Cloudinary account
- Google OAuth credentials

### 1. Clone the Repository

```bash
git clone https://github.com/prakharmishra/dormdeals.git
cd dormdeals
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=dormdeals

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5000
UPLOAD_PATH=uploads
```

### 4. Database Setup

Create the required MySQL tables:

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

### 5. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication

- `GET /check-user/:email` - Check if user exists
- `POST /submit-form` - Create new user
- `GET /user/:email` - Get user details

### Products

- `GET /products?college=:college&category=:category` - Get products by college
- `GET /product/:id` - Get specific product details
- `POST /submit-product` - Create new product listing

### User Products

- `GET /user-products?email=:email` - Get user's products
- `PUT /product/:id` - Update product details
- `PUT /product/:id/status` - Toggle product sold status
- `DELETE /product/:id` - Delete product

## 🎯 Supported Colleges

- IIIT Surat
- IIIT Pune
- IIIT Bhopal
- IIIT Nagpur
- IIIT Vadodara

## 🔒 Security Features

- Google OAuth authentication
- Input validation and sanitization
- File type and size restrictions
- CORS configuration
- Environment variable protection
- SQL injection prevention

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

## 🙏 Acknowledgments

- Google OAuth for authentication services
- Cloudinary for image management
- Render for hosting services
- MySQL for database management

## 📞 Support

For support, email prakharmishraa30@gmail.com or create an issue in this repository.

---

⭐ **Star this repository if you find it helpful!**
