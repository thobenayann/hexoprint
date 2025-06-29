# Configuration des Avis Google Places pour Hexoprint

Ce guide explique comment configurer la récupération automatique des vrais avis Google Business pour le site Hexoprint.

## 🎯 Vue d'ensemble

Le système récupère automatiquement les avis Google Business via l'API Google Places et les affiche sur la section témoignages du site. En cas d'erreur ou d'indisponibilité, il utilise des avis de fallback.

## 📋 Prérequis

- Un compte Google Cloud Platform
- Un profil Google Business actif pour Hexoprint
- Next.js 15 (déjà configuré)

## 🚀 Configuration étape par étape

### 1. Configuration Google Cloud Platform

#### A. Créer un projet (si pas déjà fait)

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet ou utiliser un existant
3. Activer la facturation (nécessaire même pour l'usage gratuit)

#### B. Activer l'API Places

1. Aller dans **APIs & Services** → **Library**
2. Rechercher "Places API"
3. Cliquer sur **Places API** et l'activer

#### C. Créer une clé API

1. Aller dans **APIs & Services** → **Credentials**
2. Cliquer sur **Create Credentials** → **API Key**
3. Copier la clé générée

#### D. Sécuriser la clé API (IMPORTANT)

1. Cliquer sur la clé pour l'éditer
2. **Application restrictions** :
    - Choisir "IP addresses" pour un serveur
    - Ajouter l'IP de votre serveur de production
3. **API restrictions** :
    - Sélectionner "Restrict key"
    - Cocher uniquement "Places API"
4. Sauvegarder

### 2. Trouver votre Place ID

#### Option A : Utiliser l'outil Google

1. Aller sur [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
2. Rechercher "Hexoprint Seysses" ou "Hexo'print"
3. Copier le Place ID généré

#### Option B : Recherche manuelle

1. Aller sur Google Maps
2. Rechercher votre entreprise
3. Dans l'URL, chercher le paramètre avec un long identifiant
4. Utiliser des outils en ligne pour extraire le Place ID

### 3. Configuration des variables d'environnement

Ajouter ces variables à votre fichier `.env.local` :

```bash
# API Google Places
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
HEXOPRINT_PLACE_ID=your_actual_place_id_here
```

### 4. Déploiement en production

#### Vercel

1. Aller dans votre dashboard Vercel
2. Sélectionner votre projet
3. Aller dans **Settings** → **Environment Variables**
4. Ajouter :
    - `GOOGLE_PLACES_API_KEY` = votre clé API
    - `HEXOPRINT_PLACE_ID` = votre Place ID

#### Autres plateformes

Ajouter les variables d'environnement selon la documentation de votre hébergeur.

## 🔧 Fonctionnement du système

### Architecture

```
Frontend (Client) → API Route (/api/reviews) → Google Places API
                      ↓
                   Transformation des données
                      ↓
                   Cache (1 heure)
                      ↓
                   Fallback si erreur
```

### Gestion des erreurs

Le système utilise plusieurs niveaux de fallback :

1. **Cache** : Évite les appels API répétés (1 heure)
2. **Avis mixtes** : Mélange vrais avis + fallbacks si peu d'avis
3. **Fallback complet** : Utilise les faux avis en cas d'erreur

### Filtrage intelligent

- Affiche seulement les avis 4-5 étoiles
- Limite le texte à 200 caractères
- Catégorise automatiquement (Professionnel/Particulier)
- Infère les rôles selon le contenu

## 🎨 Indicateurs visuels

### Badges de vérification

- Badge "Avis Google vérifiés" dans l'en-tête
- Badge "Google" sur chaque avis vérifié
- Icônes Shield pour la confiance

### États de chargement

- Spinner pendant le chargement
- Message d'erreur avec bouton "Réessayer"
- Transition fluide entre les états

## 📊 Monitoring et débogage

### Logs de développement

En mode développement, vous verrez dans la console :

```javascript
📊 Avis récupérés: {
  source: 'google',
  total: 4,
  googleCount: 2,
  fallbackCount: 2,
  reason: 'success'
}
```

### Sources d'avis possibles

- `google` : Vrais avis Google récupérés
- `cache` : Avis depuis le cache (1h)
- `fallback` : Avis de secours utilisés

### Résolution des problèmes courants

#### Erreur "Configuration must contain projectId"

- Vérifier que `GOOGLE_PLACES_API_KEY` est définie
- Vérifier que l'API Places est activée

#### Aucun avis affiché

- Vérifier le Place ID avec l'outil Google
- Vérifier que votre entreprise a des avis publics
- Vérifier les restrictions de la clé API

#### Erreur 403 ou quota dépassé

- Vérifier la facturation Google Cloud
- Vérifier les limites de quota de l'API

## 💰 Coûts

### API Google Places

- **Gratuit** : 25 000 requêtes/mois
- **Place Details** : $5 pour 1000 requêtes supplémentaires
- **Avec cache** : ~720 requêtes/mois pour un site actif

### Optimisations incluses

- Cache d'1 heure (réduit les appels de 99%)
- Fallback automatique (évite les erreurs)
- Champs limités (réduit les coûts)

## 🔄 Mise à jour manuelle

Pour forcer la mise à jour des avis :

1. Redémarrer l'application
2. Ou attendre 1 heure (expiration du cache)
3. Ou utiliser le bouton "Réessayer" en cas d'erreur

## 📞 Support

En cas de problème :

1. Vérifier les logs de la console
2. Tester l'API avec un outil comme Postman
3. Vérifier la configuration Google Cloud
4. Contacter le support technique si nécessaire

---

✅ **Une fois configuré, le système fonctionne automatiquement et affiche vos vrais avis Google Business sur le site !**
