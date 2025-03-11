function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);

  const payload = JSON.parse(atob(response.credential.split(".")[1]));
  console.log("User Info:", payload);

  localStorage.setItem("userToken", response.credential);
  localStorage.setItem("userEmail", payload.email);
  localStorage.setItem("userName", payload.name);

  fetch(`/check-user/${encodeURIComponent(payload.email)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.exists) {
        window.location.href =
          "../Product%20Listing/productlisting.html";
      } else {
        window.location.href =
          "../User%20Info/userinfo.html";
      }
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      window.location.href = "../User%20Info/userinfo.html";
    });
}

function displaySignOutButton() {
  const signInButtonContainer = document.getElementById("google-signin-button");

  if (signInButtonContainer) {
    // Clear the sign-in button container
    signInButtonContainer.innerHTML = "";

    // Create sign-out button in the same container
    const signOutButton = document.createElement("button");
    signOutButton.id = "sign-out-button";
    signOutButton.className = "sign-out-btn";
    signOutButton.textContent = "Sign Out";

    const userNameSpan = document.createElement("span");
    userNameSpan.textContent = `Welcome, ${localStorage.getItem("userName") || "User"}`;
    userNameSpan.style.marginRight = "10px";

    signInButtonContainer.appendChild(userNameSpan);
    signInButtonContainer.appendChild(signOutButton);

    // Add sign out functionality
    signOutButton.addEventListener("click", function () {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      window.location.reload();
    });
  }
}

function checkUserAuthStatus() {
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    console.log("User already signed in");

    displaySignOutButton();

    return true;
  }

  return false;
}

function initializeGoogleSignIn() {
  if (!checkUserAuthStatus()) {
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
}

window.onload = () => {
  initializeGoogleSignIn();
};
