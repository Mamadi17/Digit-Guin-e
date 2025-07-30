'use strict';
        
// Utilisation du localStorage réel pour la persistance des données
const storage = localStorage;

// Données des produits
const PRODUCTS_DATA = {
    products: [
        {
            id: 1, 
            name: "iPhone 15 Pro", 
            prix: 1200000, 
            rating:4.6,
            category: "electronique", 
            image: "photo/iphone.png",
            description: "Le dernier iPhone avec puce A17 Pro"
        },
        {
            id: 2,
            name: "MacBook Air M2", 
            prix: 1800000, 
            category: "electronique", 
            rating:4.1,
            image: "photo/macbook.png",
            description: "Ultrabook puissant avec puce Apple M2"
        },
        {
            id: 3, 
            name: "Samsung Galaxy S24", 
            prix: 950000,
            rating:4.2, 
            category: "electronique", 
            image: "photo/Samsung Galaxy S24.png",
            description: "Smartphone Android haut de gamme"
        },
        {
            id: 4, 
            name: "iPad Pro 12.9", 
            prix: 1400000,
            rating:4.4,
            category: "electronique", 
            image: "photo/iPad Pro 12.9.png",
            description: "Tablette professionnelle avec écran Retina"
        },
        {
            id: 5, 
            name: "Lenovo L460", 
            prix: 1400000,
            rating:4.7, 
            category: "electronique", 
            image: "photo/lenovo.png",
            description: "lLenovo-thinkpad-L460-14-1-pouces-core-i5-2-4-ghz"
        },
        {
            id: 10, 
            name: "Robe de mariage", 
            prix: 5500000,
            rating:4.5, 
            category: "mode", 
            image: "photo/robe de mariage.png",
            description: "Robe de mariage de luxe"
        },
        {
            id: 11, 
            name: "Veste", 
            prix: 1500000,
            rating:4.5, 
            category: "mode", 
            image: "photo/veste.png",
            description: "Veste de luxe pour homme"
        },
        {
            id: 12, 
            name: "T-shirt", 
            prix: 10000,
            rating:4.5, 
            category: "mode", 
            image: "photo/t-short.png",
            description: "T-short de bonne qualité"
        },
        {
            id: 13, 
            name: "Chaussure", 
            prix: 550000,
            rating:4.5, 
            category: "mode", 
            image: "photo/chausure.png",
            description: "Chaussure de luxe pour homme"
        },
        {
            id: 14, 
            name: "Sac", 
            prix: 200000, 
            category: "mode", 
            image: "photo/sac.png",
            description: "Sac a main de luxe"
        },
        {
            id: 20, 
            name: "Canapé", 
            prix: 3050000,
            rating:4.5, 
            category: "maison", 
            image: "photo/canape .png",
            description: "Canapé pour salon"
        },
        {
            id: 21, 
            name: "Déco", 
            prix: 4200000,
            rating:4.5, 
            category: "maison", 
            image: "photo/decoration.png",
            description: "Décoration pour salon"
        },
        {
            id: 22, 
            name: "Fauteuil", 
            prix: 4000000,
            rating:4.5, 
            category: "maison", 
            image: "photo/fauteuil.png",
            description: "Fauteuil de luxe"
        },
        {
            id: 23, 
            name: "Matelas", 
            prix: 1700000,
            rating:4.5, 
            category: "maison", 
            image: "photo/lit.png",
            description: "Matelas gonflable"
        }
    ]
};

let panier = []; // Panier vide

// Fonction pour naviguer entre les vues
function naviguerVers(viewId) {
    // Masquer toutes les vues
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    // Afficher la vue demandée
    if(viewId === 'cart') {
        document.getElementById('panier-vue').classList.add('active');
    } else {
        document.getElementById(`${viewId}-view`).classList.add('active');
    }

    // Mettre à jour les liens de navigation actifs
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.view === viewId) {
            link.classList.add('active');
        }
    });

    // Masquer le menu mobile si ouvert
    document.getElementById('mobile-nav').classList.remove('show');

    // Si on navigue vers la page produits, s'assurer que tous les produits sont affichés
    if (viewId === 'products') {
        afficherProduits(PRODUCTS_DATA.products);
        document.querySelector('.filter-btn[data-category="all"]').classList.add('active');
        document.getElementById('products-search-input').value = ''; // Clear search on products view
    } else if (viewId === 'cart') {
        afficherPanier();
    }
    afficherOuMasquerRecherche();
}

function afficherOuMasquerRecherche() {
    const search = document.getElementById('header-search-container');
    const panierVue = document.getElementById('panier-vue');
    if (search && panierVue) {
        if (panierVue.classList.contains('active')) {
            search.style.display = 'none';
        } else {
            search.style.display = 'flex';
        }
    }
}

// Fonction pour basculer le menu mobile
function toggleMobileMenu() {
    document.getElementById('mobile-nav').classList.toggle('show');
}

