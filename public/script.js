const categories = [
  "Food & boissons",
  "Bien-être & beauté",
  "Loisirs & sorties",
  "Pratique",
  "Auto & mobilité",
  "Sport & santé",
];

const partners = [
  {
    name: "Café des Dunes",
    offer: "-15% sur toutes les boissons et brunchs",
    category: "Food & boissons",
    city: "Villers",
    tags: ["nouveau", "populaire"],
    badge: "Badge entreprise",
    code: null,
    address: "8 place du Marché, Villers",
    map: "https://maps.google.com/?q=8+place+du+March%C3%A9+Villers",
    hours: "Lun–Sam : 8h–19h",
    conditions: "Hors alcool et menus déjà remisés.",
    validity: "Valable jusqu'au 30/09, renouvelable",
    tip: "Astuce : offre spéciale staff sur le latte boréal (+1 croissant offert).",
    distance: 0.4,
    topPick: true,
    discountScore: 15,
  },
  {
    name: "Studio Nordique",
    offer: "Séance sauna + cryo à 22€ (au lieu de 35€)",
    category: "Bien-être & beauté",
    city: "Autres",
    tags: ["nouveau"],
    badge: "Badge + code SMS",
    code: "NORD22",
    address: "21 rue des Pins, Saint-Cloud",
    map: "https://maps.google.com/?q=21+rue+des+Pins+Saint-Cloud",
    hours: "Mar–Dim : 10h–21h",
    conditions: "Réservation obligatoire, 1 fois/semaine.",
    validity: "Test 1 mois renouvelable",
    tip: "Offre spéciale staff : upgrade serviette chaude offerte.",
    distance: 12,
    topPick: true,
    discountScore: 37,
  },
  {
    name: "Cinéma Polaris",
    offer: "Place à 7€ + pop-corn offert",
    category: "Loisirs & sorties",
    city: "Villers",
    tags: ["populaire"],
    badge: null,
    code: "POLARIS7",
    address: "2 avenue des Arts, Villers",
    map: "https://maps.google.com/?q=2+avenue+des+Arts+Villers",
    hours: "Tous les jours : 11h–23h",
    conditions: "Hors avant-premières et séances 3D.",
    validity: "Valable 7/7, renouvelé mensuellement",
    tip: "Astuce : demande la salle 2 (sièges inclinables).",
    distance: 0.9,
    topPick: true,
    discountScore: 30,
  },
  {
    name: "Laverie Flash",
    offer: "10€ le cycle complet pressing",
    category: "Pratique",
    city: "Villers",
    tags: ["populaire"],
    badge: "Badge",
    code: null,
    address: "34 rue des Lilas, Villers",
    map: "https://maps.google.com/?q=34+rue+des+Lilas+Villers",
    hours: "Lun–Dim : 7h–22h",
    conditions: "Hors pièces spéciales (cuir, rideaux).",
    validity: "Valable toute l'année",
    tip: "Astuce : créneau calme entre 14h et 16h.",
    distance: 0.7,
    topPick: false,
    discountScore: 18,
  },
  {
    name: "Garage Arctique",
    offer: "Révision complète -20%",
    category: "Auto & mobilité",
    city: "Autres",
    tags: [],
    badge: "Badge ou carte grise pro",
    code: null,
    address: "119 route du Nord, Calais",
    map: "https://maps.google.com/?q=119+route+du+Nord+Calais",
    hours: "Lun–Ven : 8h–18h",
    conditions: "Sur rendez-vous uniquement.",
    validity: "Valable jusqu'au 31/12",
    tip: "Offre spéciale staff : véhicule de courtoisie offert.",
    distance: 28,
    topPick: false,
    discountScore: 20,
  },
  {
    name: "Salle Fjord",
    offer: "Abonnement mensuel -25% + séance découverte gratuite",
    category: "Sport & santé",
    city: "Villers",
    tags: ["nouveau", "populaire"],
    badge: null,
    code: "FJORD25",
    address: "5 boulevard des Aurores, Villers",
    map: "https://maps.google.com/?q=5+bvd+des+Aurores+Villers",
    hours: "Tous les jours : 6h–23h",
    conditions: "Engagement 3 mois minimum.",
    validity: "Valable jusqu'au 31/10",
    tip: "Astuce : cours HIIT mardi 7h réservé aux salariés.",
    distance: 1.4,
    topPick: true,
    discountScore: 45,
  },
  {
    name: "Coiffure Aurora",
    offer: "Shampoing + coupe + soin à 29€",
    category: "Bien-être & beauté",
    city: "Villers",
    tags: [],
    badge: "Badge",
    code: null,
    address: "17 rue des Peupliers, Villers",
    map: "https://maps.google.com/?q=17+rue+des+Peupliers+Villers",
    hours: "Mar–Sam : 9h–19h",
    conditions: "Supplément cheveux longs (+6€).",
    validity: "Valable 7/7",
    tip: "Astuce : prends la carte fidélité, cumulable.",
    distance: 1.2,
    topPick: false,
    discountScore: 22,
  },
];

const categorySelect = document.getElementById("filter-category");
const citySelect = document.getElementById("filter-city");
const tagSelect = document.getElementById("filter-tag");
const sortSelect = document.getElementById("sort-by");
const partnerCards = document.getElementById("partner-cards");
const topCards = document.getElementById("top-cards");
const categoryButtons = document.getElementById("category-buttons");
const detailDrawer = document.getElementById("detail-drawer");
const detailTitle = document.getElementById("detail-title");
const detailOffer = document.getElementById("detail-offer");
const detailHow = document.getElementById("detail-how");
const detailAddress = document.getElementById("detail-address");
const detailMap = document.getElementById("detail-map");
const detailHours = document.getElementById("detail-hours");
const detailConditions = document.getElementById("detail-conditions");
const detailValidity = document.getElementById("detail-validity");
const detailTip = document.getElementById("detail-tip");
const toast = document.getElementById("toast");

