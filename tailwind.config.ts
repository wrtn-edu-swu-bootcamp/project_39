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
          DEFAULT: '#4F6B8A',
          light: '#6B8FA8',
          dark: '#3A556B',
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
        },
        success: '#5B8A6B',
        warning: '#B88F6B',
        error: '#C87A7A',
        info: '#6B8FA8',
        text: {
          primary: '#1F2937',
          secondary: '#4B5563',
          tertiary: '#9CA3AF',
        },
        background: '#FAFAFA',
        card: '#FFFFFF',
        border: '#E5E7EB',
        allClear: {
          DEFAULT: '#B88F6B',
          light: '#D4B89F',
          dark: '#9A6F4B',
        },
        lowParticipation: {
          DEFAULT: '#9CA3AF',
          light: '#D1D5DB',
          dark: '#6B7280',
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
        '4xl': '64px',
        '5xl': '80px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
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