// Fonction pour afficher les étoiles de notation
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    return starsHtml;
}


// Fonction pour rendre les produits
function afficherProduits(productsToRender) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = ''; // Vider la grille actuelle

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: var(--text-light);">Aucun produit trouvé pour votre recherche.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">${renderStars(product.rating)}</div>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-meta">
                    <span class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.prix.toLocaleString('fr-GN')} GNF</span>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Ajouter
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Ajouter les écouteurs d'événements pour les boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.currentTarget.dataset.productId);
            ajouterAuPanier(productId);
        });
    });
}

// Fonction pour filtrer les produits par catégorie
function filtrerParCategorie(category) {
    // Mettre à jour les boutons de filtre actifs
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[data-category="${category}"]`).classList.add('active');

    // Filtrer les produits
    let filteredProducts = [];
    if (category === 'all') {
        filteredProducts = PRODUCTS_DATA.products;
    } else {
        filteredProducts = PRODUCTS_DATA.products.filter(product => product.category === category);
    }
    // Réinitialiser la recherche lors du changement de catégorie
    document.getElementById('products-search-input').value = '';
    afficherProduits(filteredProducts);
}

// Fonction pour filtrer par catégorie et naviguer vers la vue produits
function filtrerEtNaviguerCategorie(category) {
    naviguerVers('products');
    filtrerParCategorie(category);
}

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(productId) {
    const product = PRODUCTS_DATA.products.find(p => p.id === productId);
    if (product) {
        const existingItem = panier.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            panier.push({ ...product, quantity: 1 });
        }
        sauvegarderPanier();
        majBadgePanier();
        afficherPanier();
        showNotification('Produit ajouté au panier', 'success');
    }
}

// Fonction pour mettre à jour la quantité d'un produit dans le panier
function modifierQuantite(productId, change) {
    const item = panier.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            retirerDuPanier(productId);
        } else {
            sauvegarderPanier();
            afficherPanier();
            majBadgePanier();
            // Animate quantity display and total
            const quantityDisplay = document.querySelector(`#quantity-${productId}`);
            const itemTotal = document.querySelector(`#item-total-${productId}`);
            if (quantityDisplay) {
                quantityDisplay.classList.add('animate-scale');
                setTimeout(() => quantityDisplay.classList.remove('animate-scale'), 300);
            }
            if (itemTotal) {
                itemTotal.classList.add('animate-scale');
                setTimeout(() => itemTotal.classList.remove('animate-scale'), 300);
            }
        }
    }
}

// Fonction pour retirer un produit du panier
function retirerDuPanier(productId) {
    const initialCartLength = panier.length;
    panier = panier.filter(item => item.id !== productId);
    if (panier.length < initialCartLength) {
        sauvegarderPanier();
        afficherPanier();
        majBadgePanier();
        // Add bounce animation to the remove button if it was clicked
        const removeBtn = document.querySelector(`.btn-supprimer[data-product-id="${productId}"]`);
        if (removeBtn) {
            removeBtn.classList.add('animate-bounce');
            setTimeout(() => removeBtn.classList.remove('animate-bounce'), 300);
        }
    }
}

// Fonction pour vider complètement le panier
function viderPanier() {
    if (panier.length > 0) {
        panier = [];
        sauvegarderPanier();
        afficherPanier();
        majBadgePanier();
        // showNotification("Panier vidé !", 'error'); // Ligne commentée pour désactiver la notification
    }
}

