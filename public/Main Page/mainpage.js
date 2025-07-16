function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  const payload = JSON.parse(atob(response.credential.split(".")[1]));
  console.log("User Info:", payload);

  localStorage.setItem("userToken", response.credential);
  localStorage.setItem("userEmail", payload.email);
  localStorage.setItem("userName", payload.name);

  // Check if user exists in database
  const API_BASE_URL = 'https://dormdeals-backend.onrender.com';

  fetch(`${API_BASE_URL}/check-user/${encodeURIComponent(payload.email)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.exists) {
        localStorage.setItem("userCollege", data.user.college);
        window.location.href = "../Product%20Listing/productlisting.html";
      } else {
        window.location.href = "../User%20Info/userinfo.html";
      }
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      window.location.href = "../User%20Info/userinfo.html";
    });
}

function checkUserAuthStatus() {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    window.location.href = "../Product%20Listing/productlisting.html";
  }

  return false;
}

function initializeGoogleSignIn() {
  if (checkUserAuthStatus()) {
    return; // Stop if the user is already logged in and redirected
  }

  // A check to ensure the google library is loaded before trying to use it
  if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
      console.log("Google library not loaded yet, retrying...");
      setTimeout(initializeGoogleSignIn, 100);
      return;
  }

  google.accounts.id.initialize({
    client_id:
      "866863334708-6o7pat7hkajrhve0s50tv1cpks0fnvbu.apps.googleusercontent.com",
    callback: handleCredentialResponse,
  });

  const signInButton = document.getElementById("google-signin-button");
  if (signInButton) {
    google.accounts.id.renderButton(signInButton, {
      theme: "outline",
      size: "large",
    });
  }
}

window.onload = () => {
  initializeGoogleSignIn();
  
  const collegeSelect = document.querySelector("#college");
  
  const seeResultsButton = document.querySelector("#see-results-btn");

  if (seeResultsButton) {
      seeResultsButton.addEventListener("click", () => {
        const selectedCollege = collegeSelect.value;

        if (!selectedCollege) {
          alert("Please select a college first!");
          return;
        }

        localStorage.setItem("userCollege", selectedCollege);
        window.location.href = `../Product Listing/productlisting.html?college=${encodeURIComponent(selectedCollege)}`;
      });
  }
};