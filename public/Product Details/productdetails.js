document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  const fileInput = document.getElementById("photos");
  const previewContainer = document.getElementById("image-preview");
  const fileLimitMessage = document.getElementById("file-limit-message");
  const submitButton = document.getElementById("submit-button");
  const authContainer = document.getElementById("auth-container");

  let userCollege = null;

  // 1. Check user authentication status and get their college
  fetch("/api/users/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.isAuthenticated) {
        userCollege = data.user.college;
        authContainer.innerHTML = `
          <a href="/profile" class="flex items-center rounded-full">
            <img class="h-8 w-8 rounded-full object-cover" src="${data.user.picture}" alt="User profile">
          </a>
        `;
      } else {
        alert("You must be logged in to add a product.");
        window.location.href = "/";
      }
    })
    .catch((error) => {
      console.error("Authentication check failed:", error);
      alert("Session error. Please try logging in again.");
      window.location.href = "/";
    });

  // 2. Handle image previews
  fileInput.addEventListener("change", () => {
    previewContainer.innerHTML = "";
    const files = Array.from(fileInput.files);
    if (files.length > 10) {
      fileLimitMessage.style.display = "block";
      fileInput.value = "";
      return;
    }
    fileLimitMessage.style.display = "none";
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.className = "w-full h-20 object-cover rounded-md";
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });

  // 3. Handle form submission
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    const formData = new FormData(productForm);

    try {
      const response = await fetch("/api/submit-product", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        if (userCollege) {
          window.location.href = `/products?college=${encodeURIComponent(userCollege)}`;
        } else {
          window.location.href = "/products"; // Fallback just in case
        }
      } else {
        throw new Error(result.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert(`Error: ${error.message}`);
      submitButton.disabled = false;
      submitButton.textContent = "Add Product";
    }
  });
});
