# Minerva

**Minerva** is a web platform for **book sharing and book valuation**. It allows users to exchange books, rate and review them, and discover new reads through a community-driven library.

---

## 🚀 Features
- 📚 Book sharing system to lend and borrow books
- ⭐ Rating & review system for books
- 🔍 Search and filtering (by genre, author, rating)
- 👥 User profiles to track shared & rated books
- 📂 File upload for book-related documents
- 🔐 Private file access with download request approval
- 📥 Direct download for public files
- 📧 Email notifications when a file is requested by another user
- 🔑 User authentication system

---

## 🛠️ Tech Stack
- **Frontend**: Vite, React, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express
- **Authentication & Database**: Firebase
- **Deployment**: Docker

---

## 🐳 Running the application with Docker

To run the application, you will need to have Docker and Docker Compose installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Marco-Bonito/Minerva.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd Minerva
    ```

3.  **Create a `serviceAccountKey.json` file in `backend/src/config`:**

    Create a file named `serviceAccountKey.json` in the `backend/src/config` directory and paste your Firebase service account key into it. You can get this from your Firebase project settings.

4.  **Run the application:**

    ```bash
    docker-compose up
    ```

    This will build the Docker image and start the backend service. The backend will be available at `http://localhost:3000`.

---

## 📧 Contact

Created by Marco Bonito (https://github.com/Marco-Bonito)

email : marco.bonito.dev@gmail.com

phone : +39 3400673376

feel free to reach out!
