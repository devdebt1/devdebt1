// Add makes, cars, photos, and optional OBJ/MTL previews here.
const REQUEST_ENDPOINT = "https://devdebt1-contact.devdebt1.workers.dev";

const BRANDS = [
  {
    name: "BMW",
    slug: "bmw",
    description: "A couple of BMWs from the collection.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    cars: [
      {
        name: "BMW M3 E46",
        description: "A car I wanted to see cruising around a Roblox map.",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
        featured: true
      },
      {
        name: "BMW M4",
        description: "A more recent addition to the garage.",
        image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    name: "Dodge",
    slug: "dodge",
    description: "A Viper ACR Extreme Package from the 2016 model year.",
    cars: [
      {
        name: "Dodge Viper ACR '16 Extreme Package",
        description: "Full-size OBJ preview. Neutral materials are used because the supplied model did not include its original MTL or textures.",
        model: {
          obj: "images/models/dodge-viper-acr/hwa_viper_acr.obj.gz",
          mtl: "images/models/dodge-viper-acr/preview.mtl",
          objCompressed: true
        },
        featured: true
      }
    ]
  },
  {
    name: "Toyota",
    slug: "toyota",
    description: "A couple of Toyotas I have been working on.",
    image: "https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&w=1000&q=80",
    cars: [
      {
        name: "Toyota Supra MK4",
        description: "The '90s coupe is one of my favourite shapes.",
        image: "https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&w=1000&q=80",
        featured: true
      },
      {
        name: "Toyota AE86",
        description: "Small, light, and right at home on a winding road.",
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    name: "Nissan",
    slug: "nissan",
    description: "Two Nissans, with more room for the next one.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
    cars: [
      {
        name: "Nissan Skyline R34",
        description: "A Skyline I have always wanted in a Roblox project.",
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
        featured: true
      },
      {
        name: "Nissan 350Z",
        description: "A simple rear-wheel-drive coupe with a good shape.",
        image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  }
];

function carCard(car, brand) {
  const hasModel = Boolean(car.model && car.model.obj && car.model.mtl);
  const modelAction = hasModel
    ? `<button class="car-card-model" type="button" data-model-view data-model-name="${escapeHtml(car.name)}" data-model-obj="${escapeHtml(car.model.obj)}" data-model-mtl="${escapeHtml(car.model.mtl)}" data-model-compressed="${Boolean(car.model.objCompressed)}">View 3D</button>`
    : '<span class="car-card-model car-card-model--photo">Photo</span>';
  const image = car.image
    ? `<img class="car-card-image" src="${escapeHtml(car.image)}" alt="Temporary reference photo for ${escapeHtml(car.name)}" loading="lazy">`
    : `<div class="car-card-preview-placeholder" aria-label="3D model available for ${escapeHtml(car.name)}"><span>3D MODEL</span><strong>OBJ</strong><small>Open the viewer to rotate</small></div>`;

  return `
    <article class="car-card">
      ${image}
      <div class="car-card-copy">
        <div class="car-card-meta"><span>${escapeHtml(brand.name)}</span><span>${hasModel ? "OBJ / MTL" : "PHOTO"}</span></div>
        <h3>${escapeHtml(car.name)}</h3>
        <p>${escapeHtml(car.description)}</p>
        <div class="car-card-actions">
          ${modelAction}
          <a class="car-card-contact" href="contact.html">Ask about this →</a>
        </div>
      </div>
    </article>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderBrands() {
  const container = document.querySelector("[data-brand-list]");
  if (!container) return;

  container.innerHTML = BRANDS.map(brand => {
    const image = brand.image
      ? `<img src="${brand.image}" alt="Temporary reference photo for ${brand.name}" loading="lazy">`
      : `<div class="brand-card-preview-placeholder" aria-label="3D car model preview available"><span>3D MODEL</span><strong>${brand.cars.length} ${brand.cars.length === 1 ? "car" : "cars"}</strong></div>`;
    return `
    <article class="brand-card">
      <a href="brand-${brand.slug}.html" aria-label="View ${brand.name} cars">
        ${image}
      </a>
      <div class="brand-card-copy">
        <h2>${brand.name}</h2>
        <span class="brand-count">${brand.cars.length} ${brand.cars.length === 1 ? "car" : "cars"}</span>
        <p>${brand.description}</p>
        <a href="brand-${brand.slug}.html">View brand →</a>
      </div>
    </article>`;
  }).join("");
}

function renderFeaturedCars() {
  const container = document.querySelector("#featured-cars");
  if (!container) return;

  const brands = BRANDS.filter(brand => brand.cars.some(car => car.featured));
  container.innerHTML = brands.map(brand => {
    const car = brand.cars.find(item => item.featured);
    const image = car.image
      ? `<img src="${escapeHtml(car.image)}" alt="Temporary reference photo for ${escapeHtml(car.name)}" loading="lazy">`
      : `<div class="featured-model-placeholder" role="img" aria-label="Rotatable 3D model available for ${escapeHtml(car.name)}">OBJ</div>`;
    return `
      <article class="featured-item">
        ${image}
        <div>
          <p>${escapeHtml(brand.name)}</p>
          <h3>${escapeHtml(car.name)}</h3>
          <a href="brand-${brand.slug}.html">View brand →</a>
        </div>
      </article>`;
  }).join("");
}

function renderCurrentCars() {
  const container = document.querySelector("#latest-cars");
  if (!container) return;

  const cars = BRANDS.flatMap(brand => brand.cars.map(car => ({ car, brand })));
  container.innerHTML = cars.map(({ car, brand }) => carCard(car, brand)).join("");
}

function renderBrandPage() {
  const container = document.querySelector("[data-brand-page]");
  if (!container) return;

  const brand = BRANDS.find(item => item.slug === container.dataset.brandPage);
  if (!brand) {
    container.innerHTML = '<p class="gallery-empty">This brand is not in the garage yet.</p>';
    return;
  }

  container.innerHTML = brand.cars.map(car => carCard(car, brand)).join("");
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#site-menu");
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    menu.classList.remove("is-open");
  }

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    menu.classList.toggle("is-open", !isOpen);
  });
  menu.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });
}

function setupModelPreviews() {
  if (!document.querySelector("[data-model-view]")) return;

  const dialog = document.createElement("dialog");
  dialog.className = "model-dialog";
  dialog.setAttribute("aria-labelledby", "model-dialog-title");
  dialog.setAttribute("aria-describedby", "model-dialog-help");
  dialog.innerHTML = `
    <div class="model-dialog-header">
      <div>
        <p class="eyebrow">OBJ / MTL preview</p>
        <h2 id="model-dialog-title"></h2>
      </div>
      <button class="model-dialog-close" type="button" aria-label="Close 3D preview">Close</button>
    </div>
    <div class="model-stage"></div>
    <p class="model-status" role="status" aria-live="polite"></p>
    <p class="model-dialog-help" id="model-dialog-help">Drag to rotate. Scroll or pinch to zoom. Right-drag or two-finger drag to pan.</p>`;
  document.body.append(dialog);

  const stage = dialog.querySelector(".model-stage");
  const status = dialog.querySelector(".model-status");
  let activeViewer = null;
  let requestId = 0;

  function disposeActiveViewer() {
    requestId += 1;
    if (activeViewer) {
      activeViewer.dispose();
      activeViewer = null;
    }
    stage.replaceChildren();
  }

  dialog.querySelector(".model-dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", disposeActiveViewer);
  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-model-view]");
    if (!button) return;

    disposeActiveViewer();
    const currentRequest = ++requestId;
    dialog.querySelector("#model-dialog-title").textContent = button.dataset.modelName;
    status.hidden = false;
    status.textContent = "Loading model and materials…";
    if (!dialog.open) dialog.showModal();

    try {
      const { createObjViewer } = await import("./model-viewer.js");
      const viewer = await createObjViewer(stage, button.dataset.modelObj, button.dataset.modelMtl, {
        compressedObj: button.dataset.modelCompressed === "true"
      });
      if (currentRequest !== requestId || !dialog.open) {
        viewer.dispose();
        return;
      }

      activeViewer = viewer;
      status.hidden = true;
    } catch (error) {
      if (currentRequest !== requestId || !dialog.open) return;
      console.error("Could not load car model preview:", error);
      status.textContent = "Couldn't load this preview. Check the OBJ, MTL, and texture paths; the viewer also needs WebGL and an internet connection.";
    }
  });
}

function setupRequestForm() {
  const form = document.querySelector("#request-form");
  if (!form) return;

  const status = document.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const request = Object.fromEntries(values.entries());

    submitButton.disabled = true;
    status.dataset.state = "";
    status.textContent = "Sending your request…";

    try {
      const response = await fetch(REQUEST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });

      if (!response.ok) throw new Error(`Request relay returned ${response.status}`);
      form.reset();
      status.dataset.state = "success";
      status.textContent = "Request sent. Thanks — I'll get back to you on Discord.";
    } catch (error) {
      console.error("Could not send car import request:", error);
      status.dataset.state = "error";
      status.textContent = "Couldn't send your request. Please try again in a moment.";
    } finally {
      submitButton.disabled = false;
    }
  });
}

document.querySelectorAll("[data-year]").forEach(element => {
  element.textContent = new Date().getFullYear();
});
renderBrands();
renderFeaturedCars();
renderCurrentCars();
renderBrandPage();
setupNavigation();
setupModelPreviews();
setupRequestForm();
