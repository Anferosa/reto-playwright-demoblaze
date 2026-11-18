import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    screenshot: 'only-on-failure', // las capturas por paso las toman utils/acciones.ts
    video: 'on',
    trace: 'on',
  },

  projects: [
    {
      name: 'saucedemo',                     // lo que hicimos en clase
      testDir: './tests',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'reto',                          // reto integrador: Demoblaze
      testDir: './reto/tests',
      timeout: 60_000,                       // Demoblaze es lento y cada paso toma captura
      retries: 1,                            // el sitio demo a veces tarda en responder
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.demoblaze.com' },
    },
  ],
});
