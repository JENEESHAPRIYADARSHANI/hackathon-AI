# AI-Powered Smart Service Request Platform (Hackathon 2026)

**Team Project: NSBM Hackathon 2026**

An intelligent service request management system with advanced AI and GenAI capabilities for real-world operational platforms.

## 🎯 Project Overview

This platform demonstrates how modern companies build AI-driven operational systems with:
- **Smart prioritization** using AI predictions
- **Intelligent categorization** of requests
- **Agentic workflows** for autonomous decision-making
- **Real-time operations** with live updates
- **SLA tracking & escalation** for accountability
- **Map-based location tracking** for field operations

---

## ✨ Key Features

### Core Functionality
✅ Create, read, update service requests
✅ Request lifecycle management (NEW → ASSIGNED → IN_PROGRESS → COMPLETED)
✅ Real-time filtering and search
✅ Location-based tracking with interactive map
✅ SLA deadline calculation and breach detection

### AI Features (MANDATORY)
✅ **AI Priority Prediction** - Automatically predicts request priority from description
✅ **AI Category Classification** - Auto-detects service category (Technical, Facility, Admin, Other)
✅ **AI Summary Generator** - Creates concise summaries from long descriptions

### GenAI Features (MANDATORY)
✅ **Agentic AI Workflow** - Intelligent multi-step analysis and decision-making
✅ **GenAI Chat Assistant** - Natural language to structured request conversion
✅ **Gemini AI Integration** - Google Gemini for all AI/GenAI operations

### Additional Features
✅ Email notifications for critical alerts
✅ SLA tracking with auto-escalation
✅ Interactive dashboard with analytics
✅ Map-based location visualization
✅ Request notes and audit trail

---

## 🏗️ Architecture

```
Smart Service Platform
├── Backend (Node.js/Express)
│   ├── API Routes (Requests, AI, Dashboard)
│   ├── Controllers (Business Logic)
│   ├── Services (AI, Notifications, SLA)
│   ├── Models (MongoDB Schemas)
│   └── Middleware
├── Frontend (React)
│   ├── Pages (Dashboard, Requests)
│   ├── Components (Form, Chat, Map)
│   ├── Services (API Integration)
│   └── Styling (CSS)
└── External Services
    ├── Google Gemini AI
    ├── MongoDB Database
    └── Email Notifications
```

---

## 🤖 AI & GenAI Implementation

### 1. AI-Based Priority Prediction
```javascript
// Analyzes request description to predict priority
predictPriority(description) → "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
```
**How it works:**
- Prompt engineering to analyze urgency, impact, and business criticality
- Regex validation to ensure valid priority output
- Used during request creation and agentic workflows

### 2. AI Category Classification
```javascript
// Classifies request into appropriate category
classifyCategory(description, title) → "TECHNICAL" | "FACILITY" | "ADMINISTRATIVE" | "OTHER"
```
**How it works:**
- Analyzes both title and description for context
- Categorizes into predefined business categories
- Fallback to "OTHER" if uncertain

### 3. AI Summary Generation
```javascript
// Creates 1-line concise summary
generateSummary(description) → "brief summary"
```
**How it works:**
- Summarizes long descriptions to single line
- Used in dashboard and request lists
- Improves UX with quick overviews

### 4. Agentic AI Workflow (HIGH PRIORITY)
```javascript
// Multi-step intelligent workflow
agenticAnalysis(request) → {
  suggestedPriority,
  suggestedCategory,
  summary,
  suggestedResolution,
  shouldEscalate,
  confidence
}
```
**Agent Steps:**
1. **Analyze** - Predict priority & category
2. **Summarize** - Generate summary
3. **Suggest** - Provide resolution steps
4. **Decide** - Determine if escalation needed
5. **Execute** - Trigger alerts if CRITICAL

### 5. GenAI Chat Assistant
```javascript
// Converts natural language to structured request
chatToRequest(userMessage) → {
  title,
  description,
  category,
  location
}
```
**How it works:**
- Users describe issues naturally
- AI extracts structured fields
- System creates request automatically
- Example: "WiFi down in Lab 3" → Structured request

---

## 🚀 API Endpoints

### Service Requests
```
POST   /api/requests              - Create request (with AI analysis)
GET    /api/requests              - List requests (with filters)
GET    /api/requests/:id          - Get single request
PUT    /api/requests/:id/status   - Update status (auto-escalate if SLA breach)
PUT    /api/requests/:id/assign   - Assign to user
POST   /api/requests/:id/note     - Add note
GET    /api/requests/check-sla/status - Check SLA breaches
```

### AI Operations
```
POST   /api/ai/analyze            - Agentic analysis
POST   /api/ai/chat               - Convert chat to request
POST   /api/ai/priority           - Predict priority
POST   /api/ai/classify           - Classify category
```

### Dashboard & Notifications
```
GET    /api/dashboard             - Analytics data
GET    /api/notifications         - Get notifications
PUT    /api/notifications/:id/read - Mark as read
```

---

## 📦 Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB (Database)
- Google Gemini AI API
- Nodemailer (Email notifications)
- WebSocket (Real-time updates)

**Frontend:**
- React 18
- Recharts (Dashboard charts)
- React Leaflet (Map visualization)
- Axios (HTTP client)
- React Hot Toast (Notifications)

