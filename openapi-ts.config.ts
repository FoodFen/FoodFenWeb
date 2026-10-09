import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: process.env.OPENAPI_URL ?? 'http://localhost:8000/openapi.json',
  output: 'src/api/generated',
  plugins: [
    '@hey-api/client-axios',
    '@hey-api/typescript',
    '@hey-api/sdk',
    { name: '@tanstack/react-query', queryOptions: true, mutationOptions: true },
  ],
})
