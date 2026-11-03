# devdebt1 — Portfolio

A static portfolio for Assetto Corsa car imports converted for Roblox Studio.

## Pages

- `index.html` — Home and featured imports
- `brands.html` — Brand directory
- `brand-bmw.html`, `brand-toyota.html`, `brand-nissan.html` — Brand galleries
- `buy.html` — Import options
- `contact.html` — Discord request form

## Publish with GitHub Pages

1. Push the files to the `devdebt1.github.io` repository.
2. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.
3. Visit [https://devdebt1.github.io](https://devdebt1.github.io).

## Edit the garage

Brands and cars are listed near the top of `site.js` in the `BRANDS` array. Each car has a name, description, and image path or URL. Mark a car with `featured: true` to show it on the home page. To use your own pictures, put them in the repository (for example, `images/supra.jpg`) and set the car's `image` to that path.

To add a brand, add its entry to `BRANDS`, then copy an existing `brand-*.html` page, change the page title and copy, set its `data-brand-page` value to the new brand's slug, and link to it as `brand-your-slug.html`. The Brands page cards are generated from `BRANDS`.

## Connect the contact form

The site stays static on GitHub Pages; a Cloudflare Worker relays requests to Discord so the webhook is not included in the website files.

1. In Cloudflare, create a Worker named `devdebt1-contact` and replace its starter code with `worker/index.js`.
2. In the Worker **Settings → Variables and Secrets**, add `DISCORD_WEBHOOK_URL` as a secret. Paste a newly generated Discord webhook into Cloudflare's secret field; do not put it in a file or share it.
3. In **Settings → Bindings**, add a **Rate limiter** binding named `CONTACT_LIMITER`, using namespace ID `1001`, limit `5`, and period `60 seconds`.
4. The Worker endpoint is set in `site.js` to `https://devdebt1-contact.devdebt1.workers.dev`. If you choose a different Worker name, update that URL to match.
5. Publish the site to GitHub Pages.

The Worker only allows requests from `https://devdebt1.github.io`, validates the submitted fields, limits the body size, disables Discord mentions, and rate-limits each visitor IP to five requests per minute. Its webhook secret is stored by Cloudflare and is never sent to the browser. The previous webhook was already exposed in the old site source, so revoke it in Discord and create a replacement before setting the Worker secret.
