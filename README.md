# VedaAI – AI Assessment Creator

A production-ready full-stack SaaS application that enables teachers to create assignments and generate AI-powered question papers.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Framer Motion** for animations
- **React Hook Form** + **Zod** for validation
- **Socket.IO Client** for real-time updates
- **Recharts** for analytics
- **Lucide React** for icons

### Backend
- **Express.js** + TypeScript
- **MongoDB** + Mongoose
- **Redis** + IORedis
- **BullMQ** for job queues
- **Socket.IO** for WebSocket
- **OpenAI GPT-4o** for AI generation
- **JWT** + **bcrypt** for auth

## 📦 Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis
- OpenAI API key

### 1. Start Database Services

```bash
docker-compose up -d
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `REDIS_HOST` | Redis host | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

## 📁 Project Structure

```
├── frontend/          Next.js 14 application
│   ├── src/
│   │   ├── app/       Pages (App Router)
│   │   ├── components/ Reusable UI components
│   │   ├── store/     Zustand state stores
│   │   ├── hooks/     Custom React hooks
│   │   ├── lib/       Utilities, API client, Socket
│   │   └── types/     TypeScript types
│
├── backend/           Express.js API server
│   ├── src/
│   │   ├── config/    Database & Redis config
│   │   ├── models/    Mongoose models
│   │   ├── routes/    API routes
│   │   ├── controllers/ Route handlers
│   │   ├── services/  AI generation service
│   │   ├── queues/    BullMQ queue config
│   │   ├── workers/   Background job workers
│   │   ├── sockets/   WebSocket handlers
│   │   └── middleware/ Auth & validation
│
└── docker-compose.yml MongoDB & Redis services
```

## 🌟 Features

- ✅ Premium landing page with animations
- ✅ JWT authentication (register/login)
- ✅ Teacher dashboard with statistics
- ✅ Assignment creation with validation
- ✅ AI-powered question generation
- ✅ Real-time WebSocket progress updates
- ✅ Exam-paper formatted output
- ✅ PDF export / Print
- ✅ Dark mode
- ✅ Fully responsive
- ✅ Drag & drop file upload
- ✅ Difficulty distribution control
