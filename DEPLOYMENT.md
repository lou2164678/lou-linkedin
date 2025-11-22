# Deployment Guide

This guide explains how to install, setup, and run the project after importing the files to your hosting provider.

## Project Stack
- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm (or Bun)

## 1. Prerequisites
Ensure your hosting environment has **Node.js** installed (version 18 or higher is recommended).

## 2. Installation
Open your terminal in the project root directory and run:

```bash
npm install
```

*Note: If you prefer using Bun, you can run `bun install` instead.*

## 3. Building for Production
To create an optimized production build, run:

```bash
npm run build
```

This command compiles your code into the `dist` directory. This folder contains the static files that should be served by your web server.

## 4. Running the Application

### Option A: Static Hosting (Netlify, Vercel, Cloudflare Pages)
This project is a static site (SPA), so it works best with static hosting providers.

- **Netlify**: The project includes a `netlify.toml` file, so if you connect your GitHub repository to Netlify, it should automatically detect the settings (`bun run build` or `npm run build` and publish directory `dist`).
- **Vercel**: Connect your repository. Vercel will automatically detect it as a Vite project.
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`

### Option B: Docker / Railway (Recommended for Custom Deployments)
If you are deploying to Railway or any platform that supports Docker:

1.  **Ensure the `Dockerfile` is present** in your repository (I have just added this for you).
2.  **Push your changes** to GitHub.
3.  **Connect Railway** to your GitHub repository.
4.  Railway will automatically detect the `Dockerfile` and build your application using the defined steps. This avoids common issues with missing dependencies during the build process.

### Option C: Traditional Server / VPS
If you are deploying to a VPS (like DigitalOcean, Linode, or AWS EC2):

1.  **Install a web server** (like Nginx or Apache).
2.  **Upload the contents of the `dist` folder** (created in step 3) to your web server's public directory (e.g., `/var/www/html`).
3.  **Configure the server** to handle client-side routing. For Nginx, your configuration should look something like this:

    ```nginx
    location / {
      try_files $uri $uri/ /index.html;
    }
    ```

### Option C: Preview Locally
To test the production build locally before deploying:

```bash
npm run preview
```

## 5. Configuration & API Keys

### OpenRouter / OpenAI API Keys
Currently, this application is designed to be client-side first.
- **Setup**: You do **not** need to set API keys in your hosting provider's environment variables for the app to start.
- **Usage**: When you navigate to the AI tools (like "Prospect Vetting" or "Objection Handler"), the UI will prompt you to enter your OpenRouter or OpenAI API key.
- **Storage**: The key is saved securely in your browser's **Local Storage**, so you don't need to re-enter it every time you visit.

*Note: Since the API calls are made directly from the browser to the AI provider, ensure your API keys have appropriate usage limits set in your provider's dashboard.*
