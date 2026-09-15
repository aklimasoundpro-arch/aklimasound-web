export const CONTACT = {
  wa1: "22897675764", // SEUL numéro de redirection WhatsApp
  wa1Display: "+228 97 67 57 64",
  phones: [
    { tel: "+22897675764", display: "+228 97 67 57 64" },
    { tel: "+22897829799", display: "+228 97 82 97 99" },
    { tel: "+22870771483", display: "+228 70 77 14 83" },
  ],
  email: "aklimasoundpro@gmail.com",
  city: { fr: "Lomé, Togo", en: "Lomé, Togo" },
  tiktok: "https://tiktok.com/@aklimasoundpro",
  instagram: "https://instagram.com/aklimasoundpro",
};

export const waLink = (num: string, msg: string) =>
  `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

export type Offer = {
  name: string;
  price: number | null;
  priceLabel?: { fr: string; en: string };
  includes: { fr: string; en: string };
  limits: { fr: string; en: string };
  cap: number; // jauge max (pers.)
  star?: boolean;
};

export type Domain = {
  slug: string;
  icon: string;
  name: { fr: string; en: string };
  tagline: { fr: string; en: string };
  hero: string; // image
  offers: Offer[];
  estimate?: boolean; // tarifs estimés, à valider par le client
};

export const DOMAINS: Domain[] = [
  {
    slug: "concert-chorale",
    icon: "mic",
    name: { fr: "Concerts & Chorales", en: "Concerts & Choirs" },
    tagline: {
      fr: "Clarté acoustique absolue pour sublimer voix et instruments live. Gestion multi-micros et retours précis.",
      en: "Absolute acoustic clarity to elevate live voices and instruments. Multi-mic management and precise monitors.",
    },
    hero: "/img/realisation-scene.jpg",
    offers: [
      { name: "Pack Chœur Intimiste", price: 120000, cap: 150, includes: { fr: "2 enceintes amplifiées + 4 micros filaires + console 12 voies + 1 technicien.", en: "2 powered speakers + 4 wired mics + 12-channel console + 1 technician." }, limits: { fr: "Max 150 pers. en intérieur. Pas de retours individuels.", en: "Max 150 people indoors. No individual monitors." } },
      { name: "Pack Harmony Live", price: 250000, cap: 500, star: true, includes: { fr: "Système façade complet + 8 micros chœur + 2 micros HF + retours scène + console numérique 24 voies + 2 techniciens.", en: "Full FOH system + 8 choir mics + 2 HF mics + stage monitors + 24-channel digital console + 2 technicians." }, limits: { fr: "Max 500 pers. Éclairage basique non inclus.", en: "Max 500 people. Basic lighting not included." } },
      { name: "Pack Majesté Divine", price: 450000, cap: 99999, includes: { fr: "Sono forte puissance + captation multi-pistes + multipaire + pack lumières (PAR LED / lyres) + 3 techniciens.", en: "High-power sound + multitrack recording + stage box + lighting pack (PAR LED / moving heads) + 3 technicians." }, limits: { fr: "Grands auditoriums / églises (+500 pers).", en: "Large auditoriums / churches (500+ people)." } },
    ],
  },
  {
    slug: "mariage",
    icon: "gem",
    name: { fr: "Mariages & Réceptions", en: "Weddings & Receptions" },
    tagline: {
      fr: "Souvenirs inoubliables avec un son cristallin, une régie DJ dynamique et une mise en lumière féerique de la piste.",
      en: "Unforgettable memories with crystal-clear sound, a dynamic DJ booth and magical dance-floor lighting.",
    },
    hero: "/img/realisation-engineer2.jpg",
    offers: [
      { name: "Pack Vin d'Honneur", price: 75000, cap: 100, includes: { fr: "2 enceintes + 2 micros sans fil (discours) + mixage musique d'ambiance.", en: "2 speakers + 2 wireless mics (speeches) + background music mixing." }, limits: { fr: "Max 100 invités. Pas de DJ / pas de lumières.", en: "Max 100 guests. No DJ / no lighting." } },
      { name: "Pack Noces d'Or", price: 150000, cap: 300, star: true, includes: { fr: "Système son complet (façade + caisson de basse) + 2 micros HF + 1 régisseur/DJ + éclairage piste de danse.", en: "Complete sound system (FOH + subwoofer) + 2 HF mics + 1 director/DJ + dance-floor lighting." }, limits: { fr: "Max 300 invités. Heures sup. au-delà de 2h du matin en option.", en: "Max 300 guests. Overtime past 2 am optional." } },
      { name: "Pack Prestige Royal", price: 300000, cap: 99999, includes: { fr: "Sono HD + pack lumières architecturales LED + effets spéciaux (fumée lourde / étincelles) + régie dédiée.", en: "HD sound + architectural LED lighting pack + special effects (heavy fog / sparks) + dedicated booth." }, limits: { fr: "Nécessite un accès électrique stable sur le site.", en: "Requires stable power supply on site." } },
    ],
  },
  {
    slug: "entreprise",
    icon: "briefcase",
    name: { fr: "Entreprises & Institutions", en: "Companies & Institutions" },
    tagline: {
      fr: "Séminaires et galas sans larsen ni coupure. Diffusion homogène, micros HF et facturation professionnelle.",
      en: "Seminars and galas without feedback or dropouts. Even coverage, HF mics and professional invoicing.",
    },
    hero: "/img/realisation-regie.jpg",
    offers: [
      { name: "Pack Executive", price: 80000, cap: 80, includes: { fr: "2 enceintes sur pied + 2 micros pupitre/HF + câblage propre et discret + 1 technicien ponctuel.", en: "2 speakers on stands + 2 podium/HF mics + clean discreet cabling + 1 punctual technician." }, limits: { fr: "Max 80 pers. en salle de réunion.", en: "Max 80 people in a meeting room." } },
      { name: "Pack Séminaire & Gala", price: 180000, cap: 300, star: true, includes: { fr: "Sonorisation à répartition homogène + 4 micros HF + console audio + assistance technique continue + facture pro.", en: "Even-coverage sound + 4 HF mics + audio console + continuous technical support + pro invoice." }, limits: { fr: "Max 300 pers. Vidéoprojecteur en option.", en: "Max 300 people. Video projector optional." } },
      { name: "Pack Convention Corporate", price: 350000, cap: 99999, includes: { fr: "Système Line Array compact + micros casques/cravates + enregistrement audio des interventions + éclairage scène.", en: "Compact Line Array system + headset/lavalier mics + speech recording + stage lighting." }, limits: { fr: "Fiche technique demandée au préalable.", en: "Technical rider required beforehand." } },
    ],
  },
  {
    slug: "anniversaire",
    icon: "party",
    name: { fr: "Anniversaires & Fêtes Privées", en: "Birthdays & Private Parties" },
    tagline: {
      fr: "Anniversaires, réceptions privées et fêtes à thème : une ambiance maîtrisée de la première à la dernière minute.",
      en: "Birthdays, private receptions and themed parties: a controlled vibe from the first to the last minute.",
    },
    hero: "/img/realisation-console.jpg",
    offers: [
      { name: "Pack Mini Party", price: 50000, cap: 70, includes: { fr: "2 enceintes amplifiées + 1 micro filaire + câble Aux/Bluetooth + 1 technicien d'installation.", en: "2 powered speakers + 1 wired mic + Aux/Bluetooth cable + 1 setup technician." }, limits: { fr: "Formule compacte, max 70 pers.", en: "Compact formula, max 70 people." } },
      { name: "Pack Célébration", price: 100000, cap: 200, star: true, includes: { fr: "2 enceintes + 1 subwoofer + 2 micros sans fil + jeu de lumière basique + 1 technicien/opérateur.", en: "2 speakers + 1 subwoofer + 2 wireless mics + basic light set + 1 technician/operator." }, limits: { fr: "Max 200 pers.", en: "Max 200 people." } },
      { name: "Pack VIP Lounge", price: 200000, cap: 99999, includes: { fr: "Setup son complet forte basse + éclairage dynamique + DJ/animateur partenaire + machine à fumée.", en: "Full bass-heavy sound setup + dynamic lighting + partner DJ/host + fog machine." }, limits: { fr: "Durée max de prestation : 8 heures.", en: "Max service duration: 8 hours." } },
    ],
  },
  {
    slug: "religieux",
    icon: "church",
    name: { fr: "Événements Religieux & Cultes", en: "Religious Events & Services" },
    tagline: {
      fr: "Croisades, cultes en plein air et conventions : projection acoustique longue portée et anti-larsen.",
      en: "Crusades, open-air services and conventions: long-throw, feedback-free acoustic projection.",
    },
    hero: "/img/hero-eglise.jpg",
    offers: [
      { name: "Pack Rassemblement", price: 100000, cap: 200, includes: { fr: "2 enceintes longue portée + 2 micros sans fil + 1 technicien.", en: "2 long-throw speakers + 2 wireless mics + 1 technician." }, limits: { fr: "Max 200 pers. en extérieur.", en: "Max 200 people outdoors." } },
      { name: "Pack Croisade & Louange", price: 220000, cap: 600, star: true, includes: { fr: "4 enceintes + 2 caissons de basse + console 16 voies + micros chant/prédicateur + 2 techniciens.", en: "4 speakers + 2 subwoofers + 16-channel console + worship/preacher mics + 2 technicians." }, limits: { fr: "Max 600 pers.", en: "Max 600 people." } },
      { name: "Pack Grand Réveil", price: 400000, cap: 99999, includes: { fr: "Matériel de forte projection acoustique (anti-larsen) + régie complète + groupe électrogène de secours.", en: "High-projection acoustic gear (anti-feedback) + full booth + backup generator." }, limits: { fr: "Repérage terrain 24 h avant requis.", en: "Site survey required 24 h ahead." } },
    ],
  },
  {
    slug: "horeca",
    icon: "martini",
    name: { fr: "HORECA, Bars & Maquis", en: "HORECA, Bars & Maquis" },
    tagline: {
      fr: "Animations du weekend, inaugurations et soirées à thème : un son percutant qui fait revenir vos clients.",
      en: "Weekend animations, openings and themed nights: punchy sound that brings your customers back.",
    },
    hero: "/img/realisation-ingenieur.jpg",
    offers: [
      { name: "Pack Weekend Pop", price: 60000, cap: 120, includes: { fr: "2 enceintes compactes + 1 micro sans fil pour animations / jeux concours.", en: "2 compact speakers + 1 wireless mic for animations / contests." }, limits: { fr: "Prestation de 18 h à 00 h max.", en: "Service from 6 pm to midnight max." } },
      { name: "Pack Soirée Thématique", price: 120000, cap: 300, star: true, includes: { fr: "Sonorisation percutante (terrasse / plein air) + jeux de lumières + technicien présent toute la nuit.", en: "Punchy sound (terrace / open air) + light sets + technician present all night." }, limits: { fr: "Uniquement pour événements ponctuels.", en: "One-off events only." } },
      { name: "Pack Residency (mensuel)", price: 300000, cap: 99999, includes: { fr: "Mise à disposition de matériel 2 à 3 weekends par mois avec suivi technique.", en: "Equipment provided 2 to 3 weekends per month with technical follow-up." }, limits: { fr: "Contrat d'engagement de 3 mois min.", en: "Minimum 3-month commitment." } },
    ],
  },
  {
    slug: "festival",
    icon: "ticket",
    name: { fr: "Festivals & Spectacles", en: "Festivals & Shows" },
    tagline: {
      fr: "Grands espaces et plein air : Line Array suspendu, retours séparés et équipe dédiée.",
      en: "Large venues and open air: flown Line Array, separate monitor world and dedicated crew.",
    },
    hero: "/img/realisation-regie.jpg",
    offers: [
      { name: "Pack Scène Émergente", price: 300000, cap: 800, includes: { fr: "Façade 4000 W + retours bain de pieds + kit micros batterie/instruments + 2 techniciens.", en: "4000 W FOH + wedge monitors + drum/instrument mic kit + 2 technicians." }, limits: { fr: "Max 800 pers.", en: "Max 800 people." } },
      { name: "Pack Outdoor Festival", price: 650000, cap: 2500, star: true, includes: { fr: "Système Line Array suspendu/stacked + régie retour séparée + éclairage de scène complet + 4 techniciens.", en: "Suspended/stacked Line Array system + separate monitor booth + full stage lighting + 4 technicians." }, limits: { fr: "Jauge 1000 à 2500 pers.", en: "Capacity 1,000 to 2,500 people." } },
      { name: "Pack Main Stage Pro", price: null, priceLabel: { fr: "Sur devis (+1 M FCFA)", en: "On quote (1M+ FCFA)" }, cap: 99999, includes: { fr: "Configuration sur-mesure lourde + structure de scène + distribution électrique haute capacité + équipe dédiée.", en: "Heavy bespoke configuration + stage structure + high-capacity power distribution + dedicated crew." }, limits: { fr: "Fiche technique d'artiste requise.", en: "Artist technical rider required." } },
    ],
  },
  {
    slug: "funerailles",
    icon: "flower",
    estimate: true,
    name: { fr: "Funérailles & Hommages", en: "Funerals & Memorials" },
    tagline: {
      fr: "Cérémonies d'hommage dignes et sereines : sonorisation discrète, micros pupitre et musique maîtrisée, veillée comme jour J.",
      en: "Dignified, serene memorial ceremonies: discreet sound, podium mics and controlled music, from vigil to service day.",
    },
    hero: "/img/hero-eglise.jpg",
    offers: [
      { name: "Pack Hommage", price: 100000, cap: 150, includes: { fr: "2 enceintes colonne + 2 micros pupitre + diffusion musicale sobre + 1 technicien discret.", en: "2 column speakers + 2 podium mics + sober music playback + 1 discreet technician." }, limits: { fr: "Max 150 pers. Intérieur ou cour.", en: "Max 150 people. Indoor or courtyard." } },
      { name: "Pack Cérémonie", price: 180000, cap: 400, star: true, includes: { fr: "Système complet + 4 micros (famille/officiants) + pupitre sonorisé + captation hommage + 2 techniciens.", en: "Full system + 4 mics (family/officiants) + amplified podium + memorial recording + 2 technicians." }, limits: { fr: "Max 400 pers. Éclairage non inclus.", en: "Max 400 people. Lighting not included." } },
      { name: "Pack Grandes Obsèques", price: 350000, cap: 99999, includes: { fr: "Façade longue portée + multi-zones (cour + salle) + groupe électrogène + régie complète + 3 techniciens.", en: "Long-throw FOH + multi-zone (courtyard + hall) + generator + full booth + 3 technicians." }, limits: { fr: "Repérage 24 h avant requis.", en: "Site survey 24 h ahead required." } },
    ],
  },
  {
    slug: "ecoles",
    icon: "graduation",
    estimate: true,
    name: { fr: "Graduations & Événements Scolaires", en: "Graduations & School Events" },
    tagline: {
      fr: "Remises de diplômes, kermesses et concours scolaires : un son clair pour les discours et une ambiance festive pour les élèves.",
      en: "Graduation ceremonies, school fairs and contests: clear sound for speeches and a festive vibe for students.",
    },
    hero: "/img/realisation-ingenieur.jpg",
    offers: [
      { name: "Pack Promo", price: 80000, cap: 120, includes: { fr: "2 enceintes + 2 micros sans fil + musique d'ambiance + 1 technicien.", en: "2 speakers + 2 wireless mics + background music + 1 technician." }, limits: { fr: "Max 120 pers. Salle ou préau.", en: "Max 120 people. Hall or covered yard." } },
      { name: "Pack Graduation", price: 150000, cap: 350, star: true, includes: { fr: "Système façade + caisson + 4 micros HF (remise des diplômes) + pupitre + éclairage basique + 2 techniciens.", en: "FOH system + sub + 4 HF mics (diploma handing) + podium + basic lighting + 2 technicians." }, limits: { fr: "Max 350 pers.", en: "Max 350 people." } },
      { name: "Pack Campus", price: 280000, cap: 99999, includes: { fr: "Sono plein air + scène mobile légère + DJ partenaire + jeux de lumières + 3 techniciens.", en: "Open-air sound + light mobile stage + partner DJ + light sets + 3 technicians." }, limits: { fr: "Autorisation établissement requise.", en: "School authorisation required." } },
    ],
  },
  {
    slug: "mode",
    icon: "shirt",
    estimate: true,
    name: { fr: "Défilés de Mode & Concours", en: "Fashion Shows & Pageants" },
    tagline: {
      fr: "Runways et concours de beauté : diffusion synchronisée, micros animateurs et pression sonore maîtrisée pour le podium.",
      en: "Runways and beauty pageants: synced playback, host mics and controlled sound pressure for the podium.",
    },
    hero: "/img/realisation-scene.jpg",
    offers: [
      { name: "Pack Podium", price: 120000, cap: 150, includes: { fr: "2 enceintes + 1 subwoofer + 2 micros animateur + diffusion playlist synchronisée + 1 technicien.", en: "2 speakers + 1 subwoofer + 2 host mics + synced playlist playback + 1 technician." }, limits: { fr: "Max 150 pers. Salle.", en: "Max 150 people. Indoor." } },
      { name: "Pack Runway", price: 250000, cap: 400, star: true, includes: { fr: "Façade + retours podium + 4 micros HF + console numérique + éclairage runway + 2 techniciens.", en: "FOH + podium monitors + 4 HF mics + digital console + runway lighting + 2 technicians." }, limits: { fr: "Max 400 pers.", en: "Max 400 people." } },
      { name: "Pack Gala Beauté", price: 450000, cap: 99999, includes: { fr: "Line Array compact + régie complète + effets spéciaux + pack lumières scénique + 3 techniciens + répétitions incluses.", en: "Compact Line Array + full booth + special effects + stage lighting pack + 3 technicians + rehearsals included." }, limits: { fr: "Fiche technique du show requise.", en: "Show technical rider required." } },
    ],
  },
];

export const SOLUTIONS = [
  { icon: "mic", name: { fr: "Concerts & Chorales", en: "Concerts & Choirs" }, desc: { fr: "Clarté acoustique absolue pour sublimer les voix et les instruments live. Gestion multi-micros et retours précis.", en: "Absolute acoustic clarity for live voices and instruments. Multi-mic management and precise monitors." }, pack: "Pack Harmony Live — 250 000 FCFA", href: "/services/concert-chorale" },
  { icon: "gem", name: { fr: "Mariages & Réceptions", en: "Weddings & Receptions" }, desc: { fr: "Souvenirs inoubliables avec un son cristallin, régie DJ dynamique et mise en lumière féerique de la piste.", en: "Unforgettable memories with crystal sound, dynamic DJ booth and magical dance-floor lighting." }, pack: "Pack Noces d'Or — 150 000 FCFA", href: "/services/mariage" },
  { icon: "briefcase", name: { fr: "Entreprises (B2B)", en: "Companies (B2B)" }, desc: { fr: "Séminaires et galas d'entreprise sans larsen ni coupure. Diffusion homogène, micros HF et facturation pro.", en: "Corporate seminars and galas without feedback or dropouts. Even coverage, HF mics and pro invoicing." }, pack: "Pack Séminaire — 180 000 FCFA", href: "/services/entreprise" },
  { icon: "wrench", name: { fr: "Vente & Installation Fixe", en: "Sales & Fixed Installation" }, desc: { fr: "Équipement complet et intégration acoustique sur-mesure pour églises, auditoriums, conférences et bars/maquis.", en: "Complete equipment and bespoke acoustic integration for churches, auditoriums, conference rooms and bars." }, pack: { fr: "Obtenir une étude d'installation", en: "Get an installation study" }, href: "/materiel" },
  { icon: "party", name: { fr: "Fêtes & Plein Air", en: "Parties & Open Air" }, desc: { fr: "Anniversaires, manifestations culturelles, maquis, réceptions privées et grands rassemblements plein air.", en: "Birthdays, cultural events, maquis, private receptions and large open-air gatherings." }, pack: { fr: "Découvrir toutes les offres", en: "Discover all packages" }, href: "/services/festival" },
];

export const WHY = [
  { icon: "speaker", t: { fr: "Clarté acoustique & puissance sans distorsion", en: "Acoustic clarity & distortion-free power" }, d: { fr: "Matériel moderne régulièrement calibré pour une couverture sonore parfaite.", en: "Modern gear regularly calibrated for perfect sound coverage." } },
  { icon: "clock", t: { fr: "Ponctualité & rigueur terrain", en: "Punctuality & field rigour" }, d: { fr: "Arrivée au minimum 2 heures avant l'événement pour les tests de balance audio.", en: "On site at least 2 hours before the event for sound-check tests." } },
  { icon: "sliders", t: { fr: "Ingénieurs du son qualifiés", en: "Qualified sound engineers" }, d: { fr: "Techniciens expérimentés gérant l'acoustique en direct pour un rendu équilibré.", en: "Experienced technicians managing live acoustics for a balanced render." } },
  { icon: "badge", t: { fr: "Devis transparents & réservation simplifiée", en: "Transparent quotes & simple booking" }, d: { fr: "Obtenez une estimation claire et validez via Mixx by Yas (TMoney) ou Flooz.", en: "Get a clear estimate and confirm via Mixx by Yas (TMoney) or Flooz." } },
];

export const TESTIMONIALS = [
  { q: { fr: "Pour le concert annuel de notre chorale, Aklimasound a assuré une gestion du son impressionnante. La clarté des retours était parfaite !", en: "For our choir's annual concert, Aklimasound delivered impressive sound management. The monitor clarity was perfect!" }, a: { fr: "Maître de Chœur, Lomé", en: "Choirmaster, Lomé" } },
  { q: { fr: "Installation impeccable pour notre mariage. L'équipe est arrivée très tôt et le son était juste parfait.", en: "Flawless setup for our wedding. The team arrived very early and the sound was simply perfect." }, a: { fr: "K. Mensah", en: "K. Mensah" } },
];

export const GALLERY = [
  { src: "/img/hero-eglise.jpg", tag: "religieux", alt: { fr: "Sonorisation d'un culte en église à Lomé", en: "Church service sound system in Lomé" }, span: "wide" },
  { src: "/img/realisation-regie.jpg", tag: "concert", alt: { fr: "Régie son en concert", en: "FOH console at a concert" }, span: "wide" },
  { src: "/img/realisation-console.jpg", tag: "concert", alt: { fr: "Console de mixage numérique en prestation", en: "Digital mixing console on a gig" }, span: "tall" },
  { src: "/img/realisation-ingenieur.jpg", tag: "religieux", alt: { fr: "Ingénieur du son au travail", en: "Sound engineer at work" }, span: "wide" },
  { src: "/img/realisation-engineer2.jpg", tag: "installation", alt: { fr: "Régie complète installée en salle", en: "Full booth installed in a venue" }, span: "sq" },
  { src: "/img/realisation-scene.jpg", tag: "concert", alt: { fr: "Artiste sur scène, retour de scène en façade", en: "Artist on stage with wedges" }, span: "tall" },
];

export const fcfa = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ") + " FCFA";
