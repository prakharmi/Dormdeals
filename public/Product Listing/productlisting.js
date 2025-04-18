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
        window.location.href = "../Product%20Listing/productlisting.html";
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
    // Clear the sign-in button container
    signInButtonContainer.innerHTML = "";

    // Create sign-out button in the same container
    const signOutButton = document.createElement("button");
    signOutButton.id = "sign-out-button";
    signOutButton.className = "sign-out-btn";
    signOutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';

    const userNameSpan = document.createElement("span");
    const userName = localStorage.getItem("userName") || "User";
    const firstNameOnly = userName.split(' ')[0]; // Only show first name to save space
    userNameSpan.textContent = `${firstNameOnly}`;
    userNameSpan.style.marginRight = "10px";
    userNameSpan.style.color = "white";

    signInButtonContainer.appendChild(userNameSpan);
    signInButtonContainer.appendChild(signOutButton);

    // Add sign out functionality
    signOutButton.addEventListener("click", function () {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCollege");
      window.location.reload();
    });
  }
}

function checkUserAuthStatus() {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    console.log("User already signed in");
    displaySignOutButton();
    return true;
  }
  console.log("User not signed in");
  return false;
}

function initializeGoogleSignIn() {
  if (!checkUserAuthStatus()) {
    try {
      google.accounts.id.initialize({
        client_id: "866863334708-6o7pat7hkajrhve0s50tv1cpks0fnvbu.apps.googleusercontent.com",
        callback: handleCredentialResponse,
      });

      const signInButton = document.getElementById("google-signin-button");
      if (signInButton) {
        google.accounts.id.renderButton(signInButton, {
          theme: "outline",
          size: "large",
        });
      } else {
        console.error("Google Sign-In button container not found.");
      }
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
    }
  }
}

function setupProfileButton() {
  const profileButton = document.getElementById('profile-button');
  if (profileButton) {
    // Show profile button only if user is logged in
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      profileButton.classList.add('hidden');
    } else {
      profileButton.classList.remove('hidden');
    }
    
    // Add click event to navigate to profile page
    profileButton.addEventListener('click', function() {
      window.location.href = "../User Profile/userprofile.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGoogleSignIn();
  loadProducts();
  setupFilters();
  setupSearch();
  setupProfileButton();

  const redirectButton = document.getElementById("redirect-button");
  if (redirectButton) {
    redirectButton.addEventListener("click", function () {
      const userToken = localStorage.getItem("userToken");

      if (userToken) {
        window.location.href = "../Product%20Details/productdetails.html";
      } else {
        // Create a nicer alert with animation
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '10%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        alertDiv.style.color = 'white';
        alertDiv.style.padding = '15px 25px';
        alertDiv.style.borderRadius = '8px';
        alertDiv.style.zIndex = '1000';
        alertDiv.style.opacity = '0';
        alertDiv.style.transition = 'opacity 0.3s ease';
        alertDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please login first to continue.';
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
          alertDiv.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
          alertDiv.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(alertDiv);
          }, 300);
        }, 3000);
      }
    });
  }
});

