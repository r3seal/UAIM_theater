/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createRoot } from 'react-dom/client'; // Dla web

// Sprawdzenie, czy kod działa w przeglądarce (web)
if (typeof document !== 'undefined') {
  const container = document.getElementById('root') || document.createElement('div');
  if (!container.parentElement) {
    document.body.appendChild(container);
  }
  const root = createRoot(container); // React 18+
  root.render(<App />);
} else {
  // Rejestracja aplikacji mobilnej
  AppRegistry.registerComponent(appName, () => App);
}