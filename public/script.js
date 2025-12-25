const categorySelect = document.getElementById("filter-category");
const citySelect = document.getElementById("filter-city");
const tagSelect = document.getElementById("filter-tag");
const accessSelect = document.getElementById("filter-access");
const sortSelect = document.getElementById("sort-by");
const searchInput = document.getElementById("search-input");
const resetFiltersBtn = document.getElementById("reset-filters");
const partnerCards = document.getElementById("partner-cards");
const topCards = document.getElementById("top-cards");
const resultsMeta = document.getElementById("results-meta");
const noResults = document.getElementById("no-results");
const globalUpdated = document.getElementById("global-updated");

const detailDrawer = document.getElementById("detail-drawer");
const detailTitle = document.getElementById("detail-title");
const detailUpdated = document.getElementById("detail-updated");
const detailStatus = document.getElementById("detail-status");
const detailTags = document.getElementById("detail-tags");
const detailOffer = document.getElementById("detail-offer");
const detailAccess = document.getElementById("detail-access");
const detailHow = document.getElementById("detail-how");
const detailAddress = document.getElementById("detail-address");
const detailMap = document.getElementById("detail-map");
const detailHours = document.getElementById("detail-hours");
const detailConditions = document.getElementById("detail-conditions");
const detailGroup = document.getElementById("detail-group");
const codeBlock = document.getElementById("code-block");
const codeValue = document.getElementById("code-value");
const showCodeBtn = document.getElementById("show-code");
const copyCodeBtn = document.getElementById("copy-code");

const toast = document.getElementById("toast");

const state = {
  partners: [],
  filters: {
    search: "",
    category: "",
    city: "",
    access: "",
    tag: "",
    sort: "alphabetical",
  },
};

const accessLabels = {
  badge: "Badge",
  code: "Code",
  badge_or_code: "Badge ou code",
};

