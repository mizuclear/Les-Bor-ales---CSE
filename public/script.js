const categorySelect = document.getElementById("filter-category");
const citySelect = document.getElementById("filter-city");
const accessSelect = document.getElementById("filter-access");
const sortSelect = document.getElementById("sort-by");
const searchInput = document.getElementById("search-input");
const resetFiltersBtn = document.getElementById("reset-filters");
const partnerCards = document.getElementById("partner-cards");
const resultsMeta = document.getElementById("results-meta");
const noResults = document.getElementById("no-results");
const infoBarText = document.getElementById("info-bar-text");
const newsList = document.getElementById("news-list");
const newsCount = document.getElementById("news-count");
const summaryActive = document.getElementById("summary-active");
const summaryTest = document.getElementById("summary-test");
const summaryCities = document.getElementById("summary-cities");

const toast = document.getElementById("toast");

const state = {
  partners: [],
  filters: {
    search: "",
    category: "",
    city: "",
    access: "",
    sort: "alphabetical",
  },
  loading: false,
};

const accessLabels = {
  badge: "Badge",
  code: "Code",
  badge_or_code: "Badge ou code",
};

async function loadPartners() {
  const sources = ["./partners.json", "./data/partners.json"];
  for (const source of sources) {
    try {
      const response = await fetch(source);
      if (!response.ok) continue;
      const payload = await response.json();
      return payload.partners || [];
    } catch (error) {
      console.error(`Échec de chargement depuis ${source}`, error);
    }
  }
  throw new Error("Impossible de charger les partenaires");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function setLoading(isLoading) {
  state.loading = isLoading;
  resultsMeta.classList.toggle("muted", isLoading);
  if (isLoading) {
    resultsMeta.textContent = "Chargement des partenaires...";
  }
}

function setGlobalUpdateDate() {
  if (!state.partners.length) return;
  const latest = state.partners.reduce((acc, partner) => {
    const current = new Date(partner.updated_at);
    return current > acc ? current : acc;
  }, new Date(0));
  const dateText = latest.toLocaleDateString("fr-FR");
  infoBarText.textContent = `🔒 Accès réservé aux collaborateurs • MAJ : ${dateText}`;
}

function uniqueValues(partners, key) {
  return Array.from(new Set(partners.map((p) => p[key]).filter(Boolean))).sort((a, b) => a.localeCompare(b, "fr"));
}

function populateFilters() {
  uniqueValues(state.partners, "category").forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  uniqueValues(state.partners, "city").forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

function createPartnerCard(partner) {
  const card = document.createElement("article");
  card.className = "card";
  const header = document.createElement("div");
  header.innerHTML = `<p class="eyebrow">${partner.category}</p><h3>${partner.name}</h3>`;

  const offer = document.createElement("p");
  offer.className = "detail-offer clamp-2";
  offer.textContent = partner.offer_short;

  const meta = document.createElement("div");
  meta.className = "meta";
  const city = document.createElement("span");
  city.className = "tag";
  city.textContent = partner.city;
  const access = document.createElement("span");
  access.className = "tag";
  access.textContent = `Accès : ${accessLabels[partner.access_type] || "—"}`;
  meta.append(city, access);

  const address = document.createElement("p");
  address.className = "address-line";
  address.textContent = partner.address_short || partner.address;

  const status = document.createElement("span");
  status.className = `pill status ${partner.status}`;
  const statusLabel = partner.status === "active" ? "Actif" : partner.status === "test" ? "En test" : "En pause";
  status.textContent = statusLabel;

  const actions = document.createElement("div");
  actions.className = "actions";
  const mapBtn = document.createElement("a");
  mapBtn.className = "cta";
  mapBtn.href = partner.maps_url;
  mapBtn.target = "_blank";
  mapBtn.rel = "noreferrer";
  mapBtn.textContent = "Itinéraire";
  mapBtn.setAttribute("aria-label", `Itinéraire vers ${partner.name}`);
  actions.append(mapBtn);

  const accordion = createAccordion(partner);

  card.append(header, offer, meta, status, address, actions, accordion);
  return card;
}

function createAccordion(partner) {
  const wrapper = document.createElement("div");
  wrapper.className = "accordion";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "accordion-toggle";
  toggle.innerHTML = `<span>Détails</span><span aria-hidden="true">▾</span>`;

  const content = document.createElement("div");
  content.className = "accordion-content";
  content.hidden = true;

  if (partner.access_type === "code" || partner.code) {
    const codeBlock = document.createElement("div");
    codeBlock.className = "code-block";

    const codeLine = document.createElement("div");
    codeLine.className = "code-line";
    const codeLabel = document.createElement("span");
    codeLabel.textContent = "Code d'accès";
    const codeValueEl = document.createElement("span");
    codeValueEl.textContent = "••••";
    codeValueEl.setAttribute("aria-live", "polite");
    codeLine.append(codeLabel, codeValueEl);

    const codeActions = document.createElement("div");
    codeActions.className = "code-actions";
    const showBtn = document.createElement("button");
    showBtn.type = "button";
    showBtn.className = "ghost";
    showBtn.textContent = "Afficher";
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.className = "ghost";
    copyBtn.textContent = "Copier";
    copyBtn.disabled = true;

    showBtn.addEventListener("click", () => {
      codeValueEl.textContent = partner.code ?? "—";
      copyBtn.disabled = !partner.code;
    });
    copyBtn.addEventListener("click", () => copyCode(partner.code));

    codeActions.append(showBtn, copyBtn);
    codeBlock.append(codeLine, codeActions);
    content.appendChild(codeBlock);
  }

  if (partner.hours) {
    const hours = document.createElement("p");
    hours.className = "muted";
    hours.textContent = `Horaires : ${partner.hours}`;
    content.appendChild(hours);
  }

  if (partner.conditions?.length) {
    const cond = document.createElement("ul");
    cond.className = "muted condition-list";
    partner.conditions.slice(0, 3).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      cond.appendChild(li);
    });
    content.appendChild(cond);
  }

  const updated = document.createElement("p");
  updated.className = "muted small";
  updated.textContent = `Mise à jour : ${formatDate(partner.updated_at)}`;
  content.appendChild(updated);

  toggle.addEventListener("click", () => {
    const isHidden = content.hidden;
    content.hidden = !isHidden;
    toggle.classList.toggle("open", !isHidden);
  });

  wrapper.append(toggle, content);
  return wrapper;
}

