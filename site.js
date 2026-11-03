// Add brands and cars here. Use image URLs or paths to files in the repository.
const REQUEST_ENDPOINT = "https://devdebt1-contact.devdebt1.workers.dev";

const BRANDS = [
  {
    name: "BMW",
    slug: "bmw",
    description: "A mix of M cars and everyday icons.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    cars: [
      {
        name: "BMW M3 E46",
        description: "A classic driver's car, brought into Roblox Studio.",
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
        featured: true
      },
      {
        name: "BMW M4",
        description: "A modern M car, set up for the Roblox road.",
        image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    name: "Toyota",
    slug: "toyota",
    description: "Japanese legends, from touge to track.",
    image: "https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&w=1000&q=80",
    cars: [
      {
        name: "Toyota Supra MK4",
        description: "An unmistakable '90s icon, ready for Roblox.",
        image: "https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&w=1000&q=80",
        featured: true
      },
      {
        name: "Toyota AE86",
        description: "Light, simple, and made for a winding road.",
        image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  },
  {
    name: "Nissan",
    slug: "nissan",
    description: "A few favourites from the Nissan lineup.",
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
    cars: [
      {
        name: "Nissan Skyline R34",
        description: "A familiar silhouette, imported for Roblox Studio.",
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80",
        featured: true
      },
      {
        name: "Nissan 350Z",
        description: "A rear-wheel-drive coupe with plenty of character.",
        image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  }
];

function carCard(car, brand, index) {
  return `
    <article class="car-card">
      <div class="car-image">
        <img src="${car.image}" alt="${car.name}" loading="lazy">
        <span class="card-index">${String(index + 1).padStart(2, "0")}</span>
      </div>
      <div class="car-info">
        <div class="car-meta"><span>${brand.name}</span><span>Roblox Studio</span></div>
        <h3>${car.name}</h3>
        <p>${car.description}</p>
      </div>
    </article>`;
}

function renderBrands() {
  const container = document.querySelector("[data-brand-list]");
  if (!container) return;

  container.innerHTML = BRANDS.map((brand, index) => `
    <a class="brand-card" href="brand-${brand.slug}.html">
      <div class="brand-image">
        <img src="${brand.image}" alt="${brand.name} car" loading="lazy">
        <span class="card-index">${String(index + 1).padStart(2, "0")} / ${String(BRANDS.length).padStart(2, "0")}</span>
      </div>
      <div class="brand-info">
        <div><h3>${brand.name}</h3><p>${brand.cars.length} ${brand.cars.length === 1 ? "IMPORT" : "IMPORTS"}</p></div>
        <span class="brand-arrow" aria-hidden="true">↗</span>
      </div>
    </a>`).join("");
}

function renderFeaturedCars() {
  const container = document.querySelector("#featured-cars");
  if (!container) return;

  const cars = BRANDS.flatMap(brand => brand.cars
    .filter(car => car.featured)
    .map(car => ({ car, brand })));
  container.innerHTML = cars.map(({ car, brand }, index) => carCard(car, brand, index)).join("");
}

function renderBrandPage() {
  const container = document.querySelector("[data-brand-page]");
  if (!container) return;

  const brand = BRANDS.find(item => item.slug === container.dataset.brandPage);
  if (!brand) {
    container.innerHTML = '<p class="gallery-empty">This brand is not in the garage yet.</p>';
    return;
  }

  container.innerHTML = brand.cars.map((car, index) => carCard(car, brand, index)).join("");
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
renderBrandPage();
setupNavigation();
setupRequestForm();
