# Guscott Engineering — website

Marketing site for **Guscott Engineering Electronics** — custom and refurbished
computers built and bench-tested by Ayden in Atlanta, GA.

It's a single landing page implemented from the Guscott Engineering design system.
**Zero build step** — plain HTML/CSS/JS that runs on any static host.

## Run locally

Open `index.html` in a browser, or serve the folder (recommended, so the image
paths and fonts resolve cleanly):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

It's fully static — drop the whole folder on any static host:

- **Vercel** — `npx vercel` (or import the repo). No config needed.
- **Netlify** — drag-and-drop the folder, or connect the repo.
- **GitHub Pages** — push and enable Pages on the branch.

External dependencies are loaded from CDNs at runtime: Google Fonts
(Comfortaa + JetBrains Mono) and [Lucide](https://lucide.dev) icons.

## Structure

```
index.html              # the page
app.js                  # thumbnail galleries, smooth-scroll, icon init
styles/
  tokens/               # design-system tokens (colors, type, spacing, radii,
                        #   geometry, elevation) — copied from the design system
  components.css        # Button / Card / Badge / SpecRow as CSS classes
  site.css              # page layout + responsive grids + placeholder styles
images/                 # 14 product photos (IMG_3386–3399)
assets/converging-fields.svg   # hero / contact backdrop
```

## Photo placeholders

Six on-brand placeholder frames are ready for real photos:

- **Previously Built** (`#portfolio`) — 5 frames for the Intel Arc build.
- **About Ayden** (`#about`) — 1 frame for a workspace shot.

To fill one, drop a photo into `images/` and replace the matching
`<div class="ge-slot …">…</div>` in `index.html` with:

```html
<img src="images/your-photo.jpeg" alt="…"
     class="ge-cut" style="width:100%;aspect-ratio:4/5;object-fit:cover;display:block;">
```

(Use `aspect-ratio:4/3` for the About workspace frame.)

## Editing content

Prices, specs, copy, and the contact email (`Guscottengineering@gmail.com`) live
directly in `index.html`. The two product galleries read their images from the
thumbnail `<img>` tags, so adding/removing a machine photo is just editing that
card's thumbnail row.
