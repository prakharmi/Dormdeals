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
  if (!college) {
    console.error("No college found in localStorage.");
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/products?college=${encodeURIComponent(college)}`,
    );
    const products = await response.json();

    displayProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function displayProducts(products) {
  const productGrid = document.querySelector(".product-grid");
  productGrid.innerHTML = "";

  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p>No products found for your college.</p>`;
    return;
  }

  products.forEach((product) => {
    const placeholderImage = "placeholder.jpg";
    const imageSrc = product.image || placeholderImage;

    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.dataset.category = product.category
      ? product.category.toLowerCase()
      : "uncategorized";

    productCard.innerHTML = `
      <img src="${imageSrc}" alt="${product.name}" class="product-image" onerror="this.src='${placeholderImage}'">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-price">$${product.price}</p>
    `;

    productCard.addEventListener("click", function () {
      localStorage.setItem("selectedProductId", product.id);
      window.location.href = "../Product%20Page/productpage.html";
    });

    productGrid.appendChild(productCard);
  });
}

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.textContent.toLowerCase();
      filterProducts(category);
    });
  });
}

function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    if (category === "all products" || product.dataset.category === category) {
      product.classList.remove("hidden");
    } else {
      product.classList.add("hidden");
    }
  });
}

function setupSearch() {
  const searchBar = document.querySelector(".search-bar");

  searchBar.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    searchProducts(query);
  });
}

function searchProducts(query) {
  const products = document.querySelectorAll(".product-card");

  products.forEach((product) => {
    const title = product
      .querySelector(".product-title")
      .textContent.toLowerCase();

    if (title.includes(query)) {
      product.classList.remove("hidden");
    } else {
      product.classList.add("hidden");
    }
  });
}
