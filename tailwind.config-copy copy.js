/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./style/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			primaryDark: '#1a1a1a',
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			grayBg: '#F0F2F2',
  			grayText: '#828282',
  			grayOutline: '#C4C4C4',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		boxShadow: {
  			shadowSm: '0 0 1px rgba(25, 28, 29, 0.1), 0 1px 2px rgba(25, 28, 29, 0.1), 0 1px 3px rgba(25, 28, 29, 0.1)',
  			shadowBig: '0 0 4px rgba(25, 28, 29, 0.1), 0 4px 12px rgba(25, 28, 29, 0.1), 4px 4px 16px rgba(240, 242, 242, 0.1), -4px 4px 16px rgba(130, 130, 130, 0.1), -4px -4px 16px rgba(196, 196, 196, 0.1), 4px -4px 16px rgba(25, 28, 29, 0.1);'
  		},
  		gridTemplateColumns: {
  			'14': 'repeat(14, minmax(0, 1fr))',
  			variant: '2rem 1fr minmax(1.75rem, min-content)'
  		},
  		fontFamily: {
  			oswald: [
  				'var(--font-oswald, Oswald)',
  				'sans-serif'
  			],
  			roboto: [
  				'var(--font-roboto, Roboto)',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			xxs: '10px'
  		},
  		transitionProperty: {
  			height: 'height'
  		},
  		keyframes: {
  			shake: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'25%, 75%': {
  					transform: 'translateY(-5px)'
  				},
  				'50%': {
  					transform: 'translateY(5px)'
  				}
  			}
  		},
  		animation: {
  			shake: 'shake 0.5s ease-in-out both'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
