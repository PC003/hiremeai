# HireMeAI

HireMeAI is a FastAPI + React app that lets HR or interviewers ask questions about a candidate resume through a chat interface.

## Local Development

Start the backend:

```bash
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Deploy On Vercel

Deploy from the `hiremeai` project root. The included `vercel.json` builds the React app from `frontend/`, serves `frontend/dist`, and routes `/api/*` requests to the FastAPI app through `api/index.py`.

Set this Vercel environment variable before deploying:

```text
GROQ_API_KEY=your_groq_api_key
```

Optional:

```text
FRONTEND_URL=https://your-project.vercel.app
```

CLI deployment:

```bash
npm i -g vercel
vercel
vercel --prod
```
