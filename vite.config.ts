import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      host: env.VITE_HOST ? `${env.VITE_HOST}` :  `localhost`,
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 4000, 
      // https:false
    },
  };
});
