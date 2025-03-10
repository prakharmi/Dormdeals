window.onload = function () {
  
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");

  // Create hidden email field if it doesn't exist
  let emailField = document.getElementById("email");
  if (!emailField) {
    emailField = document.createElement("input");
    emailField.type = "hidden";
    emailField.id = "email";
    emailField.name = "email";
    document.getElementById("user-details-form").appendChild(emailField);
  }

  if (email) {
    emailField.value = email;
  }

  if (name) {
    const nameField = document.getElementById("name");
    if (nameField) {
      nameField.value = name;
    }
  }
};

document
  .getElementById("user-details-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const college = document.getElementById("college").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    fetch("http://localhost:5000/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, college, mobile, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        alert(data.message);
        
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        window.location.href =
          "http://127.0.0.1:5500/Product%20Listing/productlisting.html";
      })
      .catch((error) => console.error("Error submitting form:", error));
  });
