import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:5197/openapi/v1.json',
  output: 'src/shared/api',
  plugins: [
    '@hey-api/typescript',
    'zod',
    '@hey-api/sdk',
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
      runtimeConfigPath: './hey-api.config.ts',
    },
  ],
});
