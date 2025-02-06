document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("fetchImageButton")
    .addEventListener("click", function () {
      const imageUrl = document.getElementById("imageURL").value;
      if (imageUrl) {
        addImage(imageUrl);
      } else {
        alert("Please enter a valid image URL.");
      }
    });

  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    if (validateForm()) {
      alert("Product added successfully!");
      this.submit();
    }
  });
});

// Function to Preview Uploaded Images
function previewImages() {
  const fileInput = document.getElementById("photos");
  const previewContainer = document.getElementById("imagePreview");
  const files = fileInput.files;

  if (files.length + previewContainer.childElementCount > 10) {
    alert("You can only upload a maximum of 10 images.");
    fileInput.value = ""; // Clear the input
    return;
  }

  Array.from(files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      addImage(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}

// Function to Add Image to Preview with Delete Option
function addImage(src) {
  const previewContainer = document.getElementById("imagePreview");

  if (previewContainer.childElementCount >= 10) {
    alert("Maximum of 10 images allowed.");
    return;
  }

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("image-wrapper");

  const img = document.createElement("img");
  img.src = src;
  img.classList.add("preview-image");

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = () => imageWrapper.remove();

  imageWrapper.appendChild(img);
  imageWrapper.appendChild(deleteButton);
  previewContainer.appendChild(imageWrapper);
}

// Function to Validate Form Before Submission
function validateForm() {
  const productName = document.getElementById("productName").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();
  const details = document.getElementById("details").value.trim();
  const price = document.getElementById("price").value.trim();
  const imagePreview =
    document.getElementById("imagePreview").childElementCount;

  if (
    !productName ||
    !category ||
    !description ||
    !details ||
    !price ||
    imagePreview === 0
  ) {
    alert("Please fill in all required fields and upload at least one image.");
    return false;
  }
  return true;
}
