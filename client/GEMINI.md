# Real Estate App - Frontend (Client)

This is the frontend of the Real Estate application, built with React and Vite.

## Tech Stack
- **Framework:** React (Vite)
- **Styling:** SCSS / SASS
- **Maps:** React Leaflet
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Infrastructure:** AWS S3 + CloudFront

## Key Directories
- `src/components/`: Reusable UI components (Navbar, Sidebar, etc.).
- `src/routes/`: Page-level components and routing logic.
- `src/context/`: Global state management using React Context.
- `src/lib/`: API configuration (Axios) and helper functions.
- `public/`: Static assets like images and icons.
- `index.html`: Main HTML template.
- `vite.config.js`: Build and development configuration.

## Local Development
1. `cd client`
2. `npm install`
3. `npm run dev` (Runs on port 5173)

## Environment Variables
Create a `.env.production` file in the `client/` directory for production build:
```env
VITE_API_URL="https://api.leonrealestate.uk/api"
```

## Deployment (AWS S3 + CloudFront)
Managed via the root `deploy.sh` script or Terraform in the `/terraform` directory.
- **Storage:** AWS S3 (`leonrealestate-web`)
- **Distribution:** AWS CloudFront
- **SSL:** AWS ACM
- **DNS:** Cloudflare