// Fonction pour rendre le contenu du panier
function afficherPanier() {
    const contenuPanier = document.getElementById('contenu-panier');
    const panierVide = document.getElementById('panier-vide');
    const resumePanier = document.getElementById('resume-panier');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const totalAmount = document.getElementById('total-amount');
    const btnCommander = document.getElementById('btn-commander');
    const btnViderPanier = document.getElementById('btn-vider-panier');

    contenuPanier.innerHTML = ''; // Vider le contenu actuel du panier

    if (panier.length === 0) {
        panierVide.style.display = 'block';
        resumePanier.style.display = 'none';
    } else {
        panierVide.style.display = 'none';
        resumePanier.style.display = 'block';

        let subtotal = 0;
        panier.forEach(item => {
            const itemTotal = item.prix * item.quantity;
            subtotal += itemTotal;

            const articlePanierDiv = document.createElement('div');
            articlePanierDiv.classList.add('article-panier');
            articlePanierDiv.innerHTML = `
                <div class="image-article">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="info-article">
                    <h3 class="nom-article">${item.name}</h3>
                    <p class="prix-article">${item.prix.toLocaleString('fr-GN')} GNF / pièce</p>
                </div>
                <div class="controle-quantite">
                    <button class="btn-quantite decrease-quantity" data-product-id="${item.id}">-</button>
                    <span class="affichage-quantite" id="quantity-${item.id}">${item.quantity}</span>
                    <button class="btn-quantite increase-quantity" data-product-id="${item.id}">+</button>
                </div>
                <div class="actions-article">
                    <span class="total-article" id="item-total-${item.id}">${itemTotal.toLocaleString('fr-GN')} GNF</span>
                    <button class="btn-supprimer" data-product-id="${item.id}">Supprimer</button>
                </div>
            `;
            contenuPanier.appendChild(articlePanierDiv);
        });

        subtotalAmount.textContent = `${subtotal.toLocaleString('fr-GN')} GNF`;
        totalAmount.textContent = `${subtotal.toLocaleString('fr-GN')} GNF`; // Pour l'instant, livraison gratuite

        // Ajouter les écouteurs d'événements pour les boutons de quantité et de suppression
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.currentTarget.dataset.productId);
                modifierQuantite(productId, -1);
            });
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.currentTarget.dataset.productId);
                modifierQuantite(productId, 1);
            });
        });

        document.querySelectorAll('.btn-supprimer').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.currentTarget.dataset.productId);
                retirerDuPanier(productId);
            });
        });

        btnCommander.onclick = () => showNotification("Fonctionnalité de paiement non implémentée.", 'info');
        if (btnViderPanier) {
            btnViderPanier.onclick = viderPanier;
        }
    }
}

// Fonction pour mettre à jour le badge du panier
function majBadgePanier() {
    const totalItems = panier.reduce((sum, item) => sum + item.quantity, 0);
    const badgePanier = document.getElementById('badge-panier');
    const badgePanierMobile = document.getElementById('badge-panier-mobile');

    if (totalItems > 0) {
        badgePanier.textContent = totalItems;
        badgePanier.classList.remove('hidden');
        badgePanierMobile.textContent = totalItems;
        badgePanierMobile.classList.remove('hidden');
    } else {
        badgePanier.classList.add('hidden');
        badgePanierMobile.classList.add('hidden');
    }
}

// Fonction pour sauvegarder le panier dans le stockage local
function sauvegarderPanier() {
    try {
        storage.setItem('digitGuineeCart', JSON.stringify(panier));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde du panier dans le stockage local:", e);
    }
}

// Fonction pour charger le panier depuis le stockage local
function chargerPanier() {
    try {
        const storedCart = storage.getItem('digitGuineeCart');
        if (storedCart) {
            panier = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error("Erreur lors du chargement du panier depuis le stockage local:", e);
        panier = []; // Réinitialiser le panier en cas d'erreur
    }
}

function normalizeString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Fonction de recherche générique
function effectuerRecherche(query, targetInputId, targetGridId) {
    const normalizedQuery = normalizeString(query.trim());
    const productsToSearch = PRODUCTS_DATA.products;
    const filteredProducts = productsToSearch.filter(product =>
        normalizeString(product.name).includes(normalizedQuery) ||
        normalizeString(product.category).includes(normalizedQuery)
    );

    // Si la recherche est lancée depuis la page d'accueil, naviguer vers la page produits
    if (targetGridId === 'products-grid' && document.getElementById('home-view').classList.contains('active')) {
        naviguerVers('products');
        document.getElementById('products-search-input').value = query;
    }
    
    // Désactiver tous les boutons de filtre de catégorie lorsque la recherche est active
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    afficherProduits(filteredProducts);
}

// Écouteurs d'événements pour les barres de recherche
document.addEventListener('DOMContentLoaded', () => {
    const productsSearchInput = document.getElementById('products-search-input');
    const productsSearchBtn = document.getElementById('products-search-btn');

    // Recherche dynamique sur la page des produits
    productsSearchBtn.addEventListener('click', () => {
        effectuerRecherche(productsSearchInput.value, 'products-search-input', 'products-grid');
    });
    productsSearchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (value === '') {
            afficherProduits(PRODUCTS_DATA.products);
        } else {
            effectuerRecherche(value, 'products-search-input', 'products-grid');
        }
    });

    // Initialisation de l'application
    chargerPanier();
    afficherPanier();
    majBadgePanier();
    afficherProduits(PRODUCTS_DATA.products); // Afficher tous les produits au démarrage
    naviguerVers('home'); // Commencer sur la page d'accueil
});

function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification-toast');
    let icon = '';
    if (type === 'success') {
        icon = '<span class="notif-icon"><i class="fas fa-check-circle"></i></span>';
    } else if (type === 'error') {
        icon = '<span class="notif-icon"><i class="fas fa-times-circle"></i></span>';
    } else {
        icon = '<span class="notif-icon"><i class="fas fa-info-circle"></i></span>';
    }
    notif.innerHTML = icon + '<span>' + message + '</span>';
    notif.classList.add('show');
    setTimeout(() => {
        notif.classList.remove('show');
    }, 2000);
}
