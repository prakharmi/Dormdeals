document.getElementById("user-details-form").addEventListener("submit", function (event) {
    event.preventDefault();    
    const name = document.getElementById("name").value;
    const college = document.getElementById("college").value;
    const mobile = document.getElementById("mobile").value;

    if (!/^[0-9]{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }
    console.log("Name:", name);
    console.log("College:", college);
    console.log("Mobile:", mobile);
    alert("Form submitted successfully!");
    document.getElementById("user-details-form").reset();
});
