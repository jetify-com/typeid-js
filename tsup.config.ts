import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  noExternal: [
    'uuidv7',
  ],
  sourcemap: true
});
