function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    console.log("User Info:", payload);
    alert(`Hello, ${payload.name}!`);
    
    window.location.href = "http://127.0.0.1:5500/User%20Info/userinfo.html";
  }
  
  window.onload = () => {
    google.accounts.id.initialize({
        client_id: "866863334708-6o7pat7hkajrhve0s50tv1cpks0fnvbu.apps.googleusercontent.com",
        callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
    );
    google.accounts.id.prompt();
  };