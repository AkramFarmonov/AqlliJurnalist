import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable existing service workers and clear caches to avoid stale PWA behavior
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => Promise.all(regs.map((r) => r.unregister())))
      .then(() => {
        if ('caches' in window) {
          return caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
        }
      })
      .then(() => {
        console.log('Service workers unregistered and caches cleared');
      })
      .catch((err) => {
        console.warn('Failed to unregister service workers or clear caches:', err);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
