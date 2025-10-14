document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("user-details-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const submitButton = document.getElementById("submit-button");

  // 1. Fetch temporary user data from the server session to pre-fill the form
  fetch("/api/users/new-user-info")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Session expired or invalid.");
      }
      return res.json();
    })
    .then((data) => {
      nameInput.value = data.name || "";
      emailInput.value = data.email || "";
    })
    .catch((error) => {
      console.error("Failed to get new user info:", error);
      alert(
        "Your registration session has expired. Please log in again to continue.",
      );
      // Redirect to homepage to restart the login process
      window.location.href = "/";
    });

  // 2. Handle the form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const collegeInput = document.getElementById("college");
    const mobileInput = document.getElementById("mobile");

    // Basic validation
    if (!/^[0-9]{10}$/.test(mobileInput.value.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!collegeInput.value) {
      alert("Please select your college.");
      return;
    }

    // Disable button to prevent multiple submissions
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    const formData = {
      name: nameInput.value.trim(),
      college: collegeInput.value,
      mobile: mobileInput.value.trim(),
    };

    // 3. Send data to the registration endpoint
    fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(
            responseData.message || `HTTP error! Status: ${response.status}`,
          );
        }
        return responseData;
      })
      .then((data) => {
        alert(data.message || "Registration successful!");
        // Redirect to the page specified by the backend
        window.location.href = data.redirectTo || "/products";
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert(`Registration failed: ${error.message}`);
        // Re-enable button on failure
        submitButton.disabled = false;
        submitButton.textContent = "Submit and Continue";
      });
  });
});
