# Audit du site actuel et références de la refonte

Observation : 30 septembre 2026. Sources HTTPS téléchargées avec vérification TLS. Cet audit porte sur les contenus et la structure HTML ; aucune mesure Lighthouse, conversion ou audit de trafic n’a été réalisée. La capture du site distant dans Chromium est limitée par la chaîne de confiance du proxy ; aucun contournement TLS n’a été utilisé. Les tests visuels de la nouvelle version sont effectués sur son build local.

## Identité et données vérifiées

Le logo existant associe un cycliste, le monogramme NC, des traits de vitesse et une typographie inclinée rouge et grise. C’est une identité sportive et technique. Le paysage généré de la première proposition ne traduisait pas cette identité et a été retiré.

L’histoire publique situe la fondation par Cyril en 2008 à Vire, puis l’installation dans la région caennaise en 2018 en collaboration avec Specialized. La page présente une équipe de quatre personnes ; les âges individuels peuvent dater et ne sont pas repris. L’offre s’adresse aussi bien aux sportifs qu’aux usages quotidiens et aux enfants.

Adresse publiée : **2b Route d’Harcourt et 17b Rue d’Ifs, 14123 Fleury-sur-Orne**. Téléphone : **09 73 58 82 11**. Mardi–vendredi : 9h30–12h / 14h–19h. Samedi : 9h30–12h / 14h–18h. Dimanche et lundi fermés. Ces informations apparaissent aussi dans les données structurées BikeStore du site.

## Architecture

Six entrées principales : Accueil, Qui sommes-nous ?, Nos services, Galerie photos, Actualités, Contact. Les pages de services couvrent cinq prestations : vente de vélos, vente de vélos électriques, équipements, réparation et étude posturale Retül Fit. L’accueil comporte des liens de présentation, des cartes de services, une actualité, une liste d’atouts, une galerie et une invitation à visiter le magasin.

L’accueil contient **112 liens et 14 éléments img** dans le HTML téléchargé. Une partie correspond aux menus desktop/mobile et aux réseaux sociaux, mais le pied de page regroupe aussi plus de trente liens de recherches locales. Cela multiplie les destinations et dilue le parcours principal. La refonte concentre le menu sur les vélos, l’expertise et le magasin, avec des liens téléphone et itinéraire immédiatement accessibles.

Les URL historiques contiennent notamment `devis-reparation-velo-flery-sur-orne.html` et `actualites-magasin-velos-fleury-sur-srne.html`. Elles répondent ; les fautes de frappe ne permettent pas de conclure que les liens sont cassés. Les conserver ou prévoir des redirections lors d’une migration du domaine.

## Contenu et différenciation

La page d’accueil privilégie un discours général sur le choix d’un vélo et les usages. Le récit de Cyril, la relation Specialized et le Retül Fit figurent ailleurs, alors qu’ils permettent de distinguer ce magasin d’un vendeur générique. La refonte les remonte dans le parcours principal.

La liste d’atouts aligne des mots comme conseil, écoute, service, technique et professionnalisme. La nouvelle version préfère montrer les activités réelles : photographies de l’atelier et du fitting, prestations, horaires et lieu. Aucun témoignage ni note client du magasin n’a été inventé.

L’actualité mise en avant annonce le lancement du site le **23 janvier 2025**. Ce n’est pas une preuve d’inactivité du magasin ; c’est toutefois un contenu moins utile pour choisir un vélo ou préparer une visite. La refonte ne reprend pas cette actualité en tête du parcours.

## Photographies

Les photos de présentation montrent des vélos Specialized dans le magasin, les équipements et des vélos de ville/électriques. La photo de réparation montre un vélo pris en charge à l’atelier ; le visuel Retül montre un réglage du pied/chaussure. Ces images sont reprises localement en WebP avec une présentation cohérente.

Plusieurs fichiers et textes alternatifs de services portent encore « Le Mans », « Allonnes » ou « Le Mans Nord », alors que le magasin est à Fleury-sur-Orne. Il s’agit d’une incohérence observable dans le contenu, pas d’une preuve de localisation différente. Les nouvelles descriptions d’images correspondent à ce qui est montré et au magasin.

La galerie de l’accueil présente aussi des vélos d’occasion, avec des liens Troc-Vélo et parfois des prix dans les textes alternatifs. Ils ne sont pas importés comme stock actuel : leur disponibilité n’a pas été vérifiée.

## Contact et conversion

Le formulaire existant demande nom, e-mail, téléphone et message, tous marqués obligatoires dans le HTML, plus le consentement. Les numéros sont parfois accompagnés d’un mécanisme « Afficher le numéro ». Le site offre aussi un lien tel direct. La nouvelle vitrine rend le téléphone directement accessible et garde un formulaire plus court, contextualisé par la pratique.

Le CTA Route/Gravel/Électrique préremplit le projet ; la visite mène à un itinéraire Google Maps, les horaires sont visibles, et l’échec d’envoi propose le téléphone. La présence de Retül et de l’atelier donne des raisons concrètes de contacter le magasin. Une amélioration de conversion reste une hypothèse à mesurer après lancement.

## Références Specialized vérifiées

La catégorie Tarmac et la fiche officielle présentent bien le **S-Works Tarmac SL9 SRAM RED AXS**, en finition Satin Silver Dust. Les données fabricant relevées : cadre FACT 12r Carbon à 687 g, vélo annoncé à 6,6 kg en taille 56, Roval Rapide Cockpit intégré et roues Roval Rapide CLX III. Les valeurs sont accompagnées d’une note indiquant les variations selon la taille, la peinture et les composants.

Le site officiel fournit profil, trois-quarts avant/arrière et vues de détail. Ces photographies remplacent le modèle procédural ; le contrôle des vues est une galerie de photographies, **pas une rotation 3D**. Aucun GLB officiel n’a été fourni ou découvert. La demande de 3D officielle photoréaliste n’est donc pas considérée satisfaite.

Les catégories gravel et électriques fournissent également les photographies du S-Works Diverge 4 et du S-Works Levo 4 X. Elles illustrent les pratiques ; aucune disponibilité ni prix du magasin n’est affirmé.

## Sources

- https://www.normandie-cycles.fr/
- https://www.normandie-cycles.fr/boutique-velo-fleury-sur-orne.html
- https://www.normandie-cycles.fr/nos-services.html
- https://www.normandie-cycles.fr/nos-services/etude-posturale-retul-fit-fleury-sur-orne.html
- https://www.normandie-cycles.fr/devis-reparation-velo-flery-sur-orne.html
- https://www.normandie-cycles.fr/mentions-legales.html
- https://www.specialized.com/fr/fr/shop/velos/velos-de-route/velos-de-route-performance/tarmac
- https://www.specialized.com/fr/fr/s-works-tarmac-sl9-sram-red-axs/p/4293533
- https://www.specialized.com/fr/fr/s-works-diverge-4-sram-red-xplr/p/4298775
- https://www.specialized.com/fr/fr/s-works-levo-4-x/p/4292995
