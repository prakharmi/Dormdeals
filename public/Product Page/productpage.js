const API_BASE_URL = 'https://dormdeals-backend.onrender.com';

function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  const payload = JSON.parse(atob(response.credential.split(".")[1]));
  console.log("User Info:", payload);

  localStorage.setItem("userToken", response.credential);
  localStorage.setItem("userEmail", payload.email);
  localStorage.setItem("userName", payload.name);

  fetch(`${API_BASE_URL}/check-user/${encodeURIComponent(payload.email)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.exists) {
        localStorage.setItem("userCollege", data.user.college);
        displayUserInfo();
        window.location.reload();
      } else {
        window.location.href = "../User%20Info/userinfo.html";
      }
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      window.location.href = "../User%20Info/userinfo.html";
    });
}

function displaySignOutButton() {
  const signInButtonContainer = document.getElementById("google-signin-button");

  if (signInButtonContainer) {
    signInButtonContainer.innerHTML = "";

    const signOutButton = document.createElement("button");
    signOutButton.id = "sign-out-button";
    signOutButton.className = "sign-out-btn";
    signOutButton.textContent = "Sign Out";

    const userNameSpan = document.createElement("span");
    userNameSpan.textContent = `Welcome, ${localStorage.getItem("userName") || "User"}`;
    userNameSpan.style.marginRight = "10px";
    userNameSpan.style.color = "white";

    signInButtonContainer.appendChild(userNameSpan);
    signInButtonContainer.appendChild(signOutButton);

    signOutButton.addEventListener("click", function () {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCollege");
      window.location.reload();
    });
  }
}

function displayUserInfo() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userCollege = localStorage.getItem("userCollege");

  console.log(
    `User: ${userName}, Email: ${userEmail}, College: ${userCollege}`
  );
}

function checkUserAuthStatus() {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    console.log("User already signed in");
    displaySignOutButton();
    return true;
  }
  return false;
}

function initializeGoogleSignIn() {
  if (!checkUserAuthStatus()) {
     try {
        google.accounts.id.initialize({
        client_id:
          "866863334708-6o7pat7hkajrhve0s50tv1cpks0fnvbu.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        });

        const signInButton = document.getElementById("google-signin-button");
        if (signInButton) {
        google.accounts.id.renderButton(signInButton, {
          theme: "outline",
          size: "large",
        });
        } else {
            console.error("Sign-in button container not found.");
        }
     } catch(error) {
         console.error("Google Sign-In initialization failed:", error);
     }
  }
}

async function loadProductDetails() {
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    console.error("No product ID found in localStorage.");
    showError("Product not found. Please go back and select a product.");
    return;
  }

  try {
    console.log(`Loading product details for ID: ${productId}`);
    const response = await fetch(`${API_BASE_URL}/product/${productId}`);

    if (!response.ok) {
       let errorData;
       try {
           errorData = await response.json();
       } catch(e) {
       }
       const errorMessage = errorData?.message || `Product not found or server error (Status: ${response.status})`;
       throw new Error(errorMessage);
    }

    const productData = await response.json();
    console.log("Product data received:", productData);
    
    // Check if seller information is available
    if (!productData.sellerMobile) {
      console.warn("Seller mobile number is missing from product data");
      
      // If there's an email but no seller mobile, try to fetch user details directly
      if (productData.user_email) {
        try {
          console.log("Attempting to fetch seller details directly:", productData.user_email);
          const userResponse = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(productData.user_email)}`);
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("User data fetched directly:", userData);
            
            if (userData && userData.mobile_number) {
              productData.sellerMobile = userData.mobile_number;
              productData.sellerName = userData.name || "Seller";
              productData.sellerCollege = userData.college;
              console.log("Added seller information to product data:", productData);
            }
          }
        } catch (userError) {
          console.error("Failed to fetch seller details:", userError);
        }
      }
    }
    
    displayProductDetails(productData);

    if (productData.id && productData.category && productData.college) {
      loadSimilarProducts(
        productData.id,
        productData.category,
        productData.college
      );
    } else {
        console.warn("Missing data required for loading similar products (ID, category, or college).");
        document.querySelector(".similar-products").style.display = "none";
    }

  } catch (error) {
    console.error("Error loading product details:", error);
    showError(`Failed to load product details: ${error.message}`);
  }
}

