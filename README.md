# Pass Boréales — Portail avantages salariés

Portail interne pour présenter les avantages partenaires du groupe Les Boréales. L'interface met l'accent sur la recherche rapide (<10s), des fiches normalisées et des mentions conformes (accès réservé, support, dernières mises à jour).

## Stack
- Site statique servi par Node.js (`index.js`)
- HTML/CSS/JS vanilla (mobile-first)
- Données partenaires centralisées dans `public/data/partners.json`

## Démarrer en local
```bash
npm install # (aucune dépendance, installe seulement npm pour le script)
npm start   # lance un serveur sur http://localhost:3000
```

## Ajouter ou mettre à jour un partenaire
1. Ouvrir `public/data/partners.json`.
2. Ajouter un objet dans le tableau `partners` avec les champs :
   - `id` : identifiant unique (kebab-case)
   - `name` : nom affiché
   - `category` : ex. "Food & boissons", "Loisirs & sorties"
   - `city` : ville principale (affichée et filtrable)
   - `offer_short` : résumé de l'offre (cartes)
   - `access_type` : `badge` | `code` | `badge_or_code`
   - `code` : valeur du code si applicable (sinon `null`)
   - `address_short` : version courte affichée sur la carte
   - `maps_url` : lien Google Maps (nouvel onglet)
   - `hours` : horaires d'ouverture
   - `conditions` : tableau de conditions courtes (2–3 items)
   - `status` : `active` | `test` | `paused`
   - `tags` : 1–2 tags maximum (ex. "Nouveau", "Exclusif salariés")
   - `updated_at` : date ISO (YYYY-MM-DD)
3. Sauvegarder le fichier. La liste et les filtres se mettent à jour automatiquement (chargement côté client).

## Déploiement
- **Netlify** : le dépôt inclut `netlify.toml`. Le site est statique ; commande de build : `npm start` (ou servir directement le dossier `public`).
- **GitHub Pages** : publier le contenu du dossier `public` (et `index.js` n'est pas nécessaire si vous utilisez un hébergement statique).

## Accessibilité et mentions
- `<meta name="robots" content="noindex,nofollow">` pour un usage interne.
- Mentions en pied de page : accès réservé, offres susceptibles d'évoluer, absence de transmission de données personnelles, support identifié.
- Fiches : code masqué jusqu'à action utilisateur, date de dernière mise à jour visible.

## Tests
Aucun test automatisé n'est fourni pour l'instant. Exécutez `npm start` pour vérifier le rendu localement.
