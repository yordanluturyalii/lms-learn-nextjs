/** @type {import('tailwindcss').Config} */

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{ts,tsx,mdx}"
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
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
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
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
                animation: {
                    grid: "grid 15s linear infinite",
                    shimmer: "shimmer 8s infinite",
                    gradient: "gradient 8s linear infinite",
                    meteor: "meteor 5s linear infinite",
                    marquee: "marquee var(--duration) linear infinite",
                    "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
                    "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
                },
                keyframes: {
                    grid: {
                        "0%": { transform: "translateY(-50%)" },
                        "100%": { transform: "translateY(0)" },
                    },
                    shimmer: {
                        "0%, 90%, 100%": {
                            "background-position": "calc(-100% - var(--shimmer-width)) 0",
                        },
                        "30%, 60%": {
                            "background-position": "calc(100% + var(--shimmer-width)) 0",
                        },
                    },
                    gradient: {
                        to: {
                            backgroundPosition: "var(--bg-size) 0",
                        },
                    },
                    meteor: {
                        "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
                        "70%": { opacity: "1" },
                        "100%": {
                            transform: "rotate(215deg) translateX(-500px)",
                            opacity: "0",
                        },
                    },
                    marquee: {
                        from: { transform: "translateX(0)" },
                        to: { transform: "translateX(calc(-100% - var(--gap)))" },
                    },
                    "border-beam": {
                        "100%": {
                            "offset-distance": "100%",
                        },
                    },
                    "shine-pulse": {
                        "0%": {
                            "background-position": "0% 0%",
                        },
                        "50%": {
                            "background-position": "100% 100%",
                        },
                        to: {
                            "background-position": "0% 0%",
                        },
                    },
                },
            }
        }
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;