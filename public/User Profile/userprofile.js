document.addEventListener("DOMContentLoaded", () => {
  let currentUser = null;
  let userProducts = [];
  let currentProductId = null;
  let currentAction = null;

  const authContainer = document.getElementById("auth-container");
  const grid = document.getElementById("user-products-grid");

  const editModal = document.getElementById("edit-modal");
  const confirmModal = document.getElementById("confirm-modal");
  const editForm = document.getElementById("edit-product-form");

  // --- 1. AUTHENTICATION & INITIAL LOAD ---
  fetch("/api/users/status")
    .then((res) => res.json())
    .then((data) => {
      if (!data.isAuthenticated) {
        alert("You must be logged in to view this page.");
        window.location.href = "/";
        return;
      }
      currentUser = data.user;
      setupProfileHeader(currentUser);
      loadUserProducts();
    });

  function setupProfileHeader(user) {
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("user-college").textContent = user.college;
    document.getElementById("user-email").textContent = user.email;
    document.getElementById("browse-products-btn").href =
      `/products?college=${encodeURIComponent(user.college)}`;
    authContainer.innerHTML = `<a href="/api/users/logout" class="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600">Logout</a>`;
  }

  function loadUserProducts() {
    grid.innerHTML =
      "<p class='col-span-full text-center'>Loading your products...</p>";
    fetch("/api/user-products")
      .then((res) => res.json())
      .then((products) => {
        userProducts = products;
        const activeFilter =
          document.querySelector(".tab-button.active").dataset.filter;
        filterAndDisplayProducts(activeFilter);
      });
  }

  // --- 2. DISPLAY & FILTER LOGIC ---
  function displayProducts(productsToDisplay) {
    grid.innerHTML = "";
    if (productsToDisplay.length === 0) {
      grid.innerHTML =
        "<p class='col-span-full text-center'>No products match this filter.</p>";
      return;
    }
    productsToDisplay.forEach((product) => {
      const card = document.createElement("div");
      card.className =
        "bg-gray-50 dark:bg-slate-800 rounded-lg shadow overflow-hidden flex flex-col";
      card.innerHTML = `
                <a href="/product/${product.id}" class="block h-40 bg-gray-200 dark:bg-slate-700 group">
                    <img src="${product.image || "/assets/images/placeholder.jpg"}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                </a>
                <div class="p-4 flex flex-col flex-grow">
                    <span class="text-xs font-semibold px-2 py-1 rounded-full self-start ${product.is_sold ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}">${product.is_sold ? "Sold" : "Available"}</span>
                    <h3 class="font-bold mt-2 truncate">${product.name}</h3>
                    <p class="text-gray-600 dark:text-gray-300">₹${product.price}</p>
                    <div class="mt-auto pt-4 flex gap-4 text-sm font-medium">
                        <button class="edit-btn text-blue-600 hover:underline" data-id="${product.id}">Edit</button>
                        <button class="delete-btn text-red-600 hover:underline" data-id="${product.id}">Delete</button>
                        <button class="toggle-status-btn text-gray-600 dark:text-gray-400 hover:underline" data-id="${product.id}">${product.is_sold ? "Mark Available" : "Mark Sold"}</button>
                    </div>
                </div>`;
      grid.appendChild(card);
    });
  }

  function filterAndDisplayProducts(filter) {
    let filtered = userProducts;
    if (filter === "available")
      filtered = userProducts.filter((p) => !p.is_sold);
    if (filter === "sold") filtered = userProducts.filter((p) => p.is_sold);
    displayProducts(filtered);
  }

  // --- 3. EVENT LISTENERS ---
  grid.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    const product = userProducts.find((p) => p.id == id);
    if (!product) return;

    currentProductId = id;

    if (e.target.classList.contains("edit-btn")) {
      document.getElementById("edit-product-id").value = product.id;
      document.getElementById("edit-product-name").value = product.name;
      document.getElementById("edit-category").value = product.category;
      document.getElementById("edit-description").value = product.description;
      document.getElementById("edit-price").value = product.price;
      editModal.classList.remove("hidden");
    } else if (e.target.classList.contains("delete-btn")) {
      currentAction = "delete";
      document.getElementById("confirm-message").textContent =
        "Are you sure you want to delete this product? This cannot be undone.";
      confirmModal.classList.remove("hidden");
    } else if (e.target.classList.contains("toggle-status-btn")) {
      currentAction = "toggle-status";
      const newStatus = product.is_sold ? "Available" : "Sold";
      document.getElementById("confirm-message").textContent =
        `Mark this product as ${newStatus}?`;
      confirmModal.classList.remove("hidden");
    }
  });

  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".tab-button.active").classList.remove("active");
      btn.classList.add("active");
      filterAndDisplayProducts(btn.dataset.filter);
    });
  });

  // --- 4. MODAL & FORM HANDLING ---
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editForm);
    const data = Object.fromEntries(formData.entries());

    await fetch(`/api/product/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    editModal.classList.add("hidden");
    loadUserProducts();
  });

  document
    .getElementById("confirm-proceed")
    .addEventListener("click", async () => {
      confirmModal.classList.add("hidden");
      if (currentAction === "delete") {
        await fetch(`/api/product/${currentProductId}`, { method: "DELETE" });
      } else if (currentAction === "toggle-status") {
        const product = userProducts.find((p) => p.id == currentProductId);
        await fetch(`/api/product/${currentProductId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_sold: !product.is_sold }),
        });
      }
      loadUserProducts();
    });

  document
    .querySelectorAll(".close-modal")
    .forEach((btn) =>
      btn.addEventListener("click", () => editModal.classList.add("hidden")),
    );
  document
    .getElementById("confirm-cancel")
    .addEventListener("click", () => confirmModal.classList.add("hidden"));
});
