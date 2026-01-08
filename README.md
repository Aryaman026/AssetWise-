# AssetWise

AssetWise is a full-stack web application designed for asset management. It provides a user-friendly interface to track and manage your assets effectively.

---

## Features

* **Asset Tracking:** Keep a detailed record of all your assets.
* **Warranty Management:** Store and manage warranty information for your assets.
* **User-friendly Interface:** A clean and intuitive UI for easy navigation and management.

---

## Tech Stack

### Frontend

* **React:** A JavaScript library for building user interfaces.
* **Vite:** A fast build tool and development server for modern web projects.
* **Axios:** A promise-based HTTP client for making API requests.
* **React Router:** For declarative routing in your React application.

### Backend

* **Node.js:** A JavaScript runtime environment.
* **Express:** A minimal and flexible Node.js web application framework.
* **MySQL2:** A MySQL client for Node.js with a focus on performance.
* **CORS:** A package for providing a Connect/Express middleware that can be used to enable CORS with various options.
* **Dotenv:** A zero-dependency module that loads environment variables from a `.env` file into `process.env`.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm installed on your machine.
* A running instance of a MySQL database.

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your_username/AssetWise.git](https://github.com/your_username/AssetWise.git)
    ```
2.  **Install backend dependencies**
    ```sh
    cd server
    npm install
    ```
3.  **Install frontend dependencies**
    ```sh
    cd ../client
    npm install
    ```
4.  **Set up environment variables**
    Create a `.env` file in the `server` directory and add your database credentials:
    ```
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    ```

---

## Available Scripts

### Client

In the `client` directory, you can run:

* `npm run dev`: Runs the app in development mode.
* `npm run build`: Builds the app for production.
* `npm run lint`: Lints the project files.
* `npm run preview`: Serves the production build locally.

### Server

In the `server` directory, you can run:

* `node index.js`: Starts the server.

---
