# PrepWise AI

PrepWise AI is a full-stack, intelligent study scheduling application designed to help students optimize their examination preparation. By processing a subject, core target topics, and an upcoming exam date, the application structures a personalized daily study timeline and securely records the configuration within a cloud database infrastructure.

Live Application: https://prepwise-lite-git-main-priyanka17.vercel.app/

---

## Core Features

- **Dynamic Form Management:** Clean, highly responsive user interface designed for synchronous multi-input data collection.
- **Intelligent Schedule Generation:** Integrated serverless pipeline connecting with high-speed AI inference models via the Groq API utilizing Llama 3 architectures.
- **Resilient Fallback Controller:** Engineered with defensive code blocks to handle structured JSON parsing gracefully or drop down to a local schema template in high-traffic rate-limiting scenarios.
- **Cloud Database Engine:** Real-time cloud storage powered by Supabase (PostgreSQL) configured with explicit public Row-Level Security (RLS) data access policies.

---

## Architecture and Technology Stack

| Architecture Layer | Component Technology |
| :--- | :--- |
| Frontend UI Layer | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend Runtime | Next.js Serverless Route Handlers |
| Database Layer | Supabase (PostgreSQL) |
| AI Inference Layer | Groq API (llama3-8b-8192) |
| Deployment & CI/CD | Vercel Platform |

---

## Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/Priyanka-c0de/prepwise-lite.git](https://github.com/Priyanka-c0de/prepwise-lite.git)
cd prepwise-lite
````````
### 2. Configure Environment Variables
Create a ```.env.local``` file in the root directory and append the following credentials:
```Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
`````
### 3. Install Dependencies and Run Development Server
```Bash
npm install
npm run dev
````
