# Rapport Hebdomadaire de Stage (PFE)

## 🏢 1. Présentation de l'Entreprise d'Accueil

**Nom du projet / Startup :** STAYGENIE
**Secteur :** PropTech (Technologie Immobilière) & Intelligence Artificielle
**Mission :** Digitaliser et simplifier l'accès au logement et à l'investissement immobilier au Maroc grâce à une plateforme "AI-First".
**Contexte :** Startup en phase de développement (MVP), visant à résoudre les frictions du marché locatif et de l'investissement (manque de transparence, processus manuels, absence de données fiables).

## 🎓 2. Sujet du PFE

**Titre :** Conception et Développement d'une Plateforme Immobilière "AI-First" Unifiée (Location, Gestion, Investissement)
**Problématique :**
Comment l'Intelligence Artificielle peut-elle restructurer un marché immobilier fragmenté et opaque pour offrir une expérience utilisateur fluide, transparente et sécurisée ?
**Objectifs du stage :**

- Développer une solution technique couvrant l'ensemble du cycle de vie immobilier (Recherche, Transaction, Gestion Locative).
- Intégrer des moteurs d'IA pour la vérification de dossiers, l'analyse prédictive de rendement et l'assistance juridique (contrats).
- Concevoir une UX centrée sur la confiance et l'accompagnement personnalisé (Personas : Locataire, Propriétaire, Investisseur, Institutionnel, Partenaire Agence).

---

## 📅 3. Réalisations Majeures de la Semaine (16 – 22 Février 2026)

### 🎯 Tâches et missions réalisées

- **Intégration Firebase pour la collaboration en temps réel** : Mise en place d'une base de données Firebase Realtime Database permettant la synchronisation instantanée des notes et feedbacks. Implémentation d'un système de stockage hybride (Firebase + localStorage fallback) pour garantir la disponibilité hors-ligne.
- **Expansion des Parcours Utilisateurs (User Journeys)** : Développement détaillé de **5 profils clés** (ajout du profil "Partenaire Agence B2B") et cartographie de leurs parcours "avant vs après StayGenie" avec scénarios conversationnels IA.
- **Conception du Feature Validation Board** : Développement d'un tableau de bord permettant aux stakeholders de voter sur 16 fonctionnalités (Must Have / Nice / Not Needed) avec système de commentaires et suggestions en temps réel.
- **Déploiement privé et sécurisé** : Transformation des livrables en prototype haute-fidélité sécurisé par **StatiCrypt** (AES-256) avec accès protégé par mot de passe. Création d'un workflow d'automatisation (`publish.bat`).
- **Rédaction du Document Concept STAYGENIE** : Création d'un document exhaustif (~15 000 mots) couvrant la vision, l'architecture IA, les données réelles de subventions (Daam Sakane, FOGARIM), et la roadmap.
- **Amélioration de l'interface et corrections UX** : Correction des problèmes de lisibilité, animations de défilement (IntersectionObserver), et navigation fluide en "Dark Mode" premium.

### 🛠️ Compétences techniques et outils utilisés

- **Backend-as-a-Service (BaaS)** : Firebase Realtime Database (listeners temps réel, persistence hybride, règles de sécurité).
- **Développement Frontend avancé** : JavaScript modulaire, CSS3 avancé (Glassmorphism, Grid/Flexbox), IntersectionObserver API.
- **Cybersécurité & Sécurité Web** : Mise en œuvre du chiffrement StatiCrypt et d'un système de contrôle d'accès par rôle (RBAC) par mot de passe interne.
- **Analyse Métier & Product Writing** : Modélisation des besoins agences (B2B) et rédaction de documentation stratégique intégrant des données marché (HCP, BAM).
- **UX/UI Design** : Conception d'interfaces immersives centrées sur le storytelling et l'accessibilité.

### 🚀 Apprentissages et Nouveautés

- **Firebase Realtime Database** : Première implémentation d'une synchronisation temps réel bidirectionnelle entre navigateurs — compréhension du modèle de données NoSQL et des listeners d'événements Firebase.
- **Déploiement sécurisé de sites statiques** : Découverte et maîtrise de StaticCrypt pour la protection par mot de passe de pages HTML sans backend.
- **Design de systèmes de feedback collaboratifs** : Conception d'un système de notes et de validation de features avec rôles (Intern / Stakeholder), statuts (New / In Progress / Done) et persistance en temps réel.
- **Documentation produit structurée** : Apprentissage de la rédaction d'un concept document professionnel intégrant vision stratégique, analyse de marché et spécifications techniques.
