# QR Access 2 - Système de Gestion d'Accès par Code QR

QR Access 2 est une plateforme moderne et sécurisée pour la gestion d'événements et le contrôle d'accès via des codes QR uniques.

## Fonctionnalités Clés

- **Authentification Sécurisée** : Connexion, inscription et vérification d'email.
- **Tableau de Bord Analytique** : Visualisation des scans sur 7 jours via Recharts et suivi des top agents.
- **Gestion des Événements** : Création, modification et suppression d'événements avec planification de zones.
- **Gestion des Agents** : Attribution d'agents pour le contrôle d'accès sur le terrain.
- **Gestion des Codes QR** :
    - Génération individuelle et par lot (Import CSV).
    - Révocation en temps réel.
    - Exportation des historiques de scan en **CSV** et **PDF**.
- **Interface Scanner Dédiée** : Une interface fluide pour les agents de terrain.

## Installation

### Backend
1. `npm install`
2. Configurez le fichier `.env` avec vos accès base de données (Prisma) et SMTP.
3. `npx prisma db push`
4. `npm start` (Tourne sur le port 5000 par défaut)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Tourne sur le port 3000 ou 3001)

## Technologies Utilisées
- **Backend** : Node.js, Express, Prisma, PostgreSQL, CSV-Writer, PDFKit.
- **Frontend** : Next.js, TailwindCSS, Lucide-React, Recharts.
- **QR Engine** : node-qrcode.

## Auteur
Lionel
