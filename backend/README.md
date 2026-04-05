# Smart Service Platform - Backend

AI-Powered Service Request Platform with Gemini AI Integration

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example`
4. Add your Gemini API key: `GEMINI_API_KEY=your_key_here`
5. Set up MongoDB locally or use MongoDB Atlas
6. Run: `npm run dev`

## API Endpoints

### Requests
- `POST /api/requests` - Create new request
- `GET /api/requests` - Get all requests with filters
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id/status` - Update status
- `PUT /api/requests/:id/assign` - Assign to user
- `POST /api/requests/:id/note` - Add note
- `GET /api/requests/check-sla/status` - Check SLA breaches

### AI
- `POST /api/ai/analyze` - Agentic analysis
- `POST /api/ai/chat` - Chat to request
- `POST /api/ai/priority` - Predict priority
- `POST /api/ai/classify` - Classify category

### Dashboard
- `GET /api/dashboard` - Dashboard stats

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

## Features

- ✅ AI Priority Prediction (Gemini)
- ✅ AI Category Classification (Gemini)
- ✅ AI Summary Generation
- ✅ Agentic Workflow (Intelligent Decision Making)
- ✅ GenAI Chat Assistant
- ✅ SLA Tracking & Auto-escalation
- ✅ Email Notifications
- ✅ Real-time dashboard stats
