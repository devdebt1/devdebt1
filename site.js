// Add makes and cars here. Put your own pictures in images/ and use their file paths.
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
  return `
    <article class="catalog-row">
      <img class="catalog-thumb" src="${car.image}" alt="Temporary reference photo for ${car.name}" loading="lazy">
      <span class="catalog-label">${brand.name}</span>
      <h3 class="catalog-name">${car.name}</h3>
      <p class="catalog-description">${car.description}</p>
      <a class="catalog-action" href="contact.html">Ask about this →</a>
    </article>`;
}

function renderBrands() {
  const container = document.querySelector("[data-brand-list]");
  if (!container) return;

  container.innerHTML = BRANDS.map(brand => `
    <article class="brand-card">
      <a href="brand-${brand.slug}.html" aria-label="View ${brand.name} cars">
        <img src="${brand.image}" alt="Temporary reference photo for ${brand.name}" loading="lazy">
      </a>
      <div class="brand-card-copy">
        <h2>${brand.name}</h2>
        <span class="brand-count">${brand.cars.length} ${brand.cars.length === 1 ? "car" : "cars"}</span>
        <p>${brand.description}</p>
        <a href="brand-${brand.slug}.html">View brand →</a>
      </div>
    </article>`).join("");
}

function renderFeaturedCars() {
  const container = document.querySelector("#featured-cars");
  if (!container) return;

  const brands = BRANDS.filter(brand => brand.cars.some(car => car.featured));
  container.innerHTML = brands.map(brand => {
    const car = brand.cars.find(item => item.featured);
    return `
      <article class="featured-item">
        <img src="${car.image}" alt="Temporary reference photo for ${car.name}" loading="lazy">
        <div>
          <p>${brand.name}</p>
          <h3>${car.name}</h3>
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
setupRequestForm();