async function loadProducts() {
  const college = localStorage.getItem("userCollege");
  let fetchUrl = `${API_BASE_URL}/products`;
  if (college) {
    fetchUrl += `?college=${encodeURIComponent(college)}`;
  }
  console.log(`Fetching products from: ${fetchUrl}`);

  // Show loading state
  const productGrid = document.querySelector(".product-grid");
  if (productGrid) {
    productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 0;">
        <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 3px solid rgba(0,0,0,0.1); border-radius: 50%; border-top-color: #4361ee; animation: spin 1s ease-in-out infinite;"></div>
        <p style="margin-top: 15px; color: #666;">Loading products...</p>
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
  }

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    displayProducts(products);

  } catch (error) {
    console.error("Error loading products:", error);
    if (productGrid) {
      productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 0;">
          <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: #dc3545;"></i>
          <p style="margin-top: 15px; color: #666;">Could not load products. Please try again later.</p>
          <button onclick="location.reload()" style="margin-top: 15px; background: #4361ee; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Retry</button>
        </div>
      `;
    }
  }
}

function displayProducts(products) {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) {
    console.error("Product grid container not found");
    return;
  }
  productGrid.innerHTML = "";

  if (!products || products.length === 0) {
    const college = localStorage.getItem("userCollege");
    if (college) {
      productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 0;">
          <i class="fas fa-box-open" style="font-size: 40px; color: #6c757d;"></i>
          <p style="margin-top: 15px; color: #666;">No available products found for your college (${college}).</p>
        </div>
      `;
    } else {
      productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 0;">
          <i class="fas fa-user-circle" style="font-size: 40px; color: #6c757d;"></i>
          <p style="margin-top: 15px; color: #666;">No products found. Please log in and set your college to see relevant items.</p>
        </div>
      `;
    }
    return;
  }

  products.forEach((product) => {
    // Only display products that aren't sold
    if (!product.is_sold) {
      const placeholderImage = "placeholder.jpg";
      const imageSrc = product.imageUrl || product.image || placeholderImage;

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.dataset.category = product.category
        ? product.category.toLowerCase()
        : "uncategorized";
      productCard.dataset.productId = product.id || product._id;

      productCard.innerHTML = `
        <img src="${imageSrc}" alt="${product.name || 'Product Image'}" class="product-image" onerror="this.onerror=null; this.src='${placeholderImage}';">
        <div class="product-info">
          <h3 class="product-title">${product.name || 'Unnamed Product'}</h3>
          <p class="product-price">₹${product.price !== undefined ? product.price.toLocaleString('en-IN') : 'N/A'}</p>
        </div>
      `;

      productCard.addEventListener("click", function () {
        const productId = product.id || product._id;
        if (productId) {
          // Add subtle click effect
          this.style.transform = 'scale(0.98)';
          setTimeout(() => {
            this.style.transform = '';
            localStorage.setItem("selectedProductId", productId);
            window.location.href = "../Product%20Page/productpage.html";
          }, 150);
        } else {
          console.error("Product ID is missing, cannot navigate to details page.");
        }
      });

      productGrid.appendChild(productCard);
    }
  });
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-button");
  
  // Set "All Products" as active by default
  const allProductsButton = document.querySelector(".filter-button:first-child");
  if (allProductsButton) {
    allProductsButton.classList.add('active-filter');
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.textContent.toLowerCase().trim();
      filterProducts(category);

      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active-filter'));
      
      // Add active class to clicked button
      button.classList.add('active-filter');
    });
  });
}

function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");
  let productsFound = false;

  products.forEach((product) => {
    const matchesCategory = category === "all products" || product.dataset.category === category;

    if (matchesCategory) {
      product.classList.remove("hidden");
      productsFound = true;
    } else {
      product.classList.add("hidden");
    }
  });

  const productGrid = document.querySelector(".product-grid");
  const noMatchMessage = document.getElementById("no-match-message");
  
  if (!productsFound && productGrid && !noMatchMessage) {
    const messageElement = document.createElement('div');
    messageElement.id = 'no-match-message';
    messageElement.style.gridColumn = '1/-1';
    messageElement.style.textAlign = 'center';
    messageElement.style.padding = '50px 0';
    messageElement.innerHTML = `
      <i class="fas fa-filter" style="font-size: 40px; color: #6c757d; margin-bottom: 15px;"></i>
      <p style="color: #666;">No products found in the category: <strong>${category}</strong></p>
    `;
    productGrid.appendChild(messageElement);
  } else if (productsFound && noMatchMessage) {
    noMatchMessage.remove();
  }
}

function setupSearch() {
  const searchBar = document.querySelector(".search-bar");
  if (!searchBar) return;

  // Add a small delay to prevent too many searches while typing
  let searchTimeout;
  
  searchBar.addEventListener("input", (event) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = event.target.value.toLowerCase().trim();
      searchProducts(query);
    }, 300); // 300ms delay
  });
}

function searchProducts(query) {
  const products = document.querySelectorAll(".product-card");
  let productsFound = false;

  products.forEach((product) => {
    const titleElement = product.querySelector(".product-title");
    const title = titleElement ? titleElement.textContent.toLowerCase() : "";

    if (title.includes(query)) {
      product.classList.remove("hidden");
      productsFound = true;
    } else {
      product.classList.add("hidden");
    }
  });

  const productGrid = document.querySelector(".product-grid");
  const noMatchMessage = document.getElementById("no-search-match-message");
  
  if (!productsFound && productGrid && !noMatchMessage) {
    const messageElement = document.createElement('div');
    messageElement.id = 'no-search-match-message';
    messageElement.style.gridColumn = '1/-1';
    messageElement.style.textAlign = 'center';
    messageElement.style.padding = '50px 0';
    messageElement.innerHTML = `
      <i class="fas fa-search" style="font-size: 40px; color: #6c757d; margin-bottom: 15px;"></i>
      <p style="color: #666;">No products found matching your search: "<strong>${query}</strong>"</p>
    `;
    productGrid.appendChild(messageElement);
  } else if (productsFound && noMatchMessage) {
    noMatchMessage.remove();
  } else if (!productsFound && noMatchMessage) {
    // Update the existing message with new search term
    noMatchMessage.querySelector('p').innerHTML = `No products found matching your search: "<strong>${query}</strong>"`;
  }
}