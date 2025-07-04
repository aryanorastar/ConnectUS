import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), '');
  
  const isProduction = mode === 'production';
  
  return {
    base: isProduction ? '/' : '/',
    define: {
      'process.env': {},
      'import.meta.env.VITE_DFX_NETWORK': JSON.stringify(env.DFX_NETWORK || 'ic'),
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(mode),
      'import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY': JSON.stringify(env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai'),
      'import.meta.env.VITE_HOST': JSON.stringify(env.HOST || 'https://ic0.app'),
      global: 'window',
      __APP_VERSION__: JSON.stringify('1.0.0')
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['@dfinity/auth-client', '@dfinity/principal', '@dfinity/identity'],
          },
        },
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy API requests to the local replica
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
      },
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
        // Enable React 18 features
        jsxRuntime: 'automatic',
      })
    ],
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
        define: {
          global: 'globalThis',
        },
      },
      include: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        '@dfinity/auth-client',
        '@dfinity/principal',
        '@dfinity/identity'
      ],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        // Add any other necessary aliases here
      },
      // Ensure .jsx and .tsx files are resolved
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
  };
});
