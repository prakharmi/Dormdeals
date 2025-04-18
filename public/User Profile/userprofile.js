const API_BASE_URL = 'https://dormdeals-backend.onrender.com';

let userProducts = [];
let currentAction = null;
let currentProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication status
  if (!checkUserAuthStatus()) {
    // Redirect to login/main page if not authenticated
    window.location.href = "../Main Page/mainpage.html";
    return;
  }

  // Load user info
  loadUserInfo();

  // Load user products
  loadUserProducts();

  // Set up filter tabs
  setupFilterTabs();

  // Set up search functionality
  setupSearch();

  // Set up modal controls
  setupModals();
});

function checkUserAuthStatus() {
  const userToken = localStorage.getItem("userToken");
  const userEmail = localStorage.getItem("userEmail");

  if (userToken && userEmail) {
    displaySignOutButton();
    return true;
  }
  return false;
}

function displaySignOutButton() {
  const signInButtonContainer = document.getElementById("google-signin-button");

  if (signInButtonContainer) {
    signInButtonContainer.innerHTML = "";

    const userNameSpan = document.createElement("span");
    userNameSpan.textContent = `Welcome, ${localStorage.getItem("userName") || "User"}`;
    userNameSpan.style.marginRight = "10px";
    userNameSpan.style.color = "white";

    const signOutButton = document.createElement("button");
    signOutButton.id = "sign-out-button";
    signOutButton.className = "sign-out-btn";
    signOutButton.textContent = "Sign Out";
    signOutButton.style.padding = "8px 16px";
    signOutButton.style.borderRadius = "4px";
    signOutButton.style.backgroundColor = "#f1f5f9";
    signOutButton.style.color = "#334155";
    signOutButton.style.border = "none";
    signOutButton.style.cursor = "pointer";

    signInButtonContainer.appendChild(userNameSpan);
    signInButtonContainer.appendChild(signOutButton);

    signOutButton.addEventListener("click", function() {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCollege");
      window.location.href = "../Main Page/mainpage.html";
    });
  }
}

function loadUserInfo() {
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const userCollege = localStorage.getItem("userCollege");

  document.getElementById("user-name").textContent = userName || "User";
  document.getElementById("user-email").textContent = userEmail || "Email not available";
  document.getElementById("user-college").textContent = userCollege || "College not set";
}

async function loadUserProducts() {
  const userEmail = localStorage.getItem("userEmail");
  const productContainer = document.getElementById("user-products-container");
  
  if (!userEmail) {
    productContainer.innerHTML = `<div class="no-products">Please log in to view your products.</div>`;
    return;
  }
  
  try {
    // In a real implementation, you'd fetch user's products
    // For now we'll simulate this with a GET request
    const response = await fetch(`${API_BASE_URL}/user-products?email=${encodeURIComponent(userEmail)}`);
    
    // If the endpoint doesn't exist, fall back to mocked data
    if (!response.ok) {
      // Mock some products for demonstration
      mockUserProducts();
      return;
    }
    
    const products = await response.json();
    userProducts = products;
    displayUserProducts(products);
    
  } catch (error) {
    console.error("Error loading user products:", error);
    // Fall back to mock data if API call fails
    mockUserProducts();
  }
}

function mockUserProducts() {
  // Mock data for demonstration
  userProducts = [
    {
      id: 1,
      name: "Study Table",
      category: "furniture",
      description: "Sturdy wooden study table, 2 years old but in good condition",
      price: "1200",
      image: "../Product Listing/placeholder.jpg",
      is_sold: false
    },
    {
      id: 2,
      name: "Physics Textbook",
      category: "education",
      description: "HC Verma Physics part 1 and 2, slightly used",
      price: "400",
      image: "../Product Listing/placeholder.jpg",
      is_sold: true
    },
    {
      id: 3,
      name: "Table Fan",
      category: "cooler",
      description: "Usha table fan, 1 year old, works perfectly",
      price: "800",
      image: "../Product Listing/placeholder.jpg",
      is_sold: false
    }
  ];
  
  displayUserProducts(userProducts);
}

