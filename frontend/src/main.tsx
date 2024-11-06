import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { GoogleOAuthProvider } from "@react-oauth/google"

const clientId = "107285687559-nqjudb9mfrsaua8gdcjbjpt69d4f457r.apps.googleusercontent.com"

createRoot(document.getElementById("root") || document.createElement("div")).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
)
