/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          paper: '#1a1a1a',
          border: '#2d2d2d',
          text: {
            primary: '#ffffff',
            secondary: '#a3a3a3',
          },
          background: '#121212',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gray.900'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
            },
            p: {
              color: theme('colors.gray.900'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
            },
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.primary.500'),
              },
            },
            strong: {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
            blockquote: {
              color: theme('colors.gray.700'),
              borderLeftColor: theme('colors.gray.300'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.400'),
            },
            'ol > li::before': {
              color: theme('colors.gray.600'),
            },
            hr: {
              borderColor: theme('colors.gray.200'),
            },
            code: {
              color: theme('colors.gray.900'),
              backgroundColor: theme('colors.gray.100'),
              padding: theme('spacing.1'),
              borderRadius: theme('borderRadius.md'),
              fontWeight: '500',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              border: 'none',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.100'),
              overflow: 'auto',
              padding: theme('spacing.4'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
              borderRadius: theme('borderRadius.lg'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.100'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.100'),
            },
            p: {
              color: theme('colors.gray.100'),
            },
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.gray.700'),
            },
            'ul > li::before': {
              backgroundColor: theme('colors.gray.600'),
            },
            'ol > li::before': {
              color: theme('colors.gray.400'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            code: {
              color: theme('colors.gray.100'),
              backgroundColor: theme('colors.gray.800'),
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
            },
            thead: {
              color: theme('colors.gray.100'),
              borderBottomColor: theme('colors.gray.700'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  safelist: [
    'prose',
    'prose-lg',
    'prose-primary',
    'prose-invert',
    {
      pattern: /bg-(primary|gray|red|green)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'dark'],
    },
    {
      pattern: /text-(primary|gray|red|green)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'dark'],
    },
    {
      pattern: /border-(primary|gray|red|green)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'dark'],
    },
    {
      pattern: /prose-(headings|p|a|blockquote|strong|ol|ul|hr):.*/,
      variants: ['dark'],
    },
  ],
}