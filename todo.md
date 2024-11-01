# To-Do List : Application de Gestion de Budget

# To-Do List : Création des Tables pour l'Application de Gestion de Budget

## 1. Table `Utilisateurs`
- [x] Créer la table `Utilisateurs` avec les colonnes suivantes :
  - **id** (clé primaire, auto-incrément)
  - **firstname** (string, non null)
  - **lastname** (string, non null)
  - **username** (string, non nul)
  - **email** (string, unique, non nul)
  - **mot_de_passe** (string, haché, non nul)
  - **date_creation** (date, valeur par défaut : date actuelle)

## 2. Table `Categories`
- [x] Créer la table `Categories` avec les colonnes suivantes :
  - **id** (clé primaire, auto-incrément)
  - **nom** (string, non nul)
  - **description** (string, optionnel)

## 3. Table `Depenses`
- [x] Créer la table `Depenses` avec les colonnes suivantes :
  - **id** (clé primaire, auto-incrément)
  - **utilisateur_id** (clé étrangère vers `Utilisateurs`, non nul)
  - **categorie_id** (clé étrangère vers `Categories`, non nul)
  - **montant** (decimal, non nul)
  - **date** (date, non nul)
  - **description** (string, optionnel)

## 4. Table `Revenues`
- [x] Créer la table `Revenues` avec les colonnes suivantes :
  - **id** (clé primaire, auto-incrément)
  - **utilisateur_id** (clé étrangère vers `Utilisateurs`, non nul)
  - **montant** (decimal, non nul)
  - **categorie_id** (clé étrangère vers `Categories`, non nul)
  - **date** (date, non nul)
  - **description** (string, optionnel)

## 5. Table `Budgets`
- [ ] Créer la table `Budgets` avec les colonnes suivantes :
  - **id** (clé primaire, auto-incrément)
  - **utilisateur_id** (clé étrangère vers `Utilisateurs`, non nul)
  - **plafond_global** (decimal, non nul)
  - **plafonds_par_categorie** (JSON, optionnel)
  - **date_mise_a_jour** (date, valeur par défaut : date actuelle)


## 6. Tests et Validation
- [ ] Vérifier la création des tables dans la base de données.
- [ ] Tester les relations entre les tables (clés étrangères).
- [ ] S'assurer que les colonnes respectent les contraintes définies (non nul, unique, etc.).


## 1. Catégories de Dépenses
Créer les principales catégories de dépenses, claires et distinctes, pour une meilleure organisation :

- **Logement** (Loyer, factures)
- **Nourriture** (Courses, restaurants)
- **Transport** (Essence, transport public)
- **Santé** (Consultations, pharmacie)
- **Loisirs** (Activités, sorties)
- **Abonnements** (TV, streaming, sport)
- **Assurances**
- **Éducation** (Frais scolaires, formations)
- **Remboursements** (Prêts, dettes à récupérer)
- **Épargne** (Montants réservés)
- **Cadeaux et Événements** (Anniversaires, fêtes)
- **Divers** (Dépenses exceptionnelles)

---

## 2. Fonctionnalités de Gestion de Budget

### Plafond de Dépenses et Alertes
- [ ] **Définir un plafond global** : Budget mensuel à ne pas dépasser.
- [ ] **Définir des plafonds par catégorie** : Limites pour certaines catégories clés (ex. loisirs).
- [ ] **Alertes de seuil** : Notifications lorsqu’un plafond est approché ou dépassé, avec un indicateur visuel (ex. catégorie en rouge).

### Calcul et Suivi Automatique
- [ ] **Calcul automatique des dépenses par catégorie** : Totaliser les dépenses ajoutées.
- [ ] **Rappel de saisie** : Notifications régulières pour ne pas oublier d'ajouter de nouvelles dépenses.

### Saisie de Montants Simplifiée
- [ ] **Support des montants à virgule** : Faciliter l’entrée de montants décimaux sans devoir utiliser la virgule du pavé numérique.

---

## 3. Visualisation et Graphiques

### Vue d’ensemble et Graphiques
- [ ] **Tableau de bord principal** : Afficher le total des dépenses et le budget restant.
- [ ] **Graphique circulaire** : Visualisation des dépenses par catégorie avec des codes couleur.
- [ ] **Graphiques d’évolution** : Visualiser les dépenses au fil des mois pour chaque catégorie.

---

## 4. Expérience Utilisateur et Design

### Thème visuel et style
- [ ] **Thème "bord de mer"** : Palette de bleus avec des dégradés doux pour un style apaisant.
- [ ] **Couleurs indicatives** : Code couleur pour visualiser les catégories, ex. rouge pour les dépassements.
- [ ] **Navigation fluide** : Accès rapide aux principales sections (tableau de bord, dépenses, graphiques).

---

## 5. Tests et Validation

### Tests de fonctionnalité
- [ ] **Test de saisie des montants** : Vérifier la saisie et la précision des montants à virgule.
- [ ] **Test des notifications et alertes** : Valider les rappels et les alertes de dépassement.
- [ ] **Test de l’interface utilisateur** : Vérifier la lisibilité et la fluidité de la navigation.

---

Cette to-do list offre une vue complète des étapes à réaliser pour créer une application de gestion de budget intuitive et adaptée à ses besoins.
