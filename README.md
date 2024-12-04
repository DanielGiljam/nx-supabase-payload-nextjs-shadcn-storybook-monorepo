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

1. Start [local Supabase stack](https://supabase.com/docs/guides/local-development).

   ```sh
   pnpm supabase start
   ```

1. Navigate to the buckets page in the local Supabase Studio (`http://127.0.0.1:54323/project/default/storage/buckets`) and create a new bucket named `payload` with default settings.

1. Rename `apps/nextjs-app/.env.example` as `apps/nextjs-app/.env` and fill in

   - `S3_ACCESS_KEY_ID`
   - `S3_SECRET_ACCESS_KEY`

   based on values printed by `pnpm supabase status`.

1. Start [Next.js dev server](https://nextjs.org/docs/app/getting-started/installation#run-the-development-server).

   ```sh
   pnpm nx dev nextjs-app
   ```

1. Navigate to `http://localhost:3000/admin` with your web browser and follow the instructions on screen to create a local test admin user.
