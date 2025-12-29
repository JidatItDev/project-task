import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      
      // Shadcn dependencies
      "class-variance-authority": path.resolve(__dirname, "node_modules/class-variance-authority"),
      "clsx": path.resolve(__dirname, "node_modules/clsx"),
      "tailwind-merge": path.resolve(__dirname, "node_modules/tailwind-merge"),
      
      // Radix UI packages - ADD LABEL HERE
      "@radix-ui/react-label": path.resolve(__dirname, "node_modules/@radix-ui/react-label"),
      "@radix-ui/react-dialog": path.resolve(__dirname, "node_modules/@radix-ui/react-dialog"),
      "@radix-ui/react-card": path.resolve(__dirname, "node_modules/@radix-ui/react-card"),
      "@radix-ui/react-badge": path.resolve(__dirname, "node_modules/@radix-ui/react-badge"),
      "@radix-ui/react-button": path.resolve(__dirname, "node_modules/@radix-ui/react-button"),
      "@radix-ui/react-select": path.resolve(__dirname, "node_modules/@radix-ui/react-select"),
      "@radix-ui/react-alert": path.resolve(__dirname, "node_modules/@radix-ui/react-alert"),
      "@radix-ui/react-table": path.resolve(__dirname, "node_modules/@radix-ui/react-table"),
      "@radix-ui/react-avatar": path.resolve(__dirname, "node_modules/@radix-ui/react-avatar"),
      "@radix-ui/react-separator": path.resolve(__dirname, "node_modules/@radix-ui/react-separator"),
      "@radix-ui/react-slot": path.resolve(__dirname, "node_modules/@radix-ui/react-slot"),
      "@radix-ui/react-input": path.resolve(__dirname, "node_modules/@radix-ui/react-input"),
      "@radix-ui/react-textarea": path.resolve(__dirname, "node_modules/@radix-ui/react-textarea"), // Also add this
      
      "react/jsx-dev-runtime": "react/jsx-dev-runtime",
      "react/jsx-runtime": "react/jsx-runtime",
    }
  },
  optimizeDeps: {
    include: [
      'class-variance-authority',
      'clsx', 
      'tailwind-merge',
      
      // Radix UI packages
      '@radix-ui/react-label',
      '@radix-ui/react-textarea',
      '@radix-ui/react-dialog',
      '@radix-ui/react-card',
      '@radix-ui/react-badge',
      '@radix-ui/react-button',
      '@radix-ui/react-select',
      '@radix-ui/react-alert',
      '@radix-ui/react-table',
      '@radix-ui/react-avatar',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-input',
      
      'lucide-react',
      'react',
      'react-dom'
    ]
  }
})