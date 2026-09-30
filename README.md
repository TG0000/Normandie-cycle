# Normandie Cycles — Sans compromis.

Vitrine React/Vite pour le magasin Specialized de Fleury-sur-Orne : identité rouge/noir/argent, vraies vues du S-Works Tarmac SL9, galerie produit interactive, détails techniques, univers vélo, atelier et Retül Fit, histoire du magasin, horaires et itinéraire. Images et polices servies localement.

## Développer

Node.js 22.12+ ou 24, npm. Depuis `/workspace/Normandie-cycle` :

```sh
npm_config_cache=/workspace/.npm-cache npm ci
npm run dev
npm test
npm run build
npm run preview
```

Le checkout cloud est déjà isolé : ne pas créer de worktree sauf demande explicite. Les cinq tests de contact utilisent le runner Node. Le contrôle navigateur de la sortie de production est disponible avec Python Playwright et Chromium : `python3 tests/browser-smoke.py` après `npm run preview` (BASE_URL modifiable ; captures dans `/tmp/normandie-cycles-check` ou ARTIFACT_DIR).

## Vercel

La version est publiée en **déploiement temporaire Vercel**, en attente de rattachement au compte du propriétaire. Le lien de rattachement est communiqué dans le chat et n’est pas commité. Une URL temporaire expire rapidement : la rattacher avant son expiration pour la conserver.

Pour une publication durable, importer ce dépôt dans Vercel (preset Vite). `vercel.json` configure `npm run build` et `dist`, et Vercel déploie la fonction `/api/contact`.

### Formulaire

Configurer les variables serveur `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` dans Vercel ; l’expéditeur doit avoir un domaine vérifié chez Resend. Ne jamais utiliser le préfixe VITE_ ni commiter ces valeurs. Vite seul ne lance pas la fonction : utiliser une Preview Vercel ou `vercel dev` pour un test complet. Aucun e-mail réel n’a été envoyé pendant cette réalisation.

Sans configuration, la fonction répond 503 et le site propose le téléphone du magasin. Les données invalides sont rejetées ; un honeypot et le contrôle d’origine limitent les soumissions indésirables. Ajouter une limitation durable dans Vercel avant l’ouverture publique. Compléter la politique du nouveau site avec le responsable du traitement et les modalités de conservation ; les liens légaux actuels renvoient au site existant du magasin.

## Sources et médias

Voir [l’audit](docs/AUDIT-SITE-ACTUEL.md) et [la conception](docs/CONCEPTION.md). Les photos officielles Specialized sont dans `src/assets`, celles du magasin dans `public/images`. Les URL d’origine figurent dans `src/media.js`. `python3 scripts/fetch-media.py` rafraîchit les photographies fabricant avec curl, validation TLS maintenue, puis compression WebP via Pillow. Vérifier les droits de réutilisation avec le magasin et Specialized pour la publication durable.

L’expérience du SL9 est une galerie photographique avec vues officielles, pas une rotation 3D. Le modèle approximatif et la photographie générée ont été supprimés. Aucun stock, prix magasin, avis client ou promesse de conversion n’a été inventé.

## Vérifications

Build réussi, cinq tests de contact réussis. Contrôles Chromium : images locales chargées, trois vues et agrandissement, clavier, formulaire et erreur avec recours téléphone, FAQ, navigation mobile, mouvement réduit, absence d’erreur JavaScript et de débordement aux largeurs 320, 390, 768 et 1440 px. La page et les fichiers publiés sur Vercel ont été récupérés en HTTPS et comparés au build vérifié. Le service de contact publié rejette effectivement les données invalides.
