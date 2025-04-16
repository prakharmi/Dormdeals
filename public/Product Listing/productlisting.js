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
    signOutButton.textContent = "Sign Out";

    const userNameSpan = document.createElement("span");
    userNameSpan.textContent = `Welcome, ${localStorage.getItem("userName") || "User"}`;
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
          console.error("Google Sign-In button container not found.");
        }
    } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGoogleSignIn();
  loadProducts();
  setupFilters();
  setupSearch();

  const redirectButton = document.getElementById("redirect-button");
  if (redirectButton) {
    redirectButton.addEventListener("click", function () {
      const userToken = localStorage.getItem("userToken");

      if (userToken) {
        window.location.href = "../Product%20Details/productdetails.html";
      } else {
        alert("Please login first to continue.");
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
  console.log(`Workspaceing products from: ${fetchUrl}`);

  try {
    const response = await fetch(fetchUrl);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();
    displayProducts(products);

  } catch (error) {
    console.error("Error loading products:", error);
     const productGrid = document.querySelector(".product-grid");
     if(productGrid) {
         productGrid.innerHTML = `<p class="error-message">Could not load products. Please try again later.</p>`;
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
        productGrid.innerHTML = `<p>No products found for your college (${college}).</p>`;
    } else {
        productGrid.innerHTML = `<p>No products found. Please log in and set your college to see relevant items.</p>`;
    }
    return;
  }

  products.forEach((product) => {
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
      <h3 class="product-title">${product.name || 'Unnamed Product'}</h3>
      <p class="product-price">Rs.${product.price !== undefined ? product.price : 'N/A'}</p>
      `;

    productCard.addEventListener("click", function () {
      const productId = product.id || product._id;
      if (productId) {
          localStorage.setItem("selectedProductId", productId);
          window.location.href = "../Product%20Page/productpage.html";
      } else {
          console.error("Product ID is missing, cannot navigate to details page.");
      }
    });

    productGrid.appendChild(productCard);
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
      const messageElement = document.createElement('p');
      messageElement.id = 'no-match-message';
      messageElement.textContent = `No products found in the category: ${category}`;
      productGrid.appendChild(messageElement);
  } else if (productsFound && noMatchMessage) {
      noMatchMessage.remove();
  }

}

function setupSearch() {
  const searchBar = document.querySelector(".search-bar");
  if (!searchBar) return;

  searchBar.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase().trim();
    searchProducts(query);
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
       const messageElement = document.createElement('p');
       messageElement.id = 'no-search-match-message';
       messageElement.textContent = `No products found matching your search: "${query}"`;
       productGrid.appendChild(messageElement);
   } else if (productsFound && noMatchMessage) {
       noMatchMessage.remove();
   } else if (!productsFound && noMatchMessage) {
        noMatchMessage.textContent = `No products found matching your search: "${query}"`;
   }
}