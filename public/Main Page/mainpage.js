function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  const payload = JSON.parse(atob(response.credential.split(".")[1]));
  console.log("User Info:", payload);

  localStorage.setItem("userToken", response.credential);
  localStorage.setItem("userEmail", payload.email);
  localStorage.setItem("userName", payload.name);

  const API_BASE_URL = 'https://dormdeals-backend.onrender.com';

  fetch(`${API_BASE_URL}/check-user/${encodeURIComponent(payload.email)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.exists) {
        localStorage.setItem("userCollege", data.user.college);
        window.location.href = "../Product Listing/productlisting.html";
      } else {
        window.location.href = "../User Info/userinfo.html";
      }
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      window.location.href = "../User Info/userinfo.html";
    });
}

function checkUserAuthStatus() {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    const userCollege = localStorage.getItem("userCollege");
    if (userCollege) {
      window.location.href = "../Product Listing/productlisting.html";
    } else {
      window.location.href = "../User Info/userinfo.html";
    }
    return true;
  }
  return false;
}

function initializeGoogleSignIn() {
  if (checkUserAuthStatus()) {
    return;
  }
  
  if (typeof google === 'undefined' || typeof google.accounts === 'undefined') {
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
      // Changed to 'medium' for a good balance on all screen sizes
      size: "medium", 
    });
    google.accounts.id.prompt();
  } else {
      // If the user is logged in, show their profile button
      const authContainer = document.getElementById("auth-container");
      if(authContainer) {
          authContainer.innerHTML = `<a href="../User Profile/userprofile.html" class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600">My Profile</a>`;
      }
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