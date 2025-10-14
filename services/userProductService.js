const Product = require("../models/product");
const ProductImage = require("../models/productimage");
const cloudinary = require("../config/cloudinary");

class UserProductService {
  // Verifies that the logged-in user is the owner of the product.
  static async verifyOwnership(productId, userEmail) {
    const product = await Product.findById(productId);
    if (!product || product.user_email !== userEmail) {
      return null;
    }
    return product;
  }

  // Deletes a product and its associated images from Cloudinary.
  static async deleteProduct(productId) {
    // 1. Get image URLs from the database before deleting the product
    const images = await ProductImage.findByProductId(productId);

    // 2. Delete the product from the database (which also deletes image records via CASCADE)
    const wasDeleted = await Product.delete(productId);
    if (!wasDeleted) {
      throw new Error("Product not found or could not be deleted.");
    }

    // 3. Delete the actual images from Cloudinary
    if (images && images.length > 0) {
      const publicIds = images.map((img) => {
        // Extracts the public ID from a URL like:
        // http://res.cloudinary.com/cloud/image/upload/v123/dormdeals/public_id.jpg
        const parts = img.image_url.split("/");
        const publicIdWithExt = parts.slice(-2).join("/"); // "dormdeals/public_id.jpg"
        return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf("."));
      });

      // Asynchronously delete all images
      await Promise.all(
        publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)),
      );
    }

    return true;
  }
}

module.exports = UserProductService;
