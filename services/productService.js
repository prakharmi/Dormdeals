const Product = require("../models/product");
const ProductImage = require("../models/productimage");
const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// A helper function to upload a buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "dormdeals" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

class ProductService {
  //Creates a product and uploads its images directly to Cloudinary.
  static async createProduct(productData, files) {
    try {
      const { productName, category, description, price, college, email } =
        productData;

      // 1. Validate incoming data
      if (
        !productName ||
        !category ||
        !description ||
        !price ||
        !college ||
        !email ||
        !files ||
        files.length === 0
      ) {
        throw new Error("All fields and at least one image are required.");
      }

      // 2. Create the product entry in the database first
      const productId = await Product.create({
        name: productName,
        category,
        description,
        price,
        college,
        user_email: email,
      });

      // 3. Upload images from buffers to Cloudinary
      const uploadPromises = files.map((file) => uploadFromBuffer(file.buffer));
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.secure_url);

      // 4. Create the corresponding image entries in your database
      const imageValues = imageUrls.map((url) => [productId, url]);
      await ProductImage.createMany(imageValues);

      return productId;
    } catch (error) {
      console.error("Error in ProductService.createProduct:", error);
      throw error;
    }
  }

  //Fetches all non-sold products for a given college.
  static async getProductsByCollege(college, category) {
    try {
      const products = await Product.findByCollege(college, category);
      return products;
    } catch (error) {
      throw error;
    }
  }

  // Fetches a single product and its associated data by ID.
  static async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return null;
      }

      // Get associated images
      const images = await ProductImage.findByProductId(productId);
      product.images = images.map((img) => img.image_url);

      // Seller info is already joined in the Product.findById query
      return product;
    } catch (error) {
      console.error("Error in ProductService.getProductById:", error);
      throw error;
    }
  }
}

module.exports = ProductService;