let selectedCategory = "";

function initCategories() {
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function renderTopPicks() {
  topCards.innerHTML = "";
  partners
    .filter((p) => p.topPick)
    .slice(0, 6)
    .forEach((partner) => {
      const card = createPartnerCard(partner, true);
      topCards.appendChild(card);
    });
}

function createPartnerCard(partner, compact = false) {
  const card = document.createElement("article");
  card.className = "card";
  const header = document.createElement("div");
  header.className = "card-header";
  header.innerHTML = `<p class="eyebrow">${partner.category}</p><h3>${partner.name}</h3>`;

  const offer = document.createElement("p");
  offer.textContent = partner.offer;

  const chips = document.createElement("div");
  chips.className = "chips";
  const chipData = [
    partner.city === "Villers" ? "Villers" : "Autres villes",
    partner.badge ? "Badge" : "Code",
    ...partner.tags,
  ];
  chipData.forEach((c) => {
    const span = document.createElement("span");
    span.className = "chip";
    span.textContent = c;
    chips.appendChild(span);
  });

  const actions = document.createElement("div");
  actions.className = "actions";
  const detailBtn = document.createElement("button");
  detailBtn.className = "ghost";
  detailBtn.textContent = "Voir la fiche";
  detailBtn.addEventListener("click", () => openDetail(partner));
  const mapBtn = document.createElement("a");
  mapBtn.className = "cta";
  mapBtn.href = partner.map;
  mapBtn.target = "_blank";
  mapBtn.rel = "noreferrer";
  mapBtn.textContent = "Itinéraire";
  actions.append(detailBtn, mapBtn);

  card.append(header, offer, chips);
  if (!compact) {
    const mini = document.createElement("p");
    mini.textContent = `Badge / code : ${partner.badge ?? partner.code}`;
    card.append(mini);
  }
  card.append(actions);
  return card;
}

function renderPartners() {
  const filtered = partners
    .filter((p) => !selectedCategory || p.category === selectedCategory)
    .filter((p) => {
      if (citySelect.value === "Villers") return p.city === "Villers";
      if (citySelect.value === "Autres") return p.city !== "Villers";
      return true;
    })
    .filter((p) => {
      if (tagSelect.value === "nouveau") return p.tags.includes("nouveau");
      if (tagSelect.value === "populaire") return p.tags.includes("populaire");
      return true;
    })
    .sort((a, b) => sortPartners(a, b, sortSelect.value));

  partnerCards.innerHTML = "";
  filtered.forEach((partner) => partnerCards.appendChild(createPartnerCard(partner)));
}

function sortPartners(a, b, mode) {
  switch (mode) {
    case "nouveaux":
      return (b.tags.includes("nouveau") ? 1 : 0) - (a.tags.includes("nouveau") ? 1 : 0);
    case "proches":
      return a.distance - b.distance;
    case "remise":
      return b.discountScore - a.discountScore;
    default:
      return a.name.localeCompare(b.name, "fr");
  }
}

function openDetail(partner) {
  detailTitle.textContent = partner.name;
  detailOffer.textContent = partner.offer;
  const howLines = [partner.badge ? `Présente : ${partner.badge}` : "Code requis", partner.code ? `Code : ${partner.code}` : "Pas de code nécessaire"];
  detailHow.textContent = howLines.join(" · ");
  detailAddress.textContent = partner.address;
  detailMap.href = partner.map;
  detailHours.textContent = partner.hours;
  detailConditions.textContent = partner.conditions;
  detailValidity.textContent = partner.validity;
  detailTip.textContent = partner.tip || "";
  detailDrawer.classList.add("active");
  detailDrawer.focus();
}

function closeDetail() {
  detailDrawer.classList.remove("active");
}

document.getElementById("close-drawer").addEventListener("click", closeDetail);
detailDrawer.addEventListener("click", (e) => {
  if (e.target === detailDrawer) closeDetail();
});

function attachCategoryButtons() {
  categoryButtons.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category;
      categoryButtons.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      categorySelect.value = selectedCategory;
      renderPartners();
      scrollToSection("partners");
    });
  });
}

categorySelect.addEventListener("change", (e) => {
  selectedCategory = e.target.value;
  categoryButtons.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.category === selectedCategory));
  renderPartners();
});
citySelect.addEventListener("change", renderPartners);
tagSelect.addEventListener("change", renderPartners);
sortSelect.addEventListener("change", renderPartners);

document.getElementById("scroll-top").addEventListener("click", () => scrollToSection("top"));
document.getElementById("scroll-how").addEventListener("click", () => scrollToSection("how"));

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("report-issue").addEventListener("click", () => showToast("Signalement envoyé à ton contact."));
document.getElementById("open-contact").addEventListener("click", () => showToast("Contact ouvert sur Teams / WhatsApp."));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && detailDrawer.classList.contains("active")) closeDetail();
});

document.getElementById("contact").addEventListener("click", (e) => {
  if (e.target.closest("button")) return;
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2500);
}

function populateFilterDefaults() {
  initCategories();
  renderTopPicks();
  renderPartners();
}

attachCategoryButtons();
populateFilterDefaults();
