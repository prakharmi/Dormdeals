const API_BASE_URL = 'https://dormdeals-backend.onrender.com';

function handleCredentialResponse(response) {
  const payload = JSON.parse(atob(response.credential.split(".")[1]));
  localStorage.setItem("userToken", response.credential);
  localStorage.setItem("userEmail", payload.email);
  localStorage.setItem("userName", payload.name);
  localStorage.setItem("userPicture", payload.picture);
  
  fetch(`${API_BASE_URL}/check-user/${encodeURIComponent(payload.email)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.exists) {
        localStorage.setItem("userCollege", data.user.college);
        window.location.reload();
      } else {
        window.location.href = "../User%20Info/userinfo.html";
      }
    });
}

function displaySignOutButton() {
    const signInButtonContainer = document.getElementById("google-signin-button");
    const profileButton = document.getElementById('profile-button');
    if (signInButtonContainer) signInButtonContainer.style.display = 'none';
    if (profileButton) {
        profileButton.classList.remove('hidden');
        const userPicture = localStorage.getItem('userPicture') || 'https://placehold.co/40x40/E2E8F0/4A5568?text=U';
        profileButton.innerHTML = `
            <div class="relative">
                <button id="profile-menu-button" type="button" class="flex items-center rounded-full focus:outline-none"><img class="h-8 w-8 rounded-full object-cover" src="${userPicture}" alt="User profile"></button>
                <div id="profile-menu" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 py-1 z-20">
                    <a href="../User Profile/userprofile.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">My Profile</a>
                    <a href="#" id="logout-btn" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">Logout</a>
                </div>
            </div>
        `;
        const profileMenuButton = document.getElementById('profile-menu-button');
        const profileMenu = document.getElementById('profile-menu');
        if (profileMenuButton) {
            profileMenuButton.addEventListener('click', (e) => { e.stopPropagation(); profileMenu.classList.toggle('hidden'); });
        }
        const logoutBtn = document.getElementById('logout-btn');
        if(logoutBtn) {
            logoutBtn.addEventListener('click', (e) => { e.preventDefault(); localStorage.clear(); window.location.href = '../Main Page/mainpage.html'; });
        }
    }
}

function checkUserAuthStatus() {
  const userToken = localStorage.getItem("userToken");
  if (userToken) {
    displaySignOutButton();
    return true;
  }
  return false;
}

function initializeGoogleSignIn() {
  if (checkUserAuthStatus()) return;
  if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
    setTimeout(initializeGoogleSignIn, 100);
    return;
  }
  google.accounts.id.initialize({
    client_id: "866863334708-6o7pat7hkajrhve0s50tv1cpks0fnvbu.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });
  const signInButton = document.getElementById("google-signin-button");
  if (signInButton) {
    google.accounts.id.renderButton(signInButton, { theme: "outline", size: "large" });
  }
}

async function loadProducts() {
  const college = localStorage.getItem("userCollege");
  const collegeHeading = document.getElementById('college-name-heading');
  if (college && collegeHeading) {
      collegeHeading.textContent = `Deals in ${college}`;
  }
  let fetchUrl = `${API_BASE_URL}/products`;
  if (college) {
    fetchUrl += `?college=${encodeURIComponent(college)}`;
  }
  
  const productGrid = document.querySelector(".product-grid");
  productGrid.innerHTML = `<p class="col-span-full text-center p-8">Loading products...</p>`;

  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error loading products:", error);
    productGrid.innerHTML = `<p class="col-span-full text-center p-8 text-red-500">Could not load products.</p>`;
  }
}

function displayProducts(products) {
  const productGrid = document.querySelector(".product-grid");
  productGrid.innerHTML = "";

  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p class="col-span-full text-center p-8 text-gray-500">No products found.</p>`;
    return;
  }

  products.forEach((product) => {
    if (!product.is_sold) {
      const placeholderImage = "https://placehold.co/400x300/E2E8F0/4A5568?text=No+Image";
      const imageSrc = product.imageUrl || product.image || placeholderImage;
      const productId = product.id || product._id;

      const productCard = document.createElement("div");
      productCard.className = "product-card bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer";
      productCard.dataset.category = product.category ? product.category.toLowerCase() : "other";

      productCard.innerHTML = `
          <div class="w-full h-48 bg-gray-200 dark:bg-slate-700 overflow-hidden">
              <img src="${imageSrc}" alt="${product.name}" class="product-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='${placeholderImage}';">
          </div>
          <div class="product-info p-4 flex flex-col h-32">
              <h3 class="product-title text-md font-semibold text-gray-900 dark:text-white truncate" title="${product.name}">${product.name || 'Unnamed Product'}</h3>
              <p class="product-price text-lg font-bold text-blue-600 dark:text-blue-400 mt-auto">₹${product.price !== undefined ? product.price.toLocaleString('en-IN') : 'N/A'}</p>
          </div>
      `;
      
      productCard.addEventListener("click", function () {
        if (productId) {
          localStorage.setItem("selectedProductId", productId);
          window.location.href = "../Product Page/productpage.html";
        }
      });

      productGrid.appendChild(productCard);
    }
  });
}

function setupFilters() {
  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const category = categoryFilter.value.toLowerCase().trim();
      filterProducts(category);
    });
  }
}

function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    const matchesCategory = category === "all products" || product.dataset.category === category;
    if (matchesCategory) {
      product.classList.remove('hidden');
    } else {
      product.classList.add('hidden');
    }
  });
}

function setupSearch() {
  const searchBar = document.querySelector(".search-bar");
  if (!searchBar) return;
  
  let searchTimeout;
  searchBar.addEventListener("input", (event) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = event.target.value.toLowerCase().trim();
      searchProducts(query);
    }, 300);
  });
}

function searchProducts(query) {
  const products = document.querySelectorAll(".product-card");
  products.forEach((product) => {
    const title = product.querySelector(".product-title").textContent.toLowerCase();
    if (title.includes(query)) {
      product.classList.remove('hidden');
    } else {
      product.classList.add('hidden');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeGoogleSignIn();
  loadProducts();
  setupFilters();
  setupSearch();
  
  const redirectButton = document.getElementById("redirect-button");
  if (redirectButton) {
    redirectButton.addEventListener("click", function () {
      if (localStorage.getItem("userToken")) {
        window.location.href = "../Product Details/productdetails.html";
      } else {
        alert("Please login first to add a product.");
      }
    });
  }
});