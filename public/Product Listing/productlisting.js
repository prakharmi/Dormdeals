document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("auth-container");
  const productGrid = document.getElementById("product-grid");
  const collegeHeading = document.getElementById("college-name-heading");
  const addProductButton = document.getElementById("add-product-button");

  let isAuthenticated = false;

  // 1. Check user's login status from our backend
  fetch("/api/users/status")
    .then((res) => res.json())
    .then((data) => {
      isAuthenticated = data.isAuthenticated;
      if (data.isAuthenticated) {
        authContainer.innerHTML = `
                    <div class="relative">
                        <button id="profile-menu-button" type="button" class="flex items-center rounded-full focus:outline-none"><img class="h-8 w-8 rounded-full object-cover" src="${data.user.picture}" alt="User profile"></button>
                        <div id="profile-menu" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 py-1 z-20">
                            <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">My Profile</a>
                            <a href="/api/users/logout" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">Logout</a>
                        </div>
                    </div>`;

        const profileMenuButton = document.getElementById(
          "profile-menu-button",
        );
        const profileMenu = document.getElementById("profile-menu");
        if (profileMenuButton) {
          profileMenuButton.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("hidden");
          });
          window.addEventListener("click", () =>
            profileMenu.classList.add("hidden"),
          );
        }
      } else {
        authContainer.innerHTML = `<a href="/api/auth/google" class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">Login</a>`;
      }
    });

  // 2. Load products based on URL query parameter
  const params = new URLSearchParams(window.location.search);
  const college = params.get("college");

  if (!college) {
    collegeHeading.textContent = "No College Selected";
    productGrid.innerHTML = `<p class="col-span-full text-center p-8 text-gray-500">Please select a college from the <a href="/" class="text-blue-500 hover:underline">homepage</a>.</p>`;
    return;
  }

  collegeHeading.textContent = `Deals in ${college}`;
  productGrid.innerHTML = `<p class="col-span-full text-center p-8">Loading products...</p>`;

  fetch(`/api/products?college=${encodeURIComponent(college)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((products) => {
      displayProducts(products);
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      productGrid.innerHTML = `<p class="col-span-full text-center p-8 text-red-500">Could not load products. Please try again later.</p>`;
    });

  // 3. Setup filters and search
  setupFilters();
  setupSearch();

  // 4. Handle "Add Product" button click
  addProductButton.addEventListener("click", (event) => {
    if (!isAuthenticated) {
      event.preventDefault(); // Prevent navigation
      alert("Please log in first to add a product.");
    }
  });
});

function displayProducts(products) {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = "";

  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p class="col-span-full text-center p-8 text-gray-500">No products found for this college yet.</p>`;
    return;
  }

  products.forEach((product) => {
    const placeholderImage = "/assets/images/placeholder.jpg";
    const imageSrc = product.image || placeholderImage;

    const productCard = document.createElement("div");
    productCard.className =
      "product-card bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer";
    productCard.dataset.category = product.category
      ? product.category.toLowerCase()
      : "other";
    productCard.dataset.name = product.name ? product.name.toLowerCase() : "";

    productCard.innerHTML = `
            <div class="w-full h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
                <img src="${imageSrc}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='${placeholderImage}';">
            </div>
            <div class="p-4 flex flex-col h-32">
                <h3 class="text-md font-semibold text-gray-900 dark:text-white truncate" title="${product.name}">${product.name || "Unnamed Product"}</h3>
                <p class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-auto">₹${product.price !== undefined ? product.price.toLocaleString("en-IN") : "N/A"}</p>
            </div>
        `;

    productCard.addEventListener("click", () => {
      window.location.href = `/product/${product.id}`;
    });

    productGrid.appendChild(productCard);
  });
}

function setupFilters() {
  const categoryFilter = document.getElementById("category-filter");
  const productGrid = document.getElementById("product-grid");

  categoryFilter.addEventListener("change", () => {
    const selectedCategory = categoryFilter.value.toLowerCase().trim();
    const products = document.querySelectorAll(".product-card");
    let visibleProducts = 0;

    // Hide or show products based on the selected category
    products.forEach((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.dataset.category === selectedCategory;
      if (matchesCategory) {
        product.style.display = "block";
        visibleProducts++;
      } else {
        product.style.display = "none";
      }
    });

    // Remove any existing "no products" message
    const existingMessage = productGrid.querySelector(".no-products-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // If no products are visible for a specific category, show the message
    if (visibleProducts === 0 && selectedCategory !== "all") {
      const college = new URLSearchParams(window.location.search).get(
        "college",
      );
      const messageElement = document.createElement("p");
      messageElement.className =
        "no-products-message col-span-full text-center p-8 text-gray-500";
      messageElement.textContent = `No products found for this category in ${college || "your college"}.`;
      productGrid.appendChild(messageElement);
    }
  });
}

function setupSearch() {
  document.getElementById("search-bar").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase().trim();
    document.querySelectorAll(".product-card").forEach((card) => {
      const matchesSearch = card.dataset.name.includes(query);
      card.style.display = matchesSearch ? "block" : "none";
    });
  });
}
