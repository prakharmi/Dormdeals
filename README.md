# <img src="https://via.placeholder.com/50x50.png?text=DD" alt="Dorm Deals Logo" width="50" height="50" /> Dorm Deals

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/YOUR_USERNAME/YOUR_REPONAME/actions) [![Contributors](https://img.shields.io/github/contributors/YOUR_USERNAME/YOUR_REPONAME)](https://github.com/YOUR_USERNAME/YOUR_REPONAME/graphs/contributors) Dorm Deals is an online platform designed for college students to buy and sell used items, promoting sustainable consumption and reducing environmental waste within campus communities. This initiative aims to extend the lifecycle of products and foster a culture of sharing and trust, specifically tailored for the needs of students.

##  Table of Contents

- [About The Project](#about-the-project)
  - [Problem Solved](#problem-solved)
  - [Target Audience](#target-audience)
- [ Key Features](#-key-features)
- [ Tech Stack](#️-tech-stack)
- [ System Architecture](#️-system-architecture)
- [ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
- [ Running the Application](#-running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [ Deployment](#️-deployment)
- [ Third-Party Integrations](#-third-party-integrations)
- [ Future Scope](#-future-scope)
- [ Contributing](#-contributing)
- [ License](#-license)


##  About The Project

College campuses often see a cycle of waste where graduating seniors discard usable items like furniture, books, and electronics, simply because there isn't a convenient or trusted way to pass them on. Simultaneously, new and existing students face the financial burden of purchasing these essentials new. "Dorm Deals" addresses this gap by providing a dedicated, secure, and user-friendly online marketplace.

### Problem Solved
-   **Reduces Environmental Waste:** By facilitating the resale of used goods, Dorm Deals extends product lifecycles and minimizes the amount of functional items ending up in landfills.
-   **Financial Savings for Students:** Offers an affordable way for students to acquire necessary items and a platform for sellers to recoup some of their initial investment.
-   **Builds a Trusted Community:** Focuses on college communities, leveraging college email verification (via Google OAuth) to create a more secure and trustworthy environment compared to general marketplaces.
-   **Convenience:** Provides a localized platform tailored to student needs, making it easier to exchange goods within the campus or between nearby colleges.

### Target Audience
-   College and university students.

## Key Features

-   **Secure User Authentication:** Google OAuth integration, restricted to college email domains for enhanced trust and security.
-   **Product Listings:** Users can easily list items for sale with descriptions, pricing, and multiple images.
-   **Product Management:** Sellers can edit or remove their listings.
-   **Categorized Browsing:** Items are organized into categories (e.g., Electronics, Furniture, Books) for easy navigation.
-   **College-Specific Filtering:** Users can filter listings based on their college, ensuring relevance.
-   **Direct Communication:** WhatsApp integration allows seamless communication between buyers and sellers via deep linking.
-   **Responsive Design:** Accessible and user-friendly experience across various devices (desktops, tablets, and mobiles).
-   **Image Uploads:** Utilizes Cloudinary for efficient image storage and management.

## Tech Stack

-   **Frontend:** HTML5, CSS3, JavaScript
-   **Backend:** Node.js, Express.js
-   **Database:** MySQL
-   **Image Management:** Cloudinary API
-   **Authentication:** Google OAuth
-   **Deployment:**
    -   Frontend & Backend: Render
    -   Database: Clever Cloud

## System Architecture

The project follows the **Model-View-Controller (MVC)** architectural pattern:
-   **Model:** Manages the data, business logic, and interactions with the MySQL database. This includes schemas for Users, Products, Colleges, and Categories.
-   **View:** Represents the UI, built with HTML, CSS, and JavaScript, responsible for displaying data to the user.
-   **Controller:** Handles incoming requests from the client, processes them using the Model, and selects the appropriate View to render. Implemented using Express.js routes.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your system:
-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)
-   A MySQL server instance (e.g., local installation, Docker, or a cloud service for testing).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPONAME.git](https://github.com/YOUR_USERNAME/YOUR_REPONAME.git)
    cd YOUR_REPONAME
    ```

2.  **Set up the Backend:**
    ```sh
    cd backend
    npm install
    ```

3.  **Set up the Frontend:**
    The frontend consists of HTML, CSS, and JavaScript files. No specific build step is typically required.
    ```sh
    cd ../frontend
    # If you have frontend-specific npm packages (e.g., for a dev server or linters), you might run:
    # npm install
    ```

### Database Setup

1.  Ensure your MySQL server is running.
2.  Connect to your MySQL instance and create a database for the project:
    ```sql
    CREATE DATABASE dorm_deals_db; -- Or your preferred database name
    ```
3.  **Database Schema:** The project uses tables for `Users`, `Products`, `Colleges`, and `Categories`.
    * You will need to create these tables. It's highly recommended to include a `schema.sql` file in your repository (e.g., under `backend/db/schema.sql`) and instruct users on how to run it.
    * *Example command to run a schema file: `mysql -u youruser -p dorm_deals_db < backend/db/schema.sql`*

### Environment Variables

The backend requires certain environment variables to function correctly.

1.  In the `backend` directory, create a `.env` file:
    ```sh
    touch .env
    ```
2.  Add the following environment variables to your `backend/.env` file, replacing placeholder values with your actual credentials and configuration:

    ```env
    # Server Configuration
    PORT=3001 # Port for the backend server

    # Database Configuration (MySQL)
    DB_HOST=localhost # Or your Clever Cloud MySQL host if testing against it
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=dorm_deals_db # The database name you created
    DB_PORT=3306 # Default MySQL port

    # Google OAuth Configuration
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
    GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback # Adjust if your backend runs on a different port or path

    # Cloudinary Configuration (for Image Uploads)
    CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

    # Session Management
    SESSION_SECRET=aVeryStrongSecretKeyForSessions!ChangeMePlease

    # Frontend URL (for CORS, redirects, etc.)
    FRONTEND_URL=http://localhost:5500 # Or the port your frontend runs on (e.g., if using Live Server) or the file:/// path to your frontend/index.html
    ```

    **Important:**
    -   Obtain Google OAuth credentials from the [Google Cloud Console](https://console.cloud.google.com/).
    -   Obtain Cloudinary credentials from your [Cloudinary Dashboard](https://cloudinary.com/console).
    -   Ensure the `GOOGLE_CALLBACK_URL` is correctly registered as an authorized redirect URI in your Google OAuth client settings.

## Running the Application

### Backend

1.  Navigate to the backend directory:
    ```sh
    cd backend
    ```
2.  Start the backend server:
    ```sh
    npm start
    ```
    (Or `nodemon server.js` if you have nodemon configured for development).
    The backend server should now be running, typically on `http://localhost:3001` (or the `PORT` specified in your `.env`).

### Frontend

1.  Navigate to the frontend directory (if not already there):
    ```sh
    cd ../frontend # Or cd frontend from the root directory
    ```
2.  Open the `index.html` file in your preferred web browser.
    -   You can often do this by right-clicking the file and selecting "Open with..." or by dragging it into a browser window.
    -   Alternatively, use a live server extension if you have one in your code editor (e.g., "Live Server" in VS Code, which often runs on `http://localhost:5500` or a similar port).

Ensure your backend is running before you try to use features on the frontend that interact with the API (e.g., login, fetching products).

## Deployment

The application is deployed using the following services:

-   **Frontend & Backend:** [Render](https://render.com/) - A unified cloud to build and run all your apps and websites.
-   **Database (MySQL):** [Clever Cloud](https://www.clever-cloud.com/) - Provides managed MySQL databases.
-   **Image Storage:** [Cloudinary](https://cloudinary.com/) - Manages image uploads, storage, and delivery.

Refer to the documentation of these services for specific deployment steps. You will need to configure environment variables on Render similar to your local `.env` file, ensuring database credentials point to your Clever Cloud instance.

## Third-Party Integrations

-   **Google OAuth:** For secure user authentication using Google accounts.
-   **Cloudinary:** For robust image hosting and management.
-   **WhatsApp:** Integrated via deep links to facilitate direct communication between buyers and sellers.

## Future Scope

The project has potential for further enhancements:

-   **Priority Listing Feature:** Allow users to pay a small fee to "boost" their product to the top of search results or category pages.
-   **AI-Based Recommendation Engine:** Develop a system to provide personalized product suggestions to users based on their browsing history and preferences.
-   **Native Mobile Applications:** Create dedicated iOS and Android apps for an enhanced mobile user experience.
-   **Integrated Analytics Dashboard:** Implement a dashboard for administrators to monitor platform usage, popular items, user activity, and overall performance.
-   **Advanced Search and Filtering:** More granular filtering options (e.g., by condition, price range within a college).
-   **User Rating and Review System:** Allow buyers and sellers to rate each other to build more trust within the community.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

## License

```text
MIT License

Copyright (c) [Year] [Dorm Deals]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
