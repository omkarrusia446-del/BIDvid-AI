# BIDvid AI

A lightweight AI video-creation workspace with a responsive frontend and a Node.js backend that saves browser-specific projects.

## Run locally

```powershell
node server.js
```

Open `http://localhost:3000`.

## Deploy to Render

1. Create a new **Web Service** from this GitHub repository.
2. Use **Node** as the runtime.
3. Set the build command to `npm install` (there are currently no package dependencies).
4. Set the start command to `node server.js`.

Render supplies the `PORT` environment variable automatically. The current project store is a local JSON file, so use a persistent disk or replace it with a database before production use.

## Video generation

The current generation flow is a demo backend. Connect a provider such as Runway, Google Veo, or a locally hosted ComfyUI instance to generate real videos.

