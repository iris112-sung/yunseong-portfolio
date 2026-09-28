# Yunseong Bae Portfolio

React + Vite portfolio with a local paper-review archive.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Production build: `npm run build`.
UI verification (requires Google Chrome): `node scripts/check-ui.mjs`.
Intro and carousel verification: `node scripts/check-experience.mjs`.

The current experience uses the official React Bits LatticeLoader and
FlexCarousel components, with a Three.js centerpiece and scroll-linked motion.
Earlier React Bits components are retained in the source directory.
Source revision and license are recorded in `src/components/react-bits/NOTICE.md`.

## Deployment

Repository: https://github.com/iris112-sung/yunseong-portfolio

Production: https://iris112-sung.github.io/yunseong-portfolio/

GitHub Actions builds and deploys `dist/` to GitHub Pages on every push to `main`.
The workflow can also be started manually from the Actions tab.
Vercel is not used by this deployment.

`blog/` is a separate checkout of the existing GitHub Pages repository.
Notion source exports in `content/notion/` are local-only and ignored by Git.
`npm run import:reviews` converts that export into blog posts and the React
archive, downloading expiring Notion images into permanent local assets.