function displayUserProducts(products, filter = 'all') {
  const productContainer = document.getElementById("user-products-container");
  productContainer.innerHTML = "";
  
  if (!products || products.length === 0) {
    productContainer.innerHTML = `<div class="no-products">You haven't listed any products yet.</div>`;
    return;
  }
  
  // Filter products based on selected tab
  let filteredProducts = products;
  if (filter === 'available') {
    filteredProducts = products.filter(product => !product.is_sold);
  } else if (filter === 'sold') {
    filteredProducts = products.filter(product => product.is_sold);
  }
  
  if (filteredProducts.length === 0) {
    productContainer.innerHTML = `<div class="no-products">No ${filter} products found.</div>`;
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    if (product.is_sold) {
      productCard.classList.add("sold");
    }
    productCard.dataset.id = product.id;
    
    const statusClass = product.is_sold ? "status-sold" : "status-available";
    const statusText = product.is_sold ? "Sold" : "Available";
    const toggleStatusText = product.is_sold ? "Mark as Available" : "Mark as Sold";
    
    productCard.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image">
      </div>
      <div class="product-details">
        <span class="product-status ${statusClass}">${statusText}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">Rs. ${product.price}</p>
        <div class="product-actions">
          <button class="product-action-btn edit-btn" data-id="${product.id}">Edit</button>
          <button class="product-action-btn delete-btn" data-id="${product.id}">Delete</button>
          <button class="product-action-btn toggle-status-btn" data-id="${product.id}" data-sold="${product.is_sold}">
            ${toggleStatusText}
          </button>
        </div>
      </div>
    `;
    
    productContainer.appendChild(productCard);
  });
  
  // Add event listeners to all action buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', handleEditProduct);
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', handleDeleteProduct);
  });
  
  document.querySelectorAll('.toggle-status-btn').forEach(btn => {
    btn.addEventListener('click', handleToggleStatus);
  });
}

function setupFilterTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Filter products based on the selected tab
      const filter = button.getAttribute('data-filter');
      displayUserProducts(userProducts, filter);
    });
  });
}

function setupSearch() {
  const searchBar = document.querySelector('.search-bar');
  
  searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      // If search is empty, display all products based on current tab filter
      const activeTab = document.querySelector('.tab-button.active').getAttribute('data-filter');
      displayUserProducts(userProducts, activeTab);
      return;
    }
    
    // Filter products by name
    const filteredProducts = userProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm)
    );
    
    // Get current active tab filter
    const activeTab = document.querySelector('.tab-button.active').getAttribute('data-filter');
    
    // Apply both search and tab filter
    let finalFilteredProducts = filteredProducts;
    if (activeTab === 'available') {
      finalFilteredProducts = filteredProducts.filter(product => !product.is_sold);
    } else if (activeTab === 'sold') {
      finalFilteredProducts = filteredProducts.filter(product => product.is_sold);
    }
    
    displayUserProducts(finalFilteredProducts, 'search');
  });
}

function setupModals() {
  // Edit form submit handler
  document.getElementById('edit-product-form').addEventListener('submit', handleEditFormSubmit);
  
  // Close button for edit modal
  document.querySelector('.close-button').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
  });
  
  // Confirmation modal handlers
  document.getElementById('confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-modal').style.display = 'none';
  });
  
  document.getElementById('confirm-proceed').addEventListener('click', () => {
    // Handle different confirmation actions
    if (currentAction === 'delete') {
      deleteProduct(currentProductId);
    } else if (currentAction === 'toggle-status') {
      toggleProductStatus(currentProductId);
    }
    
    document.getElementById('confirm-modal').style.display = 'none';
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    const editModal = document.getElementById('edit-modal');
    const confirmModal = document.getElementById('confirm-modal');
    
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
    
    if (event.target === confirmModal) {
      confirmModal.style.display = 'none';
    }
  });
}

function handleEditProduct(event) {
  const productId = event.currentTarget.getAttribute('data-id');
  const product = userProducts.find(p => p.id == productId);
  
  if (!product) return;
  
  // Populate form fields
  document.getElementById('edit-product-id').value = product.id;
  document.getElementById('edit-product-name').value = product.name;
  document.getElementById('edit-category').value = product.category;
  document.getElementById('edit-description').value = product.description;
  document.getElementById('edit-price').value = product.price;
  
  // Show modal
  document.getElementById('edit-modal').style.display = 'block';
}

function handleDeleteProduct(event) {
  const productId = event.currentTarget.getAttribute('data-id');
  const product = userProducts.find(p => p.id == productId);
  
  if (!product) return;
  
  // Set current action and product ID
  currentAction = 'delete';
  currentProductId = productId;
  
  // Show confirmation modal
  document.getElementById('confirm-message').textContent = 
    `Are you sure you want to delete "${product.name}"?`;
  document.getElementById('confirm-modal').style.display = 'block';
}

function handleToggleStatus(event) {
  const productId = event.currentTarget.getAttribute('data-id');
  const isSold = event.currentTarget.getAttribute('data-sold')
}