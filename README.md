# JeePanel

JeePanel est un fork non officiel de [HABPanel](https://next.openhab.org/docs/ui/habpanel/habpanel.html).

L'idée principal est de reprendre les mêmes concepts : permettre la création de dashboard domotique avec des "tuiles" et des "Widgets" adapté à Jeedom (et peut être d'autres...)

Le dashBoard par défaut de Jeedom n'est pas "homogène" et devient très vite "brouillon". Jeedom permet de créer des dashboards personnalisés mais cela demande à avoir des connaissance HTML, graphisme... et cela prend beaucoup de temps.

JeePanel permet(tra) de créer des dashboards simplement, rapidement sans aucune connaissance technique.

/!\ ATTENTION : il s'agit d'une version Béta, à utiliser à vos risques et péril :) De plus il n'y pas de méthode d'authentification, il est donc conseillé d'utiliser JeePanel uniquement sur le réseau local.

La documentation est également en cours de rédaction :)

# Installation 

JeePanel peut être installé sur n'importe quel serveur. La connexion à Jeedom se fera lors de la phase d'initialisation.

## Instalation sur le serveur Jeedom

En atttendant un vrai plugin Jeedom, JeePanel peut être installé manuellement sur votre machine Jeedom : 
 - Dans "Menu Réglage -> Système -> Editeur de fichier", dans le répertoire html, créer le répertoire "jeepanel" (bien respecter les miniscules)
 - Copier tous les fichiers/répertoires qui se trouvent dans "dist/jeedom/jeepanel" dans le nouveau répertoire "jeepanel"
 - Accéder au dashboard via l'url local de jeedom (bien respecter les miniscules) : http://[IP_JEEDOM]/jeepanel

# Mise en place

## Fournisseur :
Il faut configurer le fournisseur (serveur Jeedom) : 
 - Nom du fournisseur : pour permettre de l'identifier 
 - Url de jeedom : url local ou dns jeedom
 - ApiKey Jeedom : récupérer la valeur de "Clé API" dans Menu Reglage -> Système -> Configuration -> Api


## Stockage des dashboards
Par défaut JeePanel s'exécute en mode « stockage local » pour cet appareil : les paramètres et les dashboards sont conservés uniquement dans le stockage local du navigateur.

Une fois un fournisseur configuré, il est possible d'enregistrer la configuration dans un virtuel Jeedom (le virtuel de doit pas être historisé) : cela permet le partage de partager des dashboards entre les appareils - cela est utile par exemple pour concevoir un dashboard confortablement sur un ordinateur, puis l'utiliser sur une tablette.

Pour passer du stockage local au stockage Jeedom, accédez à la page Paramètres depuis la SideNav.

