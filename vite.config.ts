import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'BIP39 Vault',
          short_name: 'BIP39 Vault',
          description: 'Offline-ready BIP39 phrase generator and local vault.',
          theme_color: '#4f46e5',
          background_color: '#f8fafc',
          display: 'standalone',
          start_url: '/',
          scope: '/',
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: ({request}) =>
                request.destination === 'document' || request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'html-network-first',
                networkTimeoutSeconds: 5,
                cacheableResponse: {
                  statuses: [0, 200],
                },
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 24 * 60 * 60,
                },
              },
            },
            {
              urlPattern: ({request, url}) =>
                request.destination === '' ||
                request.headers.get('accept')?.includes('application/json') === true ||
                url.pathname.startsWith('/api'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'data-network-first',
                networkTimeoutSeconds: 10,
                cacheableResponse: {
                  statuses: [0, 200],
                },
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 24 * 60 * 60,
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
