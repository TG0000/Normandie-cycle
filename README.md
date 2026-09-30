# Normandie Cycles — site vitrine (Specialized Store, Caen · Fleury-sur-Orne)

Nouveau site vitrine du magasin **Normandie Cycles**, revendeur Specialized à Fleury-sur-Orne, aux portes de Caen.
Next.js (App Router), déployable tel quel sur **Vercel**.

## Le concept

Un site pensé comme une page produit Specialized, au service d'un objectif simple : **faire venir les clients en magasin**.

- **Le S-Works Tarmac SL9 « vivant ».** La photo studio réelle du vélo est animée en WebGL2 :
  - les **roues tournent vraiment** : logos rovai, rayons, disques et cassette tournent, et le cadre, la fourche, la chaîne et le dérailleur restent fixes. La vitesse de rotation suit le scroll, comme si la page était la route, avec un flou de mouvement ;
  - un **reflet de lumière** balaie la peinture ;
  - un **configurateur de teinte** recolore la peinture de la photo (aperçu simulé) ;
  - un reflet au sol et une légère parallaxe 3D suivent la souris.
- **Récit au scroll en 7 chapitres** : zooms photographiques sur le cadre, la Flow Fork, les roues, le cockpit et la transmission, avec étiquettes ancrées sur le vélo.
- **Conversion** : « Réserver un essai » présent partout, formulaire de rendez-vous (essai, atelier, Retül, conseil, location), statut **ouvert / fermé en temps réel** (heure de Paris), barre d'actions mobile (Appeler · Itinéraire · Réserver), numéro cliquable.
- **Contenu utile** : univers (route, gravel, VTT, électrique, ville, enfants), atelier toutes marques, étude posturale **Retül** (animation de capture de mouvement avec angles calculés en direct), essai / occasion / location, horaires, plan, FAQ.
- **SEO local** : données structurées `BicycleStore` + `FAQPage`, métadonnées, Open Graph, sitemap, robots, communes desservies.
- **Accessibilité / performance** : `prefers-reduced-motion` respecté, rendu WebGL mis en pause hors écran, repli image sans WebGL2, carte Google chargée à la demande.

## Analyse du site actuel (normandie-cycles.fr)

Le domaine est bloqué par le proxy réseau de l'environnement de développement. L'analyse a donc été faite à partir de l'index des moteurs de recherche et des annuaires (PagesJaunes, Specialized store finder, etc.) :

- **Site de type « générateur SEO local ».** On y trouve des dizaines de pages quasi identiques par ville et par mot-clé (`magasin-de-velo-caen.html`, `velo-d-occasion-ifs.html`, `magasin-de-cycle-mondeville.html`, `reparation-velo-caen.html`…), une galerie, des actualités (« Mise en ligne du nouveau site ») et un plan du site.
- **Contenu générique.** Les textes ne mettent en avant ni la marque Specialized, ni les modèles, ni l'étude Retül.
- **Aucun parcours de conversion.** Pas de prise de rendez-vous en ligne, pas d'info d'ouverture en temps réel, pas de mise en valeur des avis (4,9/5, environ 100 avis).
- **Informations reprises dans le nouveau site :**
  - adresse : 2 bis route d'Harcourt / 17 bis rue d'Ifs, 14123 Fleury-sur-Orne ;
  - téléphone : 09 73 58 82 11 ;
  - horaires : mardi-vendredi 9h30-12h / 14h-19h, samedi 9h30-12h / 14h-18h ;
  - services : vente, atelier toutes marques, VAE, occasion reconditionnée, location, Retül ;
  - présence à Fleury-sur-Orne depuis 2018.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Déploiement Vercel

1. Importer le dépôt dans Vercel (framework détecté automatiquement : Next.js).
2. Variables d'environnement (facultatives) :

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canonique (défaut : `https://www.normandie-cycles.fr`) |
| `RESEND_API_KEY` + `CONTACT_TO` (+ `CONTACT_FROM`) | Envoi des demandes de rendez-vous par e-mail via Resend |
| `CONTACT_WEBHOOK_URL` | Alternative : envoi des demandes vers un webhook (Zapier, Make, Slack…) |

Sans canal configuré, le formulaire ne prétend pas avoir envoyé la demande : il invite à appeler le magasin.

## Photo animée : comment ça marche

- `public/img/sl9.webp` : photo détourée du S-Works Tarmac SL9 Red Tint (SRAM RED AXS).
- `public/img/sl9-mask.png` est généré par `python3 scripts/build-masks.py` (requiert `pillow` et `numpy`) :
  - canal R : pièces fixes (cadre, fourche, chaîne, dérailleur) superposées aux roues ;
  - canal G : peinture (recoloration et reflet) ;
  - canal B : disques de roues.
- `components/photo/shader.ts` : pour chaque pixel d'une roue, échantillonne la photo tournée dans le repère elliptique de la roue. Les échantillons qui tombent sur une pièce fixe sont remplacés par un voisin décalé d'un pas de rayon, puis moyennés pour le flou de mouvement.

## À valider avec le magasin

- Droits d'usage de la photo produit Specialized (visuel officiel de la marque).
- Note et nombre d'avis Google, e-mail de contact, réseaux sociaux, prestations exactes (location, financement, tarifs atelier).
- Prix : 13 999 € (Dura-Ace Di2) et 5 799 € (cadre seul), prix publics relevés en septembre 2026.

Specialized, S-Works, Tarmac, Roval et Retül sont des marques de Specialized Bicycle Components, Inc.
