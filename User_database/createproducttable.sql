USE dormdealsuser;

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(100),
    product_description TEXT,
    product_details TEXT,
    price DECIMAL(10, 2) NOT NULL,
    date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_photos JSON
);
