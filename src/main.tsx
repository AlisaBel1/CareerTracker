import React from "react";
import ReactDOM from "react-dom/client"; 
import App from "./App.tsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('ENV:', import.meta.env);
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
