document
  .getElementById("user-details-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form is being submitted");

    const name = document.getElementById("name").value;
    const college = document.getElementById("college").value;
    const mobile = document.getElementById("mobile").value;

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    console.log("Sending data:", { name, college, mobile });

    fetch("http://localhost:5000/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, college, mobile }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        alert(data.message);
      })
      .catch((error) => console.error("Error submitting form:", error));
  });
