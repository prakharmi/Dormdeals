document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (error) {
    alert(error); // Display the error message from the URL in an alert
    // Clean the URL to remove the error message
    window.history.replaceState({}, document.title, "/");
  }
  const authContainer = document.getElementById("auth-container");
  const seeResultsButton = document.getElementById("see-results-btn");
  const collegeSelect = document.getElementById("college");

  // 1. Check user's login status from our backend
  fetch("/api/users/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.isAuthenticated) {
        // If user is logged in, show a profile button and a logout link
        authContainer.innerHTML = `
          <div class="relative">
            <button id="profile-menu-button" type="button" class="flex items-center rounded-full focus:outline-none">
              <img class="h-8 w-8 rounded-full object-cover" src="${data.user.picture}" alt="User profile">
            </button>
            <div id="profile-menu" class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 py-1 z-20">
              <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">My Profile</a>
              <a href="/api/users/logout" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">Logout</a>
            </div>
          </div>
        `;

        // Add event listener for the new profile menu
        const profileMenuButton = document.getElementById(
          "profile-menu-button",
        );
        const profileMenu = document.getElementById("profile-menu");
        if (profileMenuButton) {
          profileMenuButton.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("hidden");
          });
          window.addEventListener("click", () =>
            profileMenu.classList.add("hidden"),
          );
        }
      } else {
        // If user is not logged in, show a Google Sign-In button
        authContainer.innerHTML = `
          <a href="/api/auth/google" class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 dark:bg-blue-600 dark:hover:bg-blue-700">
            Login with Google
          </a>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching auth status:", error);
      authContainer.innerHTML = `<p class="text-sm text-red-500">Session Error</p>`;
    });

  // 2. Handle the "See Results" button click
  if (seeResultsButton) {
    seeResultsButton.addEventListener("click", () => {
      const selectedCollege = collegeSelect.value;
      if (!selectedCollege) {
        alert("Please select a college first!");
        return;
      }
      // Navigate to the products page using a URL query parameter
      window.location.href = `/products?college=${encodeURIComponent(
        selectedCollege,
      )}`;
    });
  }
});
