import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		open: true,
		host: true,
		cors: true,
	},
	envDir: '../',
	envPrefix: ['VITE_', 'NELIOS_', 'BACKEND_'],
	build: {
		outDir: '../dist/frontend'
	}
})