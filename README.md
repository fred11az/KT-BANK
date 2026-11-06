This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Déploiement sur Cloudflare (Workers + OpenNext)

Le projet est déployé avec [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) (config : `wrangler.jsonc`, `open-next.config.ts`).

```bash
npm ci
npx wrangler login            # ou export CLOUDFLARE_API_TOKEN=... (en CI)
```

Secrets à définir (une fois) :

```bash
for k in KT_ADMIN_KEY SUPABASE_SERVICE_ROLE_KEY RESEND_API_KEY RESEND_ADMIN_EMAIL CF_WEBHOOK_SECRET; do
  npx wrangler secret put $k
done
```

Les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont inlinées au build : les mettre dans `.env.local` (ou dans les variables de build Cloudflare) avant de déployer.

```bash
npm run preview   # test local dans workerd
npm run deploy    # build + déploiement
```

Le worker d'email (`cloudflare-worker/`) se déploie séparément : `cd cloudflare-worker && npx wrangler deploy`.