async function loadPartners() {
  const response = await fetch("data/partners.json");
  if (!response.ok) throw new Error("Impossible de charger les partenaires");
  const payload = await response.json();
  return payload.partners || [];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function setGlobalUpdateDate() {
  if (!state.partners.length) return;
  const latest = state.partners.reduce((acc, partner) => {
    const current = new Date(partner.updated_at);
    return current > acc ? current : acc;
  }, new Date(0));
  globalUpdated.textContent = `Dernière mise à jour : ${latest.toLocaleDateString("fr-FR")}`;
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
  offer.className = "detail-offer";
  offer.textContent = partner.offer_short;

  const meta = document.createElement("div");
  meta.className = "meta";
  const city = document.createElement("span");
  city.className = "tag";
  city.textContent = partner.city;
  const access = document.createElement("span");
  access.className = "tag";
  access.textContent = accessLabels[partner.access_type] || "Accès";
  meta.append(city, access);

  const status = document.createElement("p");
  status.className = `status ${partner.status}`;
  const statusLabel = partner.status === "active" ? "Actif" : partner.status === "test" ? "En test" : "En pause";
  status.textContent = statusLabel;

  const update = document.createElement("p");
  update.className = "meta";
  update.textContent = `Dernière mise à jour : ${formatDate(partner.updated_at)}`;

  const tags = document.createElement("div");
  tags.className = "meta";
  partner.tags.slice(0, 2).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "pill";
    badge.textContent = tag;
    tags.appendChild(badge);
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  const detailBtn = document.createElement("button");
  detailBtn.className = "ghost";
  detailBtn.textContent = "Voir la fiche";
  detailBtn.addEventListener("click", () => openDetail(partner));
  const mapBtn = document.createElement("a");
  mapBtn.className = "cta";
  mapBtn.href = partner.maps_url;
  mapBtn.target = "_blank";
  mapBtn.rel = "noreferrer";
  mapBtn.textContent = "Itinéraire";
  mapBtn.setAttribute("aria-label", `Itinéraire vers ${partner.name}`);
  actions.append(detailBtn, mapBtn);

  card.append(header, offer, meta, status, update, tags, actions);

  if (partner.status === "paused") {
    card.classList.add("is-paused");
    const pauseNote = document.createElement("p");
    pauseNote.className = "meta";
    pauseNote.textContent = "Offre temporairement suspendue. Contactez le support pour être prévenu de la reprise.";
    card.appendChild(pauseNote);
  }

  return card;
}

function renderFeatured() {
  topCards.innerHTML = "";
  const featured = state.partners.filter((p) => p.featured && p.status !== "paused").slice(0, 3);
  if (!featured.length) return;
  featured.forEach((partner) => topCards.appendChild(createPartnerCard(partner)));
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
    .filter((partner) => !state.filters.tag || partner.tags.includes(state.filters.tag))
    .filter((partner) => {
      if (!searchTerm) return true;
      const haystack = [
        partner.name,
        partner.category,
        partner.offer_short,
        partner.offer_details,
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

function openDetail(partner) {
  detailTitle.textContent = partner.name;
  detailOffer.textContent = partner.offer_details || partner.offer_short;
  detailUpdated.textContent = `Dernière mise à jour : ${formatDate(partner.updated_at)}`;
  const statusLabel = partner.status === "active" ? "Actif" : partner.status === "test" ? "En test" : "En pause";
  detailStatus.textContent = `Statut : ${statusLabel}`;

  detailTags.innerHTML = "";
  partner.tags.slice(0, 2).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "pill";
    badge.textContent = tag;
    detailTags.appendChild(badge);
  });

  detailAccess.textContent = `Accès : ${accessLabels[partner.access_type] || "—"}`;
  detailHow.textContent = partner.access_type === "badge" ? "Présentez votre badge en caisse." : partner.access_type === "code" ? "Présentez le code à la caisse ou lors de la réservation." : "Présentez le badge ou le code communiqué.";
  detailAddress.textContent = partner.address;
  detailMap.href = partner.maps_url;
  detailHours.textContent = partner.hours;
  detailConditions.textContent = partner.conditions;
  detailGroup.textContent = partner.group_site ? `Établissement : ${partner.group_site}` : "";

  setupCodeBlock(partner);

  detailDrawer.classList.add("active");
  detailDrawer.focus();
}

function setupCodeBlock(partner) {
  if (partner.code) {
    codeBlock.hidden = false;
    codeValue.textContent = "••••";
    copyCodeBtn.disabled = true;
    showCodeBtn.onclick = () => revealCode(partner.code);
    copyCodeBtn.onclick = () => copyCode(partner.code);
  } else {
    codeBlock.hidden = true;
  }
}

function revealCode(code) {
  codeValue.textContent = code;
  copyCodeBtn.disabled = false;
}

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code);
    showToast("Code copié dans le presse-papier");
  } catch (error) {
    showToast("Copie impossible dans ce navigateur");
  }
}

function closeDetail() {
  detailDrawer.classList.remove("active");
}

document.getElementById("close-drawer").addEventListener("click", closeDetail);
detailDrawer.addEventListener("click", (e) => {
  if (e.target === detailDrawer) closeDetail();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

document.getElementById("report-issue").addEventListener("click", () => showToast("Signalement transmis au support."));
document.getElementById("open-contact").addEventListener("click", () => showToast("Support contacté (Teams / mail)."));
document.getElementById("detail-report").addEventListener("click", () => showToast("Signalement transmis au support."));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && detailDrawer.classList.contains("active")) closeDetail();
});

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
  tagSelect.addEventListener("change", (e) => {
    state.filters.tag = e.target.value;
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
    state.filters = { search: "", category: "", city: "", access: "", tag: "", sort: "alphabetical" };
    categorySelect.value = "";
    citySelect.value = "";
    accessSelect.value = "";
    tagSelect.value = "";
    sortSelect.value = "alphabetical";
    searchInput.value = "";
    renderPartners();
  });
}

async function init() {
  try {
    state.partners = await loadPartners();
    populateFilters();
    setGlobalUpdateDate();
    renderFeatured();
    renderPartners();
    bindFilterEvents();
  } catch (error) {
    resultsMeta.textContent = "Impossible de charger les partenaires.";
    console.error(error);
  }
}

init();