**Deployment Ready:**
- Environment-based configuration
- CORS enabled
- Error handling middleware
- Async/await patterns

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API key
- npm or yarn

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Add your credentials to `.env`:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smart-service-platform
   GEMINI_API_KEY=your_api_key_here
   FRONTEND_URL=http://localhost:3000
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Open browser:** `http://localhost:3000`

---

## 🎮 Usage Demo

### 1. Create Service Request (With AI)
- Fill in title & description
- Click "Get AI Suggestions" to see:
  - AI-predicted priority (e.g., CRITICAL)
  - Auto-detected category (e.g., TECHNICAL)
  - Generated summary
  - Suggested resolution steps
  - Escalation recommendation
- Click "Create Request"

### 2. AI Chat Assistant
- Go to "AI Chat" tab
- Type natural language: "Server down in exam hall"
- AI extracts:
  - Title: "Server down"
  - Description: Full message
  - Location: "exam hall"
  - Category: "TECHNICAL"
- Click "Create Request" to save

### 3. Dashboard Analytics
- View real-time stats
- See priority & category breakdowns
- Monitor SLA compliance
- Check critical issues

### 4. Map View
- Visualize all requests by location
- Color-coded by priority
- Click markers for details
- See request concentration

### 5. SLA Management
- System auto-calculates SLA deadlines based on priority
- CRITICAL: 2 hours
- HIGH: 4 hours
- MEDIUM: 8 hours
- LOW: 48 hours
- Email alert + dashboard flag when breached

---

## 📊 Sample Request Payload

```json
{
  "title": "Server down",
  "description": "Main exam server is not responding. Students cannot submit answers.",
  "category": "AUTO",
  "priority": "AUTO",
  "location": "Lab 3",
  "latitude": null,
  "longitude": null
}
```

**System Response:**
```json
{
  "success": true,
  "request": {
    "_id": "req-123",
    "title": "Server down",
    "category": "TECHNICAL",
    "priority": "CRITICAL",
    "status": "NEW",
    "slaDeadline": "2026-04-05T12:30:00Z",
    "aiAnalysis": {
      "suggestedPriority": "CRITICAL",
      "suggestedCategory": "TECHNICAL",
      "suggestedResolution": "Immediately notify IT admin and restart server...",
      "confidence": 0.92
    }
  },
  "aiAnalysis": {
    "shouldEscalate": true
  }
}
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-service-platform
GEMINI_API_KEY=your_api_key_here
JWT_SECRET=your_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📈 Scalability & Future Features

✅ **Currently Implemented:**
- AI Priority/Category/Summary
- Agentic Workflow
- GenAI Chat
- SLA Tracking
- Email Notifications
- Map View
- Dashboard Analytics

🔄 **Optional Enhancements:**
- RAG (Retrieval-Augmented Generation) for knowledge base
- Real-time WebSocket updates
- Mobile app (Flutter/React Native)
- Microservices architecture
- Advanced analytics
- Bulk operations
- API versioning

---

## 🏆 Key Implementation Highlights

### ✈️ Agentic AI Approach
The system uses a **multi-step agentic workflow** rather than simple API calls:

1. **Request received** → Triggers agent
2. **Agent analyzes** → Runs priority prediction + categorization
3. **Agent decides** → Determines if escalation needed
4. **Agent acts** → Creates alerts, sends emails, sets SLA
5. **System reports** → Returns comprehensive analysis

This demonstrates **autonomous AI decision-making**, a core requirement.

### 🎯 Prompt Engineering
All AI operations use carefully crafted prompts that:
- Specify exact output format
- Include constraints (e.g., ONLY valid priorities)
- Provide context for better accuracy
- Handle edge cases gracefully

### 🛡️ Error Handling
- Graceful fallbacks if AI fails
- Input validation on all endpoints
- Try-catch blocks in all async operations
- Detailed error messages

---

## 📝 Demo Script (5-7 minutes)

**Slide 1: Introduction**
- "This is an AI-powered service platform"
- Show architecture diagram

**Slide 2: Live Demo - Create Request**
- Fill form with critical issue: "Server down"
- Click "Get AI Suggestions"
- Show Gemini AI predicting: CRITICAL, TECHNICAL, etc.
- Create request

**Slide 3: Live Demo - Chat Assistant**
- Go to "AI Chat"
- Type: "WiFi not working in Lab 2"
- Show AI extracting structured request

**Slide 4: Dashboard**
- Show real-time analytics
- Highlight critical requests
- Show SLA tracking

**Slide 5: Architecture**
- Backend: Services, Controllers, Models
- Frontend: React Components
- AI: Gemini Integration

**Slide 6: AI Workflow**
- Explain agentic steps
- Show decision logic

**Slide 7: Conclusion**
- Already meets ALL mandatory requirements
- Ready for production
- Scalable architecture

---

## 🤝 Contributing

This is a hackathon project. Team members can contribute by:
1. Adding more AI features
2. Improving UI/UX
3. Adding tests
4. Deploying to cloud
5. Adding mobile support

---

## 📄 License

MIT License - Open source for educational purposes

---

## 👥 Team Information

**NSBM Hackathon 2026**
- Project: AI-Powered Smart Service Platform
- Tech Stack: Node.js/Express, React, MongoDB, Google Gemini
- Status: ✅ Complete with all mandatory features

---

## 📞 Support

For issues or questions:
1. Check the README files in backend/ and frontend/
2. Review API documentation above
3. Check .env.example for configuration

---

**Ready to run! 🚀**
