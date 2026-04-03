import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Sommar core palette
        green: {
          DEFAULT: '#1D9E75',
          glow: '#1DFFA8',
        },
        coral: {
          DEFAULT: '#D85A30',
          glow: '#FF6B3D',
        },
        amber: {
          DEFAULT: '#EF9F27',
          glow: '#FFB840',
        },
        cyan: {
          DEFAULT: '#00D4FF',
        },
        purple: {
          DEFAULT: '#A855F7',
        },
        pink: {
          DEFAULT: '#EC4899',
        },
        // Semantic
        background: '#000000',
        foreground: '#ffffff',
        // White opacity scale
        'white-strong': 'rgba(255,255,255,0.87)',
        'white-medium': 'rgba(255,255,255,0.6)',
        'white-subtle': 'rgba(255,255,255,0.35)',
        'white-muted': 'rgba(255,255,255,0.15)',
        // Glass surfaces
        'glass-bg': 'rgba(255,255,255,0.03)',
        'glass-border': 'rgba(255,255,255,0.06)',
        'glass-hover': 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
      },
      borderRadius: {
        'sm': '10px',
        'md': '14px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        'pill': '30px',
      },
      backdropBlur: {
        'glass': '20px',
      },
      keyframes: {
        // Orb animations
        'orb-aura-breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.25)', opacity: '0.9' },
        },
        'orb-core-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'orb-ring-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orb-s1-float': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.1) rotate(180deg)' },
        },
        'orb-s2-float': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.15) rotate(-180deg)' },
        },
        // UI animations
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.96)', filter: 'blur(3px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'hex-pop': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '30%': { opacity: '1', transform: 'translateY(-4px)' },
        },
        'scroll-reveal': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(29,255,168,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(29,255,168,0.6)' },
        },
        'wave-bar': {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '0.4' },
          '50%': { transform: 'scaleY(1.6)', opacity: '1' },
        },
        'pulse-badge': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.75' },
          '50%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'orb-breathe': 'orb-aura-breathe 5s ease-in-out infinite',
        'orb-pulse': 'orb-core-pulse 4s ease-in-out infinite',
        'orb-spin': 'orb-ring-spin 30s linear infinite',
        'orb-s1': 'orb-s1-float 7s ease-in-out infinite',
        'orb-s2': 'orb-s2-float 9s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s cubic-bezier(.16,1,.3,1) forwards',
        'slide-up': 'slide-up 0.45s cubic-bezier(.16,1,.3,1) forwards',
        'hex-pop': 'hex-pop 0.4s cubic-bezier(.16,1,.3,1) forwards',
        'typing-dot': 'typing-dot 1.4s ease-in-out infinite',
        'scroll-reveal': 'scroll-reveal 0.8s cubic-bezier(.16,1,.3,1) forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'wave-bar': 'wave-bar 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
