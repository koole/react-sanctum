import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'o32762',
  e2e: {
    specPattern: 'test/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: false
  },
})
