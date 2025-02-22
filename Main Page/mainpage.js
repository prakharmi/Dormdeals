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

  const collegeSelect = document.querySelector('#college');
  const seeResultsButton = document.querySelector('button');

  seeResultsButton.addEventListener('click', () => {
      const selectedCollege = collegeSelect.value;

      if (!selectedCollege) {
          alert('Please select a college first!');
          return;
      }

      const collegeUrls = {
          'college1': '/products/iiit-surat.html',
          'college2': '/products/iiit-pune.html',
          'college3': '/products/iiit-bhopal.html',
          'college4': '/products/iiit-nagpur.html',
          'college5': '/products/iiit-vadodara.html'
      };
      window.location.href = collegeUrls[selectedCollege];
    });
};
