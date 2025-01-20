# Project Overview

This project consists of two main components:
1. **Client**: A React application built using Vite.
2. **Server**: A Django application providing backend services.

## Project Structure
```
project-root/
├── client/     # React Vite application
└── server/     # Django application
```

### Client
The client folder contains a Vite-based React application.

#### Setup Instructions for Client
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at the URL provided by the terminal.

#### Build for Production
To create a production build of the client application:
```bash
npm run build
```

#### Preview the Production Build
```bash
npm run preview
```

---

### Server
The server folder contains a Django application.

#### Setup Instructions for Server
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply migrations:
   ```bash
   python manage.py migrate
   ```
5. Run the development server:
   ```bash
   python manage.py runserver
   ```
6. Open the server at http://127.0.0.1:8000 in your browser.

#### Seeding Data
To seed initial data into the database:
```bash
python manage.py seed_data
```

 

---

## Environment Variables
Create a `.env` file in the `server` directory to manage environment-specific settings.

Example `.env` for Server:
```
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DB_NAME=metrics # Postgres DB Name
DB_USER=root # Postgres Username
DB_PASSWORD=root # Postgres Password
DB_HOST=127.0.0.1 # Postgres Host
DB_PORT=5432 # Postgres Port
```

---

## PostgreSQL Database Setup
To configure the PostgreSQL database:
1. Ensure PostgreSQL is installed and running.
2. Create a database named `metrics`.
3. Create a user with the username `root` and password `root`.
4. Grant the user the necessary permissions on the `metrics` database.

Example commands for PostgreSQL:
```sql
CREATE DATABASE metrics;
CREATE USER root WITH PASSWORD 'root';
GRANT ALL PRIVILEGES ON DATABASE metrics TO root;
```

---

## Important Notes
- Ensure that `node.js` is installed to run the client application.
- Use a Python version compatible with Django (as specified in `requirements.txt`).