# BIDvid AI

A lightweight AI video-creation workspace with a responsive frontend and a Node.js backend that saves browser-specific projects.

## Run locally

```powershell
node local-server.cjs
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Import this GitHub repository in Vercel.
2. Leave the framework preset as **Other**.
3. Deploy with the default settings.

Vercel serves the website and the `api/` directory provides serverless endpoints. The deployed app uses short-lived demo project storage. Connect a database such as Vercel Postgres, Neon, or Supabase before using it as a permanent multi-user service.

## Video generation

The current generation flow is a demo backend. Connect a provider such as Runway, Google Veo, or a locally hosted ComfyUI instance to generate real videos.

