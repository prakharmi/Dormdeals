const API_BASE_URL = 'https://your-render-app-name.onrender.com';

window.onload = function () {
  const email = localStorage.getItem("userEmail");
  const name = localStorage.getItem("userName");

  const nameField = document.getElementById("name");
  if (nameField && name) {
    nameField.value = name;
  }

  let emailField = document.getElementById("email");
  const form = document.getElementById("user-details-form");
  if (!emailField && form) {
    emailField = document.createElement("input");
    emailField.type = "hidden";
    emailField.id = "email";
    emailField.name = "email";
    form.appendChild(emailField);
  }

  if (emailField && email) {
    emailField.value = email;
  } else if (!email) {
      console.error("User email not found in localStorage. Cannot submit form.");
      const submitButton = form ? form.querySelector('button[type="submit"]') : null;
      if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Login Required";
      }
  }
};

document
  .getElementById("user-details-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const collegeInput = document.getElementById("college");
    const mobileInput = document.getElementById("mobile");
    const emailInput = document.getElementById("email");

    if (!nameInput || !collegeInput || !mobileInput || !emailInput) {
        console.error("One or more form fields are missing.");
        alert("An error occurred. Please refresh the page.");
        return;
    }

    const name = nameInput.value.trim();
    const college = collegeInput.value.trim();
    const mobile = mobileInput.value.trim();
    const email = emailInput.value;
    
    if (!name || !college || !mobile || !email) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    if(submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
    }

    fetch(`${API_BASE_URL}/submit-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, college, mobile, email }),
    })
      .then(async (response) => { 
          const responseData = await response.json();
          if (!response.ok) {
              throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
          }
          return responseData;
      })
      .then((data) => {
        console.log("Response from server:", data);
        alert(data.message || "Details submitted successfully!"); 
        localStorage.setItem("userCollege", college);
        localStorage.setItem("userName", name);
        window.location.href = "../Product%20Listing/productlisting.html";
      })
      .catch((error) => {
          console.error("Error submitting form:", error);
          alert(`Error submitting form: ${error.message}`);
          if(submitButton) {
              submitButton.disabled = false;
              submitButton.textContent = 'Submit';
          }
      });
  });