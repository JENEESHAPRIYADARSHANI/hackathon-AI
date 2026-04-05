# Installation & Setup Guide

Complete step-by-step guide to get the platform running locally.

## Prerequisites

Before starting, ensure you have:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** v7 or higher (comes with Node.js)
- **MongoDB** (Option A: Local or Option B: MongoDB Atlas)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- **Git** for version control
- **Text Editor** (VS Code recommended)

---

## Step 1: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key
4. Keep it safe - you'll need it in `.env`

---

## Step 2: Setup MongoDB

### Option A: Local MongoDB

**Install MongoDB Community Edition:**
- Windows: [Download MSI Installer](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- Mac: `brew install mongodb-community`
- Linux: `sudo apt-get install mongodb`

**Start MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Windows (if installed as service)
# Automatically starts on boot

# Linux
sudo systemctl start mongod
```

**Verify:**
```bash
mongo --version
# Should show MongoDB shell version
```

### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string
5. Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

---

## Step 3: Clone & Setup Project

```bash
# Navigate to workspace
cd c:\Users\DELL\Hackothon

# Check structure
dir

# You should see:
# backend/  frontend/  README.md  AI_IMPLEMENTATION.md
```

---

## Step 4: Backend Setup

### A. Navigate to Backend
```bash
cd backend
```

### B. Install Dependencies
```bash
npm install
```

### C. Create `.env` File
```bash
# Copy example
copy .env.example .env

# Or manually create and add:
```

### D. Edit `.env`
Open `backend/.env` and update:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-service-platform
# OR if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-service-platform

GEMINI_API_KEY=your_api_key_here_replace_this
JWT_SECRET=hackathon2026secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### E. Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
Server is running on port 5000
MongoDB connected
```

### F. Test Backend
```bash
# In another terminal:
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

---

## Step 5: Frontend Setup

### A. Navigate to Frontend
```bash
# In a new terminal
cd c:\Users\DELL\Hackothon\frontend
```

### B. Install Dependencies
```bash
npm install
```

### C. Create `.env` File
```bash
# Copy example
copy .env.example .env
```

### D. Edit `.env`
Open `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### E. Start Frontend Server
```bash
npm start
```

**Expected Output:**
- Browser opens automatically to `http://localhost:3000`
- React app loads with beautiful UI

---

## Step 6: Test the Platform

### 1. Dashboard
- Navigate to Dashboard
- Should show 0 requests initially

### 2. Create Request
- Go to "Create Request" tab
- Fill in:
  - Title: "Server is down"
  - Description: "Main exam server is not responding"
  - Location: "Lab 3"
- Click "Get AI Suggestions"
  - ✅ AI predicts: CRITICAL priority
  - ✅ Category: TECHNICAL
  - ✅ Summary generated
  - ✅ Resolution suggested
- Click "Create Request"
  - ✅ Request created
  - ✅ Dashboard updated

### 3. AI Chat
- Go to "AI Chat" tab
- Type: "WiFi not working in Lab 2"
- ✅ AI extracts structure
- Click "Create Request"

### 4. Map View
- Go to "Map View" tab
- ✅ See requests on map
- Click marker for details

### 5. Dashboard
- Check updated stats
- See request count increased
- View requests by priority

---

## Troubleshooting

### Problem: "Cannot connect to MongoDB"
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Ensure MongoDB is running: `mongod --version`
2. Start MongoDB service
3. Or use MongoDB Atlas with correct connection string

### Problem: "Gemini API Error"
```
Error: Invalid API key
```

**Solution:**
1. Get new API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update GEMINI_API_KEY in `.env`
3. Restart backend: `npm run dev`

### Problem: "Port 5000 already in use"
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change port in .env:
PORT=5001
```

### Problem: "Port 3000 already in use"
```bash
# Solution: Stop other services or use different port
npm start -- --port 3001
```

### Problem: "CORS Error"
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Ensure FRONTEND_URL is correct in backend `.env`
2. Currently set to: `http://localhost:3000`
3. Restart backend

---

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev
# Auto-reloads on file changes (using nodemon)
```

### Frontend Development
```bash
cd frontend
npm start
# Auto-refreshes on file changes (React)
```

### Make Changes
1. Edit files in `src/` folders
2. Auto-reload handles updates
3. Open browser DevTools (F12) for debugging

---

## Project Structure

```
Hackothon/
├── backend/
│   ├── src/
│   │   ├── index.js          ← Main server
│   │   ├── models/           ← Database schemas
│   │   ├── routes/           ← API endpoints
│   │   ├── controllers/      ← Business logic
│   │   ├── services/         ← AI, SLA, Email
│   │   └── middleware/       ← Middleware
│   ├── package.json
│   ├── .env                  ← Configure here
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.js            ← Main component
│   │   ├── components/       ← Reusable components
│   │   ├── pages/            ← Page components
│   │   └── index.js
│   ├── public/               ← Static files
│   ├── package.json
│   ├── .env                  ← Configure here
│   └── README.md
│
├── README.md                 ← Main docs
├── AI_IMPLEMENTATION.md      ← AI feature docs
└── SETUP.md                  ← This file
```

---

## Next Steps

### After Setup Works

1. **Create a Service Request**
   - Go to "Create Request" tab
   - Use title: "Server Down" and description about exam server
   - Click "Get AI Suggestions" to see Gemini in action

2. **Test AI Chat**
   - Go to "AI Chat" tab
   - Type natural language request
   - Watch it convert to structured form

3. **View Dashboard**
   - See real-time analytics
   - Check SLA tracking
   - View request breakdowns

4. **Explore Map View**
   - See location-based visualization
   - Different colors for priorities

### Production Deployment

When ready to deploy:
- Set `NODE_ENV=production`
- Deploy backend to: AWS, Heroku, Render, etc.
- Deploy frontend to: Vercel, Netlify, AWS S3, etc.
- Use MongoDB Atlas for database
- Set correct URLs in environment variables

---

## Optional: Environment Setup

### VS Code Extensions (Recommended)
```
- ES7+ React/Redux/React-Native snippets
- MongoDB for VS Code
- Thunder Client (API testing)
- Prettier (Code formatting)
```

### Git Setup
```bash
cd c:\Users\DELL\Hackothon
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

---

## Support Resources

- **Documentation**: See README.md and AI_IMPLEMENTATION.md
- **API Docs**: See backend/README.md
- **Frontend Docs**: See frontend/README.md
- **Issues**: Check error messages and troubleshooting above

---

## Quick Reference

### Start Everything
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Open: http://localhost:3000
```

### Check Status
```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend
Open http://localhost:3000 in browser
```

### Stop Everything
```
Ctrl+C in both terminals
```

---

**You're all set! 🚀**

Next, read the main README.md for usage guide and features overview.
