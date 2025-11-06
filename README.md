# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Notion OAuth Integration

This app includes a minimal Express server to handle Notion OAuth securely and a simple UI to connect/disconnect Notion.

### Env vars

Create a `.env` file in the project root with:

```
APP_BASE_URL=http://localhost:5173
PORT=3001
NOTION_CLIENT_ID=your_client_id
NOTION_CLIENT_SECRET=your_client_secret
NOTION_REDIRECT_URI=http://localhost:3001/auth/notion/callback
NOTION_VERSION=2022-06-28
```

In your Notion integration settings, set the Redirect URI to `http://localhost:3001/auth/notion/callback`.

### Run

```
npm install
npm run dev
```

Open the app at `http://localhost:5173`, navigate to `Integrations`, and click "Connect Notion".

