const API_BASE_URL = 'https://your-render-app-name.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("photos");
  const previewContainer = document.getElementById("image-preview");
  const fileLimitMessage = document.getElementById("file-limit-message");
  const productForm = document.getElementById("product-form");

  fileInput.addEventListener("change", function () {
    const files = fileInput.files;
    if (files.length + previewContainer.childElementCount > 10) {
      fileInput.value = "";
      fileLimitMessage.style.display = "block";
      return;
    } else {
      fileLimitMessage.style.display = "none";
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        addImage(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  });

  productForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData(this);

    const college = localStorage.getItem("userCollege");

    if (!college) {
      alert(
        "College information is missing. Please select your college again.",
      );
      return;
    }

    formData.append("college", college);

    try {
      const response = await fetch(`${API_BASE_URL}/submit-product`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        productForm.reset();
        previewContainer.innerHTML = "";
        window.location.href = "../Product%20Listing/productlisting.html";
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("An error occurred. Please try again.");
    }
  });
});

function addImage(src) {
  const previewContainer = document.getElementById("image-preview");

  if (previewContainer.childElementCount >= 10) {
    alert("Maximum of 10 images allowed.");
    return;
  }

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("image-wrapper");

  const img = document.createElement("img");
  img.src = src;
  img.classList.add("preview-image");
  img.style.width = "100px";
  img.style.margin = "5px";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.style.backgroundColor = "#ff4d4d";
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = () => {
    imageWrapper.remove();
    document.getElementById("file-limit-message").style.display = "none";
  };

  imageWrapper.appendChild(img);
  imageWrapper.appendChild(deleteButton);
  previewContainer.appendChild(imageWrapper);
}

function validateForm() {
  const productName = document.getElementById("productName").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const imagePreview =
    document.getElementById("image-preview").childElementCount;

  if (
    !productName ||
    !category ||
    !description ||
    !price ||
    imagePreview === 0
  ) {
    alert("Please fill in all required fields and upload at least one image.");
    return false;
  }
  return true;
}
