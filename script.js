// 1. Initialisation sécurisée pour tous les appareils (y compris iOS/Safari)
let contacts = null;
try {
    contacts = JSON.parse(localStorage.getItem("mes_contacts"));
} catch (e) {
    console.log("Le stockage local est restreint.");
}

// Si la mémoire est vide ou inaccessible, on charge les contacts par défaut
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
    try {
        localStorage.setItem("mes_contacts", JSON.stringify(contacts));
    } catch (e) {
        console.log("Impossible de sauvegarder dans le stockage local.");
    }
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
    if (!zoneOnglets) return;
    zoneOnglets.innerHTML = "";
    
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    alphabet.forEach(lettre => {
        const bouton = document.createElement("button");
        bouton.textContent = lettre;
        if (lettre === lettreActive) {
            bouton.style.color = "#3498db";
        }
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
    if (!zoneListe) return;
    zoneListe.innerHTML = "";
    
    const contactsFiltres = contacts.filter(c => c.nom && c.nom.toUpperCase().startsWith(lettre));
    
    if (contactsFiltres.length === 0) {
        zoneListe.innerHTML = `<p style="color:#7f8c8d; padding:10px;">Aucun contact en ${lettre}</p>`;
        return;
    }
    
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
    if (!zoneFiche) return;
    
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
    // On ne peut pas pré-remplir un input type="file" pour des raisons de sécurité

    document.getElementById("zoneFormulaire").classList.remove("cacher");
}

function fermerFormulaire() {
    document.getElementById("zoneFormulaire").classList.add("cacher");
}

function soumettreFormulaire(event) {
    event.preventDefault();

    const fichierPhoto = document.getElementById("inputPhoto").files[0];
    
    function enregistrerLeContact(photoData) {
        const nouveauContact = {
            id: contactEnCoursDeModification ? contactEnCoursDeModification : Date.now(),
            nom: document.getElementById("inputNom").value,
            fixe: document.getElementById("inputFixe").value,
            mobile: document.getElementById("inputMobile").value,
            adresse: document.getElementById("inputAdresse").value,
            photo: photoData
        };

        if (contactEnCoursDeModification) {
            if (!fichierPhoto) {
                const ancienContact = contacts.find(c => c.id === contactEnCoursDeModification);
                nouveauContact.photo = ancienContact ? ancienContact.photo : "";
            }
            contacts = contacts.map(c => c.id === contactEnCoursDeModification ? nouveauContact : c);
        } else {
            contacts.push(nouveauContact);
        }

        sauvegarder();
        fermerFormulaire();
        
        if (nouveauContact.nom) {
            lettreActive = nouveauContact.nom.charAt(0).toUpperCase();
        }
        genererAlphabet();
        filtrerContacts(lettreActive);
        afficherFiche(nouveauContact);
    }

    if (fichierPhoto) {
        const reader = new FileReader();
        reader.onload = function(e) {
            enregistrerLeContact(e.target.result);
        };
        reader.readAsDataURL(fichierPhoto);
    } else {
        enregistrerLeContact("");
    }
}

// 6. Supprimer un contact
function supprimerContact(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
        contacts = contacts.filter(c => c.id !== id);
        sauvegarder();
        filtrerContacts(lettreActive);
        
        const zoneFiche = document.getElementById("zoneFiche");
        if (zoneFiche) {
            zoneFiche.className = "fiche-vide";
            zoneFiche.innerHTML = `<p>Sélectionnez un contact pour afficher ses coordonnées.</p>`;
        }
    }
}
