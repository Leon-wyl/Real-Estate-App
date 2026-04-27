import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { AuthContextProvider } from "./context/AuthContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
