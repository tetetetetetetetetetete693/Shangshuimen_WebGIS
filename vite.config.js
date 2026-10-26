import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const base = process.env.VITE_BASE_PATH || '/';
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error('VITE_BASE_PATH 应为 /仓库名/ 格式');

export default defineConfig({
  base,
  define: { CESIUM_BASE_URL: JSON.stringify(`${base}cesium/`) },
  plugins: [
    viteStaticCopy({
      targets: ['Workers', 'Assets', 'Widgets', 'ThirdParty'].map(name => ({ src: `node_modules/cesium/Build/Cesium/${name}`, dest: 'cesium' }))
    })
  ],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true }
});
