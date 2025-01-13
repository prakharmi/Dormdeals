function handleCredentialResponse(response) {
  console.log("Encoded JWT ID token: " + response.credential);
  
  // Decode the token to get user information (e.g., name, email)
  const payload = JSON.parse(atob(response.credential.split('.')[1]));
  console.log("User Info:", payload);
  alert(`Hello, ${payload.name}!`);
  
  // Redirect to the success page
  window.location.href = "loginsuccess.html"; // Update with the correct path to your success page
}

// Initialize Google Sign-In
window.onload = () => {
  google.accounts.id.initialize({
      client_id: "866863334708-6o7pat7hkajrhve0s50tv1cpks0fnvbu.apps.googleusercontent.com",
      callback: handleCredentialResponse,
  });
  google.accounts.id.renderButton(
      document.getElementById("google-signin-button"), // Element to render the button
      { theme: "outline", size: "large" } // Button customization
  );
  google.accounts.id.prompt(); // Automatically prompt the user
};
