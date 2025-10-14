document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("auth-container");
  const loginModal = document.getElementById("login-modal");
  let isAuthenticated = false;
  let currentUser = null;

  fetch("/api/users/status")
    .then((res) => res.json())
    .then((data) => {
      isAuthenticated = data.isAuthenticated;
      currentUser = data.user;
      if (isAuthenticated) {
        authContainer.innerHTML = `
                    <div class="relative">
                        <button id="profile-menu-button" type="button" class="flex items-center rounded-full focus:outline-none"><img class="h-8 w-8 rounded-full object-cover" src="${currentUser.picture}" alt="User profile"></button>
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
          window.addEventListener("click", () => {
            if (profileMenu && !profileMenu.classList.contains("hidden")) {
              profileMenu.classList.add("hidden");
            }
          });
        }
      } else {
        authContainer.innerHTML = `<a href="/api/auth/google" class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">Login</a>`;
      }
    });

  const pathParts = window.location.pathname.split("/");
  const productId = pathParts[pathParts.length - 1];

  if (!productId) {
    document.querySelector("main").innerHTML =
      `<p class="text-center text-red-500">No product ID found in URL.</p>`;
    return;
  }

  fetch(`/api/product/${productId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    })
    .then((product) => {
      setupEventListeners(product);
      displayProductDetails(product);
      loadSimilarProducts(product.id, product.category, product.college);
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      document.querySelector("main").innerHTML =
        `<div class="text-center p-12"><h2 class="text-2xl font-bold">Product Not Found</h2><p class="text-gray-500">The product you are looking for does not exist or has been removed.</p><a href="/" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Home</a></div>`;
    });

  function setupEventListeners(product) {
    document
      .getElementById("contact-seller-btn")
      .addEventListener("click", () => {
        if (!isAuthenticated) {
          loginModal.classList.remove("hidden");
        } else if (product && product.sellerMobile) {
          const whatsappNumber =
            "91" + product.sellerMobile.replace(/\D/g, "").slice(-10);
          const message = `Hi ${product.sellerName}!\n\nI'm ${currentUser.name} from DormDeals and I'm interested in your product: "${product.name}".\n\nProduct Link: ${window.location.href}\n\nIs it still available?`;
          window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
            "_blank",
          );
        } else {
          alert("Seller contact information is not available.");
        }
      });

    document
      .getElementById("back-to-products-btn")
      .addEventListener("click", () => {
        history.length > 2
          ? history.back()
          : (window.location.href = `/products?college=${encodeURIComponent(product.college)}`);
      });

    document.getElementById("close-modal-btn").addEventListener("click", () => {
      loginModal.classList.add("hidden");
    });
  }
});

function displayProductDetails(product) {
  document.title = `${product.name} - Dorm Deals`;

  document.getElementById("product-name").textContent = product.name;
  document.getElementById("product-category-tag").textContent =
    product.category;
  document.getElementById("product-price").textContent =
    `₹${product.price.toLocaleString("en-IN")}`;
  document.getElementById("product-college").textContent = product.college;
  document.getElementById("product-seller").textContent =
    product.sellerName || "N/A";
  document.getElementById("product-description").textContent =
    product.description;

  const mainImage = document.getElementById("main-product-image");
  const thumbnailContainer = document.getElementById("thumbnail-container");
  const placeholder = "/assets/images/placeholder.jpg";
  mainImage.src = product.images?.[0] || placeholder;
  mainImage.onerror = () => {
    mainImage.src = placeholder;
  };

  thumbnailContainer.innerHTML = "";
  if (product.images && product.images.length > 0) {
    product.images.forEach((imgUrl) => {
      const thumb = document.createElement("img");
      thumb.src = imgUrl;
      thumb.className =
        "w-16 h-16 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-blue-500";
      thumb.onclick = () => {
        mainImage.src = imgUrl;
      };
      thumbnailContainer.appendChild(thumb);
    });
  }
}

function loadSimilarProducts(currentId, category, college) {
  fetch(
    `/api/products?college=${encodeURIComponent(college)}&category=${encodeURIComponent(category)}`,
  )
    .then((res) => res.json())
    .then((products) => {
      const similarProducts = products
        .filter((p) => p.id !== currentId)
        .slice(0, 4);
      const grid = document.getElementById("similar-products-grid");
      const section = document.getElementById("similar-products-section");
      grid.innerHTML = "";

      if (similarProducts.length === 0) {
        section.style.display = "none";
        return;
      }

      section.style.display = "block";
      similarProducts.forEach((product) => {
        const placeholder = "/assets/images/placeholder.jpg";
        const imageSrc = product.image || placeholder;
        const card = document.createElement("a");
        card.href = `/product/${product.id}`;
        card.className =
          "block bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden group";
        card.innerHTML = `
                    <div class="h-40 bg-gray-200 dark:bg-slate-700 overflow-hidden">
                        <img src="${imageSrc}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.onerror=null; this.src='${placeholder}';">
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-900 dark:text-white truncate">${product.name}</h3>
                        <p class="text-blue-600 dark:text-blue-400 font-bold">₹${product.price.toLocaleString("en-IN")}</p>
                    </div>`;
        grid.appendChild(card);
      });
    });
}
