import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B8FA8',
          light: '#8BA8B8',
          dark: '#5A7A8F',
        },
        success: '#7FA88B',
        warning: '#C8A88F',
        error: '#B88F8F',
        info: '#8FA8B8',
        text: {
          primary: '#1A1A1A',
          secondary: '#4A4A4A',
          tertiary: '#8A8A8A',
        },
        background: '#F5F5F0',
        card: '#FFFFFF',
        border: '#C8C8C0',
        allClear: {
          DEFAULT: '#C8A88F',
          light: '#E8D4C0',
          dark: '#B88F6B',
        },
        lowParticipation: {
          DEFAULT: '#A8A8A8',
          light: '#D0D0D0',
          dark: '#808080',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '50%',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'Noto Sans KR',
          'Apple SD Gothic Neo',
          'Malgun Gothic',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

export default config