function renderNews() {
  newsList.innerHTML = "";
  const recent = [...state.partners]
    .filter((partner) => partner.status !== "archived")
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 3);

  newsCount.textContent = recent.length;

  if (!recent.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Aucune offre récente.";
    newsList.appendChild(empty);
    return;
  }

  recent.forEach((partner) => {
    const item = document.createElement("div");
    item.className = "news-item";
    item.innerHTML = `
      <p class="eyebrow">${partner.category}</p>
      <p class="news-title">${partner.name}</p>
      <p class="muted small">MAJ : ${formatDate(partner.updated_at)} • ${partner.city}</p>
    `;
    newsList.appendChild(item);
  });
}

function renderSummary() {
  const activeCount = state.partners.filter((p) => p.status === "active").length;
  const testCount = state.partners.filter((p) => p.status === "test").length;
  const cities = new Set(state.partners.map((p) => p.city).filter(Boolean));

  summaryActive.textContent = activeCount;
  summaryTest.textContent = testCount;
  summaryCities.textContent = cities.size;
}

function renderInsights() {
  renderNews();
  renderSummary();
}

function sortPartners(a, b, mode) {
  if (mode === "recent") {
    return new Date(b.updated_at) - new Date(a.updated_at);
  }
  if (mode === "status") {
    const order = { active: 0, test: 1, paused: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  }
  return a.name.localeCompare(b.name, "fr");
}

function applyFilters() {
  const searchTerm = state.filters.search.toLowerCase();

  return state.partners
    .filter((partner) => partner.status !== "archived")
    .filter((partner) => !state.filters.category || partner.category === state.filters.category)
    .filter((partner) => !state.filters.city || partner.city === state.filters.city)
    .filter((partner) => !state.filters.access || partner.access_type === state.filters.access)
    .filter((partner) => {
      if (!searchTerm) return true;
      const haystack = [
        partner.name,
        partner.category,
        partner.offer_short,
        partner.offer_details || "",
        partner.city,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchTerm);
    })
    .sort((a, b) => sortPartners(a, b, state.filters.sort));
}

function renderPartners() {
  const filtered = applyFilters();
  partnerCards.innerHTML = "";
  resultsMeta.textContent = `${filtered.length} partenaire(s)`;
  if (!filtered.length) {
    noResults.hidden = false;
    return;
  }
  noResults.hidden = true;
  filtered.forEach((partner) => partnerCards.appendChild(createPartnerCard(partner)));
}

async function copyCode(code) {
  if (!code) {
    showToast("Aucun code disponible");
    return;
  }
  try {
    await navigator.clipboard.writeText(code);
    showToast("Code copié dans le presse-papier");
  } catch (error) {
    showToast("Copie impossible dans ce navigateur");
  }
}

document.getElementById("report-issue").addEventListener("click", () => showToast("Signalement transmis au support."));
document.getElementById("open-contact").addEventListener("click", () => showToast("Support contacté (Teams / mail)."));

function bindFilterEvents() {
  categorySelect.addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    renderPartners();
  });
  citySelect.addEventListener("change", (e) => {
    state.filters.city = e.target.value;
    renderPartners();
  });
  accessSelect.addEventListener("change", (e) => {
    state.filters.access = e.target.value;
    renderPartners();
  });
  sortSelect.addEventListener("change", (e) => {
    state.filters.sort = e.target.value;
    renderPartners();
  });
  searchInput.addEventListener("input", (e) => {
    state.filters.search = e.target.value.trim();
    renderPartners();
  });
  resetFiltersBtn.addEventListener("click", () => {
    state.filters = { search: "", category: "", city: "", access: "", sort: "alphabetical" };
    categorySelect.value = "";
    citySelect.value = "";
    accessSelect.value = "";
    sortSelect.value = "alphabetical";
    searchInput.value = "";
    renderPartners();
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

async function init() {
  try {
    setLoading(true);
    state.partners = await loadPartners();
    populateFilters();
    setGlobalUpdateDate();
    renderInsights();
    renderPartners();
    bindFilterEvents();
  } catch (error) {
    resultsMeta.textContent = "Impossible de charger les partenaires.";
    console.error(error);
    showToast("Erreur lors du chargement des partenaires.");
  } finally {
    setLoading(false);
  }
}

init();
