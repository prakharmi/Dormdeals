function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  const payload = JSON.parse(atob(response.credential.split(".")[1]));
  console.log("User Info:", payload);

  localStorage.setItem("userToken", response.credential);
  localStorage.setItem("userEmail", payload.email);
  localStorage.setItem("userName", payload.name);

  fetch(`http://127.0.0.1:5000/check-user/${encodeURIComponent(payload.email)}`)
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

function displayUserInfo() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userCollege = localStorage.getItem("userCollege");

  console.log(
    `User: ${userName}, Email: ${userEmail}, College: ${userCollege}`,
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
    }
  }
}

async function loadProductDetails() {
  const productId = localStorage.getItem("selectedProductId");

  if (!productId) {
    console.error("No product ID found");
    showError("Product not found.");
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/product/${productId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const productData = await response.json();
    displayProductDetails(productData);

    if (productData.category) {
      loadSimilarProducts(
        productData.id,
        productData.category,
        productData.college,
      );
    }
  } catch (error) {
    console.error("Error loading product details:", error);
    showError("Failed to load product details. Please try again later.");
  }
}

function displayProductDetails(product) {
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-name-breadcrumb").textContent = product.name;
  document.getElementById("product-price").textContent = `$${product.price}`;
  document.getElementById("product-description").textContent =
    product.description;
  document.getElementById("product-category").textContent = product.category;
  document.getElementById("product-category-tag").textContent =
    product.category;
  document.getElementById("product-college").textContent = product.college;

  if (product.images && product.images.length > 0) {
    document.getElementById("main-product-image").src = product.images[0];
    document.getElementById("main-product-image").alt = product.name;

    const thumbnailContainer = document.getElementById("thumbnail-container");
    thumbnailContainer.innerHTML = "";

    product.images.forEach((imageUrl, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = imageUrl;
      thumbnail.alt = `${product.name} - Image ${index + 1}`;
      thumbnail.classList.add("thumbnail");
      if (index === 0) thumbnail.classList.add("active");

      thumbnail.addEventListener("click", () => {
        document.getElementById("main-product-image").src = imageUrl;

        document.querySelectorAll(".thumbnail").forEach((thumb) => {
          thumb.classList.remove("active");
        });
        thumbnail.classList.add("active");
      });

      thumbnailContainer.appendChild(thumbnail);
    });
  } else {
    document.getElementById("main-product-image").src = "placeholder.jpg";
    document.getElementById("main-product-image").alt = product.name;
  }

  const contactButton = document.querySelector(".contact-seller-btn");
  contactButton.addEventListener("click", () => {
    alert(
      `Contact the seller at: ${product.sellerEmail || "No contact information available"}`,
    );
  });
}

async function loadSimilarProducts(currentProductId, category, college) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/products?college=${encodeURIComponent(college)}&category=${encodeURIComponent(category)}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const products = await response.json();

    const similarProducts = products
      .filter((product) => product.id != currentProductId)
      .slice(0, 4);

    displaySimilarProducts(similarProducts);
  } catch (error) {
    console.error("Error loading similar products:", error);
    document.querySelector(".similar-products").style.display = "none";
  }
}

function displaySimilarProducts(products) {
  const container = document.getElementById("similar-products-container");
  container.innerHTML = "";

  if (products.length === 0) {
    document.querySelector(".similar-products").style.display = "none";
    return;
  }

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("similar-product-card");

    const imageSrc = product.image || "placeholder.jpg";

    productCard.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}" class="similar-product-image" onerror="this.src='placeholder.jpg'">
        <h3 class="similar-product-title">${product.name}</h3>
        <p class="similar-product-price">$${product.price}</p>
      `;

    productCard.addEventListener("click", () => {
      localStorage.setItem("selectedProductId", product.id);
      window.location.reload();
    });

    container.appendChild(productCard);
  });
}

function showError(message) {
  const container = document.querySelector(".product-container");
  container.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 50px 20px;">
        <h2>Oops!</h2>
        <p>${message}</p>
        <button class="back-btn" style="margin-top: 20px;" onclick="window.location.href='../Product%20Listing/productlisting.html'">
          Back to Products
        </button>
      </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGoogleSignIn();
  loadProductDetails();
});
