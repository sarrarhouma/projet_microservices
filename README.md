Projet de Microservices
Ce projet implémente les concepts de microservices en utilisant les architectures REST, GraphQL, gRPC, et Kafka. L'objectif est de créer une application simple basée sur des microservices, de mettre en place une documentation, et de présenter le travail sur GitHub.

Introduction
Ce projet met en œuvre une architecture de microservices pour une application de gestion d'hôtels et de chambres. Les microservices sont mis en place pour gérer les opérations CRUD (Create, Read, Update, Delete) pour les hôtels et les chambres, en utilisant différentes technologies pour les communications inter-services et la communication avec le client.

Technologies Utilisées
Node.js
Express.js
gRPC
GraphQL
Kafka
MongoDB
Apollo Server
Docker (facultatif, pour le déploiement)
Architecture
L'architecture de l'application comprend les éléments suivants :

API Gateway: Expose les endpoints REST et GraphQL pour les clients.
Hotel Microservice: Gère les opérations liées aux hôtels.
Room Microservice: Gère les opérations liées aux chambres.
Les microservices communiquent entre eux via gRPC et Kafka pour les messages asynchrones.

Installer les dépendances pour chaque microservice :
cd projet-microservices/apiGateway
npm install
cd ../hotelMicroservice
npm install
cd ../roomMicroservice
npm install

Démarrer les services Kafka et MongoDB.

Mettre à jour l'adresse du broker Kafka dans les fichiers apiGateway, hotelMicroservice, et roomMicroservice.

Utilisation
Démarrer le Hotel Microservice :

cd projet-microservices/hotelMicroservice
node index.js
Démarrer le Room Microservice :

cd projet-microservices/roomMicroservice
node index.js
Démarrer l'API Gateway :

cd projet-microservices/apiGateway
node index.js


Endpoints
REST Endpoints
GET /hotels: Récupérer tous les hôtels.
GET /hotels/:id: Récupérer un hôtel par ID.
POST /hotels/add: Ajouter un nouvel hôtel.
GET /rooms: Récupérer toutes les chambres.
GET /rooms/:id: Récupérer une chambre par ID.
POST /rooms/add: Ajouter une nouvelle chambre.
GraphQL Endpoints
Les endpoints GraphQL sont exposés via l'API Gateway.

Contribution
Les contributions sont les bienvenues ! Veuillez fork le repository et créer une pull request avec vos modifications.

License
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
