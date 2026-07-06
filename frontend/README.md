# ⚛️ NovaBlog Frontend (React & Vite Client)

This is the responsive, high-performance user interface for the NovaBlog platform. Built as a Single Page Application (SPA) using React 19, Vite, and Tailwind CSS, it offers a smooth, responsive blogging experience complete with rich-text markdown writing, comments, likes, notifications, and follower integrations.

## 🔗 Live Site Details
* **Custom Domain**: [https://novablog.space](https://novablog.space) (Hosted on Vercel)
* **Vercel Deployment URL**: `https://novablog-by-swappy.vercel.app`

---

## 🛠️ Tech Stack
* **⚛️ Framework**: React 19 (Vite compilation)
* **🎨 Styling**: Tailwind CSS & Vanilla CSS
* **🎬 Animations**: Framer Motion
* **🚦 Routing**: React Router
* **✍️ Rich Text Editor**: TipTap Editor SDK (supports markdown, blocks, headings, code blocks, alignment, and inline links)
* **🌐 API Client**: Axios (configured with intercepts for token refresh handshaking)
* **🔔 Alert Notifications**: React Hot Toast & Ant Design icons

---

## 📁 Project Structure
```text
frontend/
  public/                 Static public assets (logos, placeholders)
  src/
    components/           Modular UI blocks (Auth modals, rich-text editor, comments, analytics charts)
    layouts/              Page wrappers (Navbar, Sidebar, Footer, MainLayout)
    lib/                  Axios client setup and interceptor declarations
    pages/                Application pages (Feed page, blog details, create/edit post, profile settings, bookmark manager)
```

---

## 🔑 Environment Variables

### Local Development
Create a `.env` file in the `frontend` folder:
```env
# URL of your locally running NestJS backend
VITE_API_URL="http://localhost:3000/api/v1"
VITE_SOCKET_URL="http://localhost:3000"
```

### Production (Vercel)
When deploying to Vercel, configure these key-value pairs in the **Environment Variables** panel in the Vercel project dashboard:
* **`VITE_API_URL`**: `https://your-backend-api.onrender.com/api/v1`
* **`VITE_SOCKET_URL`**: `https://your-backend-api.onrender.com`

---

## 🚀 Running the Application Locally

### 1. Install dependencies
```bash
npm install
```

### 2. Launch Development Server
Starts the local development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173`

---

## 📦 Build Commands

Build the production-ready static assets:
```bash
npm run build
```

Preview the locally built production build:
```bash
npm run preview
```

---

## ☁️ Deployment to Vercel
1. Link your Github repository containing the `Blog-App` project.
2. In the setup wizard, select the **Vite / React** framework preset.
3. Configure the environment variables (`VITE_API_URL` and `VITE_SOCKET_URL`).
4. Set up your custom domain **`novablog.space`** under Vercel Settings -> Domains.
