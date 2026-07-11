// 1. Base de données de tes contacts (tu pourras en ajouter d'autres ici !)
const contacts = [
    { nom: "Abid Amine", fixe: "01 23 45 67 89", mobile: "06 12 34 56 78", adresse: "12 Rue de Paris, 75001 Paris", photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" },
    { nom: "Bernard Chloé", fixe: "02 34 56 78 90", mobile: "07 89 01 23 45", adresse: "45 Avenue de Lyon, 69002 Lyon", photo: "" }, // Sans photo (avatar par défaut)
    { nom: "Dupont Jean", fixe: "03 45 67 89 01", mobile: "06 99 88 77 66", adresse: "8 Boulevard de la Mer, 13008 Marseille", photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150" },
    { nom: "Durand Marie", fixe: "04 56 78 90 12", mobile: "06 55 44 33 22", adresse: "22 Rue des Fleurs, 33000 Bordeaux", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
    { nom: "Martin Sophie", fixe: "05 67 89 01 23", mobile: "07 11 22 33 44", adresse: "3 Avenue des Alpes, 06000 Nice", photo: "" }
];

// 2. Fonction pour la Page de Garde (Ouvrir le répertoire)
function ouvrirRepertoire() {
    document.getElementById("pageGarde").classList.add("cacher");
    document.getElementById("ongletsAZ").parentElement.classList.remove("cacher");
    genererAlphabet();
}

// 3. Générer automatiquement les onglets de A à Z
function genererAlphabet() {
    const zoneOnglets = document.getElementById("ongletsAZ");
    zoneOnglets.innerHTML = ""; // On vide au cas où
    
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    alphabet.forEach(lettre => {
        const bouton = document.createElement("button");
        bouton.textContent = lettre;
        bouton.onclick = () => filtrerContacts(lettre);
        zoneOnglets.appendChild(bouton);
    });
}

// 4. Filtrer et afficher la liste des contacts pour la lettre sélectionnée
function filtrerContacts(lettre) {
    const zoneListe = document.getElementById("zoneListe");
    zoneListe.innerHTML = ""; // On vide la liste précédente
    
    // Filtrer les contacts qui commencent par la bonne lettre
    const contactsFiltres = contacts.filter(c => c.nom.toUpperCase().startsWith(lettre));
    
    if (contactsFiltres.length === 0) {
        zoneListe.innerHTML = `<p style="color:#7f8c8d; padding:10px;">Aucun contact en ${lettre}</p>`;
        return;
    }
    
    // Créer les lignes cliquables
    contactsFiltres.forEach(contact => {
        const ligne = document.createElement("div");
        ligne.className = "ligne-contact";
        ligne.textContent = contact.nom;
        ligne.onclick = () => afficherFiche(contact);
        zoneListe.appendChild(ligne);
    });
}

// 5. Afficher les détails du contact cliqué
function afficherFiche(contact) {
    const zoneFiche = document.getElementById("zoneFiche");
    
    // Si pas de photo, on utilise un avatar anonyme par défaut
    const photoAffichage = contact.photo ? contact.photo : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    
    zoneFiche.className = "fiche-active";
    zoneFiche.innerHTML = `
        <div class="fiche-header">
            <img src="${photoAffichage}" alt="Photo de ${contact.nom}" class="contact-photo">
            <h3>${contact.nom}</h3>
        </div>
        <div class="fiche-details">
            <p><strong>📞 Téléphone Fixe :</strong> ${contact.fixe}</p>
            <p><strong>📱 Téléphone Mobile :</strong> ${contact.mobile}</p>
            <p><strong>🏠 Adresse :</strong> ${contact.adresse}</p>
        </div>
    `;
}
