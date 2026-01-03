import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const colors = {
  brand: {
    50: '#e0f7ff',
    100: '#b3e8ff',
    200: '#80d8ff',
    300: '#4dc8ff',
    400: '#26bcff',
    500: '#00b0ff',
    600: '#00a0e6',
    700: '#008ecc',
    800: '#007cb3',
    900: '#005a80',
  },
  tetris: {
    I: '#00f0f0', // Cyan
    O: '#f0f000', // Yellow
    T: '#a000f0', // Purple
    S: '#00f000', // Green
    Z: '#f00000', // Red
    J: '#0000f0', // Blue
    L: '#f0a000', // Orange
    ghost: 'rgba(255, 255, 255, 0.2)',
    grid: '#1a1a2e',
    gridLine: '#16213e',
    background: '#0f0f1a',
  },
  neon: {
    cyan: '#00ffff',
    magenta: '#ff00ff',
    yellow: '#ffff00',
    green: '#00ff00',
    orange: '#ff8800',
    pink: '#ff0088',
  }
}

const fonts = {
  heading: "'Orbitron', sans-serif",
  body: "'Noto Sans KR', sans-serif",
  mono: "'Orbitron', monospace",
}

const styles = {
  global: {
    'html, body': {
      bg: 'tetris.background',
      color: 'white',
      minHeight: '100vh',
      overflow: 'hidden',
    },
    '#root': {
      minHeight: '100vh',
    },
  },
}

const components = {
  Button: {
    baseStyle: {
      fontFamily: 'heading',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    variants: {
      neon: {
        bg: 'transparent',
        color: 'neon.cyan',
        border: '2px solid',
        borderColor: 'neon.cyan',
        boxShadow: '0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 10px rgba(0, 255, 255, 0.1)',
        _hover: {
          bg: 'rgba(0, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.2)',
          transform: 'scale(1.02)',
        },
        _active: {
          transform: 'scale(0.98)',
        },
      },
      neonPink: {
        bg: 'transparent',
        color: 'neon.pink',
        border: '2px solid',
        borderColor: 'neon.pink',
        boxShadow: '0 0 10px rgba(255, 0, 136, 0.3), inset 0 0 10px rgba(255, 0, 136, 0.1)',
        _hover: {
          bg: 'rgba(255, 0, 136, 0.1)',
          boxShadow: '0 0 20px rgba(255, 0, 136, 0.5), inset 0 0 20px rgba(255, 0, 136, 0.2)',
          transform: 'scale(1.02)',
        },
        _active: {
          transform: 'scale(0.98)',
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'rgba(15, 15, 26, 0.95)',
        border: '1px solid',
        borderColor: 'neon.cyan',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
      },
    },
  },
}

const theme = extendTheme({
  config,
  colors,
  fonts,
  styles,
  components,
})

export default theme

