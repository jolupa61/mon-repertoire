// 1. Initialisation des contacts (charge depuis la mémoire du navigateur, ou utilise la base par défaut)
let contacts = JSON.parse(localStorage.getItem("mes_contacts"));

if (!contacts || contacts.length === 0) {
    contacts = [
        { id: 1, nom: "Abid Amine", fixe: "01 23 45 67 89", mobile: "06 12 34 56 78", adresse: "12 Rue de Paris, 75001 Paris", photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" },
        { id: 2, nom: "Bernard Chloé", fixe: "02 34 56 78 90", mobile: "07 89 01 23 45", adresse: "45 Avenue de Lyon, 69002 Lyon", photo: "" },
        { id: 3, nom: "Dupont Jean", fixe: "03 45 67 89 01", mobile: "06 99 88 77 66", adresse: "8 Boulevard de la Mer, 13008 Marseille", photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150" }
    ];
    sauvegarder();
}

let lettreActive = "A";
let contactEnCoursDeModification = null;

function sauvegarder() {
    localStorage.setItem("mes_contacts", JSON.stringify(contacts));
}

// 2. Page de garde
function ouvrirRepertoire() {
    document.getElementById("pageGarde").classList.add("cacher");
    document.getElementById("ongletsAZ").parentElement.classList.remove("cacher");
    genererAlphabet();
    filtrerContacts(lettreActive);
}

function genererAlphabet() {
    const zoneOnglets = document.getElementById("ongletsAZ");
    zoneOnglets.innerHTML = "";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    alphabet.forEach(lettre => {
        const bouton = document.createElement("button");
        bouton.textContent = lettre;
        if(lettre === lettreActive) bouton.style.color = "#3498db";
        bouton.onclick = () => {
            lettreActive = lettre;
            genererAlphabet();
            filtrerContacts(lettre);
        };
        zoneOnglets.appendChild(bouton);
    });
}

// 3. Afficher la liste
function filtrerContacts(lettre) {
    const zoneListe = document.getElementById("zoneListe");
    zoneListe.innerHTML = "";
    
    const contactsFiltres = contacts.filter(c => c.nom.toUpperCase().startsWith(lettre));
    
    if (contactsFiltres.length === 0) {
        zoneListe.innerHTML = `<p style="color:#7f8c8d; padding:10px;">Aucun contact en ${lettre}</p>`;
        return;
    }
    
    // Trier par ordre alphabétique
    contactsFiltres.sort((a, b) => a.nom.localeCompare(b.nom));

    contactsFiltres.forEach(contact => {
        const ligne = document.createElement("div");
        ligne.className = "ligne-contact";
        ligne.textContent = contact.nom;
        ligne.onclick = () => afficherFiche(contact);
        zoneListe.appendChild(ligne);
    });
}

// 4. Afficher les détails d'un contact
function afficherFiche(contact) {
    const zoneFiche = document.getElementById("zoneFiche");
    const photoAffichage = contact.photo ? contact.photo : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    
    zoneFiche.className = "fiche-active";
    zoneFiche.innerHTML = `
        <div class="fiche-header">
            <img src="${photoAffichage}" alt="Photo" class="contact-photo">
            <h3>${contact.nom}</h3>
        </div>
        <div class="fiche-details">
            <p><strong>📞 Fixe :</strong> ${contact.fixe}</p>
            <p><strong>📱 Mobile :</strong> ${contact.mobile}</p>
            <p><strong>🏠 Adresse :</strong> ${contact.adresse}</p>
        </div>
        <div class="fiche-actions">
            <button class="btn-action btn-modifier" onclick="ouvrirFormulaireModifier(${contact.id})">✏️ Modifier</button>
            <button class="btn-action btn-supprimer" onclick="supprimerContact(${contact.id})">🗑️ Supprimer</button>
        </div>
    `;
}

// 5. Gestion du Formulaire (Ajouter / Modifier)
function ouvrirFormulaireAjouter() {
    contactEnCoursDeModification = null;
    document.getElementById("formTitre").textContent = "Nouveau Contact";
    document.getElementById("formContact").reset();
    document.getElementById("zoneFormulaire").classList.remove("cacher");
}

function ouvrirFormulaireModifier(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;

    contactEnCoursDeModification = id;
    document.getElementById("formTitre").textContent = "Modifier le Contact";
    
    document.getElementById("inputNom").value = contact.nom;
    document.getElementById("inputFixe").value = contact.fixe;
    document.getElementById("inputMobile").value = contact.mobile;
    document.getElementById("inputAdresse").value = contact.adresse;
    document.getElementById("inputPhoto").value = contact.photo;

    document.getElementById("zoneFormulaire").classList.remove("cacher");
}

function fermerFormulaire() {
    document.getElementById("zoneFormulaire").classList.add("cacher");
}

function soumettreFormulaire(event) {
    event.preventDefault();

    const nouveauContact = {
        id: contactEnCoursDeModification ? contactEnCoursDeModification : Date.now(),
        nom: document.getElementById("inputNom").value,
        fixe: document.getElementById("inputFixe").value,
        mobile: document.getElementById("inputMobile").value,
        adresse: document.getElementById("inputAdresse").value,
        photo: document.getElementById("inputPhoto").value
    };

    if (contactEnCoursDeModification) {
        // Mode modification : on remplace l'ancien par le nouveau
        contacts = contacts.map(c => c.id === contactEnCoursDeModification ? nouveauContact : c);
    } else {
        // Mode ajout : on l'ajoute à la liste
        contacts.push(nouveauContact);
    }

    sauvegarder();
    fermerFormulaire();
    
    // Forcer la liste à se mettre à jour sur la première lettre du nom saisi
    lettreActive = nouveauContact.nom.charAt(0).toUpperCase();
    genererAlphabet();
    filtrerContacts(lettreActive);
    afficherFiche(nouveauContact);
}

// 6. Supprimer un contact
function supprimerContact(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
        contacts = contacts.filter(c => c.id !== id);
        sauvegarder();
        filtrerContacts(lettreActive);
        
        // Remettre la fiche à l'état vide
        const zoneFiche = document.getElementById("zoneFiche");
        zoneFiche.className = "fiche-vide";
        zoneFiche.innerHTML = `<p>Sélectionnez un contact pour afficher ses coordonnées.</p>`;
    }
}
