# Nx Supabase Payload CMS Next.js shadcn/ui Storybook monorepo

A template monorepo for a stack with

- [Nx](https://nx.dev)
- [Supabase](https://supabase.com/)
- [Payload CMS](https://payloadcms.com/)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Storybook](https://storybook.js.org/)

## Local development

Ensure you have Node.js v20.9 or newer installed and [Corepack enabled](https://nodejs.org/api/corepack.html#enabling-the-feature) + Docker installed.

1. Install dependencies.
   ```sh
   pnpm install
   ```
2. Start [local Supabase stack](https://supabase.com/docs/guides/local-development).
   ```sh
   pnpm supabase start
   ```
3. Start [Next.js dev server](https://nextjs.org/docs/app/getting-started/installation#run-the-development-server).
   ```sh
   pnpm nx dev nextjs-app
   ```
4. Navigate to `http://localhost:3000/admin` with your web browser and follow the instructions on screen to create a local test admin user.
