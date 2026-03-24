import type { UserConfig } from 'vite';

export default {
  base: '/Landing-Page/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    cssMinify: 'lightningcss',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    reportCompressedSize: true,
  },
  server: {
    open: true,
  },
  css: {
    transformer: 'lightningcss',
  },
} satisfies UserConfig;
