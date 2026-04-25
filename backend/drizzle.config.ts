import { defineConfig } from 'drizzle-kit';
import { getConfig, initConfig } from './src/config/index.js';

initConfig();


export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getConfig().DATABASE_URL,
  },
});