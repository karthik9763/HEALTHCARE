# Health Metrics Tracking System - Execution Commands

Follow these steps to run the project in VS Code.

## 1. Start the Database
> [!IMPORTANT]
> **MongoDB must be running!**
> - **Easy Fix**: Double-click the file [START_DATABASE.bat](file:///c:/Users/vasan/OneDrive/Desktop/health%20project/START_DATABASE.bat) in the project root. It will automatically ask for permission and start the database for you.

---

## 2. Start the Backend
```powershell
cd backend
npm install
npm start
```
> [!NOTE]
> Make sure MongoDB is running on your system.

---

## 2. Start the Frontend
Open **another** Terminal tab (click the + icon in the Terminal panel) and run:
```powershell
cd frontend
npm install
npm start
```

---

## 3. Access the Application
- Open your browser and go to: [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Troubleshooting
- **Verify Backend & Database**: Open a terminal in `backend` and run:
  ```powershell
  node diagnose.js
  ```
  This will tell you exactly why the server can't find your database.
- **Signup/Login failed**: If you see "Server is OFFLINE" at the top of the page, ensure your backend terminal is running without errors.
- **CORS Errors**: Always use `127.0.0.1` or `localhost` consistently.
