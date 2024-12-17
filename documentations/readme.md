
# Principaux éléments et fonctionnalités de l'interface

  

## Stockage

JeePanel permet de stocker les dashboards de 2 facons différentes :

- Dans le LocalStorage de l'appareil : les paramètres sont conservés uniquement dans le stockage local du navigateur

- Dans un virtuel Jeedom : les paramètres sont conservés dans un virtuel Jeedom (le virtuel ne doit pas être historisé) : cela permet le partage des dashboards entre les appareils.

## Fournisseurs

Les fournisseurs sont les applications (Jeedom, Home Assitant, ...) qui fournissent les commandes à afficher. Actuelement seul Jeedom est supporté.

## Le menu principal

Le dashboard principal est la page d'accueil de JeePanel. On peut revenir sur ce Dashboard en cliquant sur le lien "JeePanel" dans la SideNav.

## Dashboard

Un dashboard contient des tuiles qui affichent des textes/commandes et une icône permettant de basculer entre le mode d'exécution et le mode d'édition.

- Mode d'exécution : permet de visualiser/exécuter des commandes

- Mode d'édition : permet de mettre à jour le dashboard : ajouter/supprimer/modifier des widgets et éditer le dashboard

  

Utilisez l’icône d’engrenage dans le coin supérieur droit pour basculer entre les deux modes.

Pour chaque dashboard, il est possible de perosnnaliser certains paramètres :

Paramètre | Défaut | Description
|--|--|--|
|Titre  |  | Titre du dashboard
| Code| | Permet d'identifier un dasboard
|Nb colonnes|12|Nombre de colonnes : la largeur minimale d'un widget sera égal à la largeur de l'écran divisé par le nombre de colonnes.
|Hauteur des lignes|50| Hauteur minimale d'un widget en pixel
| Vue mobile : une seule colonne||Si coché, en mode mobile, affiche tous les widgets les uns en dessous des autres dans une seule colonne (le widget prend toute la largeur du téléphone)
 

## Le concepteur de tableau de bord

  
En mode édition, le concepteur de tableau de bord est l'endroit où les widgets peuvent être ajoutés, positionnés, redimensionnés et configurés. Les espaces réservés sont affichés à l'emplacement des widgets réels sur le tableau de bord en cours d'exécution.

Pour ajouter un widget, utilisez le bouton "Ajouter" et choisissez parmi la liste des widgets standards.


## SideNav

La SideNav est accessible depuis n'importe quel écran par un glissement ou un glissement vers la droite (sur la plupart des éléments où il n'y a pas de conflit avec ce geste), ou avec l'icône « hamburger » ☰ dans le coin supérieur gauche.

Il est composé de trois parties :

- Un en-tête - en cliquant dessus, on revient au menu principal.

- Une liste de dashboards

- Un pied de page affichant la date et l'heure actuelles et comportant un lien vers l'écran des paramètres.

  

# Widgets

  

## Widgets standards

  

Les widgets intégrés suivants sont disponibles :

  

### Bouton

  

Le widget bouton peut être cliqué (ou appuyé) et effectuera une action, comme envoyer des commandes à un élément ou naviguer vers un autre tableau de bord. Il peut également ajuster ses couleurs en fonction de l'état de l'élément sous-jacent.

  

### Curseur/Slider

  

Le widget curseur peut refléter l'état et mettre à jour des éléments numériques dans une plage de valeurs. Plusieurs options sont disponibles pour modifier son apparence et son comportement.

  

### Graphique

  

Le widget graphique permet de tracer des séries numériques sur une période donnée.

  

### Horloge

  

Le widget horloge affiche une horloge numérique.

  

### Image

  

Le widget image peut afficher une image, directement ou via une commande Jeedom, et peut l'actualiser à intervalles réguliers.

  

### Label

  

Le widget Label est simple : il affiche simplement un texte fixe et dispose de quelques options d'apparence (couleur, police). Il peut par exemple être utilisé comme en-tête pour un groupe de widgets situés en dessous.

  

Il permet également d'afficher l'historique d'une valuer en cliquant sur ce Label.

  

### Selection/Mode

  

Le widget de sélection affiche l'état actuel d'un élément et il ouvre un menu pour envoyer des commandes à cet élément. Diverses options d'affichage sont disponibles.

  

### Thermostat

  

Le widget de sélection affiche un thermostat (Température de consigne, température actuelle, Sélection de modes, ...)