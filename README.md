# 🌍 getWords 

![getWords Logo Aesthetic](https://img.shields.io/badge/Aesthetic-Cyberpunk%20Neon-040914?style=for-the-badge&logoColor=3B82F6)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-8E75B2?style=for-the-badge&logo=google)

**getWords** is a smart, AI-powered dictionary and contextual translation tool. It helps you understand words on a deeper level by generating meanings, practical examples, synonyms, antonyms, and precise Arabic translations using Google's Gemini AI models.

## ✨ Features

- 🧠 **AI-Powered Definitions:** Fetches rich meanings, synonyms, antonyms, and examples dynamically.
- 📖 **Contextual Translation:** Translate a specific word based on the context of a sentence to get the most accurate meaning, instead of a rigid literal translation.
- ⚡ **Lightning Fast:** Built with Next.js 15 (App Router & Turbopack) for blazing fast performance.
- 🗄️ **Smart Caching (Database):** Saves searched words into a Neon PostgreSQL database via Prisma so subsequent searches load instantly without hitting the AI API again.
- 🎨 **Sleek Cyberpunk UI:** A visually stunning Dark Mode design featuring Glassmorphism, Neon Blue (`#3B82F6`), and Mint Green (`#10B981`) accents with Glitch text effects.
- 🛡️ **Robust Fallback:** Intelligent model-switching mechanism. If the primary AI model is overloaded (503) or rate-limited (429), it automatically seamlessly falls back to alternate Gemini models.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (React)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [Neon DB (Serverless PostgreSQL)](https://neon.tech/)
- **AI Integration:** [Google Generative AI (Gemini)](https://ai.google.dev/)

## 🚀 Getting Started

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/getwords.git
cd getwords
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the root directory and add the following keys:

\`\`\`env
# Your Google Gemini API Key
GOOGLE_API_KEY=your_gemini_api_key_here

# Your Neon PostgreSQL Database URL (Ensure pgbouncer=true is appended for pooler links)
DATABASE_URL=postgresql://user:password@your-neon-hostname.neon.tech/neondb?sslmode=require&pgbouncer=true
\`\`\`

### 4. Push Database Schema
Sync your Prisma schema with the Neon database:
\`\`\`bash
npx prisma db push
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 💡 How it works

1. **Search a Word:** Enter a word in the search bar.
2. **Database Check:** The app checks PostgreSQL. If the word exists, it instantly returns the cached data.
3. **AI Generation:** If the word doesn't exist, the app prompts the Gemini AI model to generate meanings, examples, and relations, storing the structured output back into the database for future use.
4. **Context Translation:** Enter a full sentence and a target word. The AI determines the exact contextual translation of the word and stores it intelligently.

## 👾 Design Aesthetic

The UI was meticulously crafted to match the brand logo:
- **Background:** Deep Navy (`#040914`)
- **Primary Accent:** Neon Globe Blue
- **Secondary Accent:** Neon Book Mint Green
- **Effects:** Glassy cards, dynamic background radial gradients, and subtle chromatic aberration (glitch) text on headers.

---
*Built with ❤️ using Next.js and AI.*
