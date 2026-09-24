# Mapa del Congreso

Web en Next.js: formulario para cargar organizaciones y landing con mapa filtrable.

## Qué incluye

- `/` — landing + mapa + filtros por área
- `/cargar` — formulario (entrada por URL / QR)
- Persistencia en **Supabase** (recomendado para el evento)
- Sin Supabase: `data/organizaciones.json` (solo desarrollo local)

## Arranque local

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Mapa: [http://localhost:3000](http://localhost:3000)
- Formulario: [http://localhost:3000/cargar](http://localhost:3000/cargar)

## Supabase (producción)

1. Creá un proyecto en [supabase.com](https://supabase.com) (plan Free).
2. Andá a **SQL Editor**, pegá el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecutalo.
3. En **Project Settings → API** copiá:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (opcional) `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (solo server / Vercel, nunca en el cliente)
4. Pegá esas variables en `.env.local` y en Vercel → Environment Variables.

Para ocultar una ficha sin borrarla: en **Table Editor** → `organizaciones` → `visible = false`.

## Deploy

1. Repo en GitHub.
2. Importá el proyecto en [Vercel](https://vercel.com) (Hobby).
3. Configurá las variables de Supabase.
4. Deploy.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run start` — servir el build
