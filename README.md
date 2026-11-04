# devdebt1 car garage

This is my small portfolio for cars I bring from Assetto Corsa into Roblox Studio. It's a static site: the pages are HTML and CSS, and `site.js` fills in the brand list and car galleries.

## What is where

| File or folder | What it does |
| --- | --- |
| `index.html` | Home page, intro, hero photo, and featured cars |
| `brands.html` | Clickable list of makes |
| `brand-bmw.html`, `brand-nissan.html`, `brand-toyota.html` | One gallery page for each make |
| `buy.html` | Import options and request link |
| `contact.html` | Discord request form |
| `site.js` | Brand and car details, gallery rendering, navigation, and form behavior |
| `archive.css` | Home, Brands, brand pages, and Buy Options styles |
| `portfolio.css`, `contact.css` | Existing Contact page styling; not used by the archive pages |
| `style.css` | Older stylesheet retained in the repository |
| `images/` | Place your own car screenshots and photos here |
| `worker/index.js` | Cloudflare relay that forwards requests to Discord |

## Add a car to a brand

1. Open `site.js` and find the make in the `BRANDS` array.
2. Inside that make's `cars: [ ... ]` list, copy one car object and edit its fields:

   ```js
   {
     name: "Honda NSX",
     description: "A short note in your own words.",
     image: "images/honda-nsx.jpg",
     featured: true
   }
   ```

3. Keep a comma between car objects. Set `featured: true` if you want the car on the home page. Other cars can leave out the `featured` line.
4. Save `site.js` and refresh the page. The brand gallery and car count update from this list.

The `image` value can be a file path in this repository, such as `images/honda-nsx.jpg`, or a full image URL. Local files are a better long-term choice: they stay under your control and don't depend on another site. Use a short description that sounds like you; it doesn't need to read like an advert.

## Add a brand

Each brand needs one entry in `site.js` and one HTML page. Use a lowercase slug with hyphens if needed. For example, `honda` becomes `brand-honda.html`.

1. Copy an existing page such as `brand-toyota.html` and rename the copy to `brand-honda.html`.
2. In the new file, update the page title, description, heading, the `Garage / ...` label, and the `Brand file / ...` number. The number is just a display label; it does not control the site.
3. Find `data-brand-page="toyota"` and change it to `data-brand-page="honda"`. That value must match the slug you add in the next step.
4. Add this object to the `BRANDS` array in `site.js`:

   ```js
   {
     name: "Honda",
     slug: "honda",
     description: "A short note about the Hondas in this collection.",
     image: "images/honda-nsx.jpg",
     cars: [
       {
         name: "Honda NSX",
         description: "A note about this particular car.",
         image: "images/honda-nsx.jpg",
         featured: true
       }
     ]
   }
   ```

5. Add more car objects inside `cars` as you import them. The brand image is used in the Brands list; each car's own `image` is used in its gallery.
6. Open `brands.html`, click the new brand row, and check its car names and pictures. The row appears automatically when the JavaScript entry is saved.

The full filename, slug, and `data-brand-page` value need to agree: `brand-honda.html`, `honda`, and `data-brand-page="honda"`.

## Add or replace pictures

1. Make an `images` folder next to `index.html` if it isn't there already.
2. Copy your image into that folder. Give it a simple filename, such as `supra-night.jpg`; avoid spaces and special characters.
3. In `site.js`, update the car's `image` path:

   ```js
   image: "images/supra-night.jpg"
   ```

4. To change the small image on the Brands page, update that make's top-level `image` value too.
5. To change the home-page photo, replace the `src` on the `<img>` inside `<figure class="home-photo">` in `index.html`.

The photos currently in the gallery are temporary stock-image references, not Roblox Studio captures. Replace them with your own screenshots before presenting the gallery as examples of finished work. Landscape screenshots work well; around 1200 pixels wide is plenty. Compress large PNG screenshots to JPG or WebP before adding them so the pages stay quick to load. Use images you made or have permission to publish. The image `alt` text for gallery cars comes from the car's `name`.

## Change the look or page text

- Colors, navigation, footer, spacing, and typography for Home, Brands, brand pages, and Buy Options are in `archive.css`.
- `contact.html` keeps its existing `portfolio.css` and `contact.css` stylesheets. Its form behavior stays in `site.js`; leave `setupRequestForm` and `REQUEST_ENDPOINT` unchanged.
- The home intro and home-page photo caption are in `index.html`.
- The words on each brand page are in its `brand-*.html` file.
- Request options and copy are in `buy.html`; the Contact form is separate and unchanged.
- Navigation is repeated in each HTML page so it works without a build step. If you rename or add a page, update the nav links in the relevant files.

## Preview and publish

You can open an HTML file in a browser to check it, or use the local preview in your editor. Check both a desktop and narrow/mobile width, and click through every brand page after changing the catalog.

This repository is named `devdebt1`, so its GitHub Pages project URL is:

**https://devdebt1.github.io/devdebt1/**

The shorter `https://devdebt1.github.io/` address is for a separate repository named `devdebt1.github.io`. To check or change publishing, open the repository on GitHub and go to **Settings → Pages**. Confirm which branch and folder Pages is publishing, then make sure your changes are committed and pushed to that source. If the repository uses pull requests, merge your changes into the configured branch. GitHub Pages usually updates a few minutes after the source branch changes.

## Discord request form

The form posts to the Cloudflare Worker at `https://devdebt1-contact.devdebt1.workers.dev`. The Worker builds the Discord embed and reads `DISCORD_WEBHOOK_URL` from an encrypted Cloudflare secret. The webhook must not be added to `site.js`, an HTML file, or any other public repository file.

The Worker is already deployed separately from GitHub Pages. If you edit `worker/index.js`, publish that change to the existing `devdebt1-contact` Worker in the Cloudflare dashboard as well. If you rotate the Discord webhook, replace the `DISCORD_WEBHOOK_URL` secret in that Worker’s **Settings → Variables and Secrets**. Keep the `CONTACT_LIMITER` binding in place; it caps requests at five per visitor per minute.
