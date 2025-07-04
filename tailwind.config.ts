import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				},
				team4: {
					gold: 'hsl(var(--team4-gold))',
					orange: 'hsl(var(--team4-orange))',
					purple: 'hsl(var(--team4-purple))',
					cyan: 'hsl(var(--team4-cyan))',
					pink: 'hsl(var(--team4-pink))',
					lime: 'hsl(var(--team4-lime))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-holographic': 'var(--gradient-holographic)',
				'gradient-rainbow': 'var(--gradient-rainbow)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'glow-lg': 'var(--shadow-glow-lg)',
				'card': 'var(--shadow-card)',
				'glass': 'var(--shadow-glass)',
				'neon': 'var(--shadow-neon)',
				'holographic': 'var(--shadow-holographic)',
				'rainbow': 'var(--shadow-rainbow)'
			},
			backdropBlur: {
				'xs': '2px',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--primary) / 0.6)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(var(--accent) / 0.3)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 40px hsl(var(--accent) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)',
						transform: 'scale(1.02)'
					}
				},
				'holographic': {
					'0%': { 
						backgroundPosition: '0% 50%',
						transform: 'translateZ(0) rotateY(0deg)',
						filter: 'hue-rotate(0deg)'
					},
					'50%': { 
						backgroundPosition: '100% 50%',
						transform: 'translateZ(10px) rotateY(5deg)',
						filter: 'hue-rotate(180deg)'
					},
					'100%': { 
						backgroundPosition: '0% 50%',
						transform: 'translateZ(0) rotateY(0deg)',
						filter: 'hue-rotate(360deg)'
					}
				},
				'matrix-rain': {
					'0%': { transform: 'translateY(-100vh)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(100vh)', opacity: '0' }
				},
				'levitate': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)',
						boxShadow: '0 10px 30px hsl(var(--primary) / 0.3)'
					},
					'50%': { 
						transform: 'translateY(-20px) rotateX(5deg) rotateY(5deg)',
						boxShadow: '0 30px 60px hsl(var(--primary) / 0.5)'
					}
				},
				'quantum-spin': {
					'0%': { transform: 'rotate(0deg) scale(1)', filter: 'hue-rotate(0deg)' },
					'25%': { transform: 'rotate(90deg) scale(1.1)', filter: 'hue-rotate(90deg)' },
					'50%': { transform: 'rotate(180deg) scale(1)', filter: 'hue-rotate(180deg)' },
					'75%': { transform: 'rotate(270deg) scale(1.1)', filter: 'hue-rotate(270deg)' },
					'100%': { transform: 'rotate(360deg) scale(1)', filter: 'hue-rotate(360deg)' }
				},
				'glitch': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-2px, 2px)' },
					'40%': { transform: 'translate(-2px, -2px)' },
					'60%': { transform: 'translate(2px, 2px)' },
					'80%': { transform: 'translate(2px, -2px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'holographic': 'holographic 4s ease-in-out infinite',
				'matrix-rain': 'matrix-rain 3s linear infinite',
				'levitate': 'levitate 4s ease-in-out infinite',
				'quantum-spin': 'quantum-spin 3s linear infinite',
				'glitch': 'glitch 0.5s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
