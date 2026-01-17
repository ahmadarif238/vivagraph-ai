# 🚀 Deployment Guide

This guide will walk you through deploying **VivaGraph AI**.

## 1. Push to GitHub

First, you need to push your local code to a GitHub repository.

1.  **Create a New Repository** on [GitHub](https://github.com/new). Name it `vivagraph-ai` (or similar).
2.  **Initialize Git** (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/vivagraph-ai.git
    git push -u origin main
    ```

---

## 2. Deploy Backend (Hugging Face Spaces)

We will deploy the Python backend using Docker on Hugging Face.

1.  **Create a Space**:
    *   Go to [Hugging Face Spaces](https://huggingface.co/spaces).
    *   Click **"Create new Space"**.
    *   **Name**: `vivagraph-backend` (or similar).
    *   **SDK**: Select **Docker**.
    *   Select **Blank** (since you have your own Dockerfile).
    *   Click **Create Space**.

2.  **Upload Files**:
    *   In your new Space, go to the **Files** tab.
    *   Click **Add file** -> **Upload files**.
    *   Select **ALL files** from your local `backend` folder.
    *   **CRITICAL**: You must drag the *contents* of your `backend` folder into the root of the Space.
        *   The `Dockerfile` must be at the root of the Space.
        *   The `requirements.txt` must be at the root.
        *   The `app` folder must be at the root.
    *   *Alternative*: You can also just git push the `backend` folder contents to the Space's repo URL.

3.  **Set Secrets (Environment Variables)**:
    *   Go to **Settings** in your Space.
    *   Scroll to **Variables and secrets**.
    *   Add the following **Secrets** (copy them from your `.env` file):
        *   `CEREBRAS_API_KEY`
        *   `GROQ_API_KEY`
        *   `PINECONE_API_KEY`
        *   `SUPABASE_URL`
        *   `SUPABASE_KEY`
        *   `OPENAI_API_KEY` (if used)

4.  **Wait for Build**:
    *   The Space will build the Docker container. This might take a few minutes.
    *   Once "Running", you will see a link like `https://huggingface.co/spaces/username/vivagraph-backend` (or a direct URL).
    *   Copy the **Direct URL** (usually found by clicking the "Embed this space" or looking at the browser URL, e.g., `https://username-vivagraph-backend.hf.space`).

---

## 3. Deploy Frontend (Vercel)

Now we connect the frontend to the live backend.

1.  **Import to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **Project**.
    *   Select your GitHub repository (`vivagraph-ai`).
    *   **Root Directory**: Click "Edit" and select `frontend`. (This is import!).

2.  **Configure Environment**:
    *   In the **Environment Variables** section, add:
        *   **Name**: `VITE_API_URL`
        *   **Value**: Your Hugging Face Backend URL (e.g., `https://username-vivagraph-backend.hf.space`).
        *   *Note: Do not add a trailing slash `/`.*

3.  **Deploy**:
    *   Click **Deploy**.
    *   Vercel will build your React app.

4.  **Final Polish**:
    *   Once deployed, Vercel will give you a domain (e.g., `vivagraph-ai.vercel.app`).
    *   Open it and test!

---

## Troubleshooting

*   **CORS Errors**: If the frontend says "Network Error", ensure your Backend (FastAPI) allows the Vercel domain.
    *   Update `backend/app/main.py` if necessary to add your Vercel domain to `CORSMiddleware`. (Currently it allows `*` which represents all domains, so it should work fine).
*   **404 on Refresh**: If you refresh a page and get a 404, we added a `vercel.json` to fix this. Ensure it was deployed.