function handleContactSeller(product) {
  // Check if user is signed in
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");
  
  if (!userToken) {
    // User not signed in, show sign-in prompt
    const signInPrompt = document.createElement("div");
    signInPrompt.className = "sign-in-modal";
    signInPrompt.innerHTML = `
      <div class="sign-in-modal-content">
        <span class="close-modal">&times;</span>
        <h2>Sign In Required</h2>
        <p>Please sign in to contact the seller.</p>
        <div id="modal-google-signin-button"></div>
      </div>
    `;
    
    document.body.appendChild(signInPrompt);
    
    // Add styles for the modal
    const style = document.createElement("style");
    style.textContent = `
      .sign-in-modal {
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
      }
      .sign-in-modal-content {
        background-color: white;
        margin: 15% auto;
        padding: 30px;
        border-radius: 8px;
        width: 300px;
        text-align: center;
        position: relative;
      }
      .close-modal {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);
    
    // Initialize Google Sign-In in the modal
    try {
      google.accounts.id.renderButton(
        document.getElementById("modal-google-signin-button"), 
        { theme: "outline", size: "large" }
      );
    } catch (error) {
      console.error("Failed to render Google Sign-In button in modal:", error);
    }
    
    // Add close functionality
    document.querySelector(".close-modal").addEventListener("click", () => {
      document.body.removeChild(signInPrompt);
    });
    
    return;
  }
  
  // Check if seller mobile is available
  if (!product.sellerMobile) {
    console.error("Missing seller mobile number:", product);
    
    // If seller email is available but not mobile, try fetching user info again
    if (product.user_email) {
      alert("Getting seller contact information...");
      
      fetch(`${API_BASE_URL}/user/${encodeURIComponent(product.user_email)}`)
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch seller information");
          return response.json();
        })
        .then(userData => {
          if (userData && userData.mobile_number) {
            // Update product data with seller info
            product.sellerMobile = userData.mobile_number;
            if (!product.sellerName) product.sellerName = userData.name || "Seller";
            
            // Now proceed with WhatsApp
            openWhatsAppChat(product, userName);
          } else {
            alert("Seller contact information is not available. Please try again later.");
          }
        })
        .catch(error => {
          console.error("Error fetching seller details:", error);
          alert("Failed to get seller contact information. Please try again later.");
        });
    } else {
      alert("Seller contact information is not available. Please try again later.");
    }
    return;
  }
  
  // If we have the mobile number, proceed with WhatsApp
  openWhatsAppChat(product, userName);
}

function openWhatsAppChat(product, userName) {
  // Format WhatsApp number (remove any non-digit characters)
  const whatsappNumber = product.sellerMobile.replace(/\D/g, "");
  
  // Create personalized message
  const productUrl = window.location.href;
  const message = encodeURIComponent(
    `Hi${product.sellerName ? ' ' + product.sellerName : ''}! I'm ${userName || 'a user'} from DormDeals. I'm interested in buying your "${product.name}" listed for Rs${product.price}. Is it still available? Product link: ${productUrl}`
  );
  
  // Generate WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, "_blank");
}

function displayProductDetails(product) {
  document.getElementById("product-name").textContent = product.name || "N/A";
  document.getElementById("product-name-breadcrumb").textContent = product.name || "Product";
  document.getElementById("product-price").textContent = product.price !== undefined ? `Rs${product.price}` : "Price not available";
  document.getElementById("product-description").textContent = product.description || "No description available.";
  document.getElementById("product-category").textContent = product.category || "Uncategorized";
  document.getElementById("product-category-tag").textContent = product.category || "Uncategorized";
  document.getElementById("product-college").textContent = product.college || "College not specified";

  // Display seller information if available
  if (product.sellerName) {
    const sellerInfoDiv = document.querySelector(".seller-info");
    sellerInfoDiv.innerHTML = `
      <p>College: <span id="product-college">${product.college || "Not specified"}</span></p>
      <p>Seller: <span id="product-seller">${product.sellerName}</span></p>
    `;
  }

  const mainImageElement = document.getElementById("main-product-image");
  const thumbnailContainer = document.getElementById("thumbnail-container");
  const placeholderImage = "placeholder.jpg";

  mainImageElement.src = placeholderImage;
  mainImageElement.alt = product.name || "Product Image";
  thumbnailContainer.innerHTML = ""; 

  const images = product.images || (product.imageUrl ? [product.imageUrl] : []);

  if (images && images.length > 0) {
    mainImageElement.src = images[0];

    images.forEach((imageUrl, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = imageUrl;
      thumbnail.alt = `${product.name || 'Product'} - Image ${index + 1}`;
      thumbnail.classList.add("thumbnail");
      if (index === 0) thumbnail.classList.add("active");

      thumbnail.addEventListener("click", () => {
        mainImageElement.src = imageUrl;
        document.querySelectorAll(".thumbnail").forEach(thumb => thumb.classList.remove("active"));
        thumbnail.classList.add("active");
      });

      thumbnailContainer.appendChild(thumbnail);
    });
  } else {
     mainImageElement.src = placeholderImage;
  }
  mainImageElement.onerror = function() { this.onerror=null; this.src=placeholderImage; };

  // Store the current product data for use with the contact button
  window.currentProductData = product;

  const contactButton = document.querySelector(".contact-seller-btn");
  if (contactButton) {
      // Update the button text to reflect contacting via WhatsApp
      contactButton.textContent = "Contact Seller via WhatsApp";
      
      // Remove any existing event listeners with clone
      contactButton.replaceWith(contactButton.cloneNode(true));
      
      // Add new event listener with the correct product data
      const newContactButton = document.querySelector(".contact-seller-btn");
      newContactButton.addEventListener("click", () => {
          handleContactSeller(window.currentProductData);
      });
  }
}

async function loadSimilarProducts(currentProductId, category, college) {
  const similarProductsSection = document.querySelector(".similar-products");
  if (!similarProductsSection) return;

  similarProductsSection.style.display = 'block';

  try {
    const response = await fetch(
      `${API_BASE_URL}/products?college=${encodeURIComponent(college)}&category=${encodeURIComponent(category)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();

    const similarProducts = products
      .filter((product) => (product.id || product._id) != currentProductId)
      .slice(0, 4);

    displaySimilarProducts(similarProducts);

  } catch (error) {
    console.error("Error loading similar products:", error);
    similarProductsSection.style.display = "none";
  }
}

function displaySimilarProducts(products) {
  const container = document.getElementById("similar-products-container");
  const similarProductsSection = document.querySelector(".similar-products");

  if (!container || !similarProductsSection) return;

  container.innerHTML = "";

  if (products.length === 0) {
    similarProductsSection.style.display = "none";
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("similar-product-card");

    let imageSrc = "placeholder.jpg";
    if (product.imageUrl) {
        imageSrc = product.imageUrl;
    } else if (product.images && product.images.length > 0) {
        imageSrc = product.images[0];
    } else if (product.image) {
        imageSrc = product.image;
    }

    productCard.innerHTML = `
        <img src="${imageSrc}" alt="${product.name || 'Similar Product'}" class="similar-product-image" onerror="this.onerror=null; this.src='placeholder.jpg';">
        <h3 class="similar-product-title">${product.name || 'Unnamed Product'}</h3>
        <p class="similar-product-price">Rs.${product.price !== undefined ? product.price : 'N/A'}</p>
      `;

    productCard.addEventListener("click", () => {
      const productId = product.id || product._id;
      if (productId) {
          localStorage.setItem("selectedProductId", productId);
          window.location.reload();
      } else {
          console.error("Similar product ID is missing.");
      }
    });

    container.appendChild(productCard);
  });
}

function showError(message) {
  const container = document.querySelector(".product-container");
  if (container) {
      container.innerHTML = `
          <div class="error-message" style="text-align: center; padding: 50px 20px; color: #dc3545;">
            <h2>Oops! Something went wrong.</h2>
            <p>${message}</p>
            <button class="back-btn" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;" onclick="window.location.href='../Product%20Listing/productlisting.html'">
              Back to Products
            </button>
          </div>
        `;
  } else {
      console.error("Error container not found to display message:", message);
      alert(message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGoogleSignIn();
  loadProductDetails();
});