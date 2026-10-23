/** Contenus légaux bilingues — pages /legal/[slug]. */
export type LegalDoc = {
  slug: string;
  title: { fr: string; en: string };
  intro: { fr: string; en: string };
  sections: { h: { fr: string; en: string }; p: { fr: string; en: string }[] }[];
};

export const UPDATED = { fr: "Dernière mise à jour : 15 septembre 2026", en: "Last updated: 15 September 2026" };

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "mentions-legales",
    title: { fr: "Mentions légales", en: "Legal notice" },
    intro: { fr: "Informations légales relatives au site aklimasound (ci-après « le Site »).", en: "Legal information regarding the aklimasound website (hereinafter “the Site”)." },
    sections: [
      {
        h: { fr: "1. Éditeur du Site", en: "1. Site publisher" },
        p: [
          { fr: "Aklimasound — sonorisation événementielle, installation fixe de matériel audio et édition de logiciels, Lomé, Togo. Immatriculation RCCM en cours.", en: "Aklimasound — event sound reinforcement, fixed audio installation and software publishing, Lomé, Togo. RCCM registration in progress." },
          { fr: "Téléphone : +228 97 67 57 64 / +228 97 82 97 99 / +228 70 77 14 83. E-mail : aklimasoundpro@gmail.com. Zone d'intervention : tout le Togo.", en: "Phone: +228 97 67 57 64 / +228 97 82 97 99 / +228 70 77 14 83. Email: aklimasoundpro@gmail.com. Service area: all of Togo." },
        ],
      },
      {
        h: { fr: "2. Direction de la publication", en: "2. Publication management" },
        p: [{ fr: "La direction de la publication est assurée par la direction d'Aklimasound, joignable à l'adresse e-mail ci-dessus.", en: "Publication is managed by Aklimasound's management, reachable at the email address above." }],
      },
      {
        h: { fr: "3. Hébergement", en: "3. Hosting" },
        p: [{ fr: "Le Site est hébergé par Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis — https://www.netlify.com. La base de données applicative est hébergée par nos prestataires cloud (Supabase à terme).", en: "The Site is hosted by Netlify, Inc., 44 Montgomery Street, Suite 300, San Francisco, CA 94104, USA — https://www.netlify.com. The application database is hosted by our cloud providers (Supabase going forward)." }],
      },
      {
        h: { fr: "4. Conception & développement", en: "4. Design & development" },
        p: [{ fr: "Le Site est conçu et développé par COGNYAX DIGITAL.", en: "The Site is designed and developed by COGNYAX DIGITAL." }],
      },
      {
        h: { fr: "5. Propriété intellectuelle", en: "5. Intellectual property" },
        p: [
          { fr: "L'ensemble des contenus (logo, textes, images, rendus 3D, affiches, code, marque « AKLIMASOUND LOGICS ») est la propriété exclusive d'Aklimasound, sauf mention contraire. Toute reproduction, représentation ou adaptation, totale ou partielle, sans autorisation écrite préalable est interdite.", en: "All content (logo, texts, images, 3D renders, posters, code, “AKLIMASOUND LOGICS” trademark) is the exclusive property of Aklimasound unless otherwise stated. Any reproduction, representation or adaptation, in whole or in part, without prior written authorisation is prohibited." },
        ],
      },
      {
        h: { fr: "6. Limitation de responsabilité", en: "6. Limitation of liability" },
        p: [
          { fr: "Les informations du Site (tarifs, estimations du simulateur, fiches matériel) sont fournies à titre indicatif et peuvent évoluer. Les estimations en ligne ne constituent pas un devis contractuel : seul un devis confirmé par Aklimasound engage les parties. Les photographies et rendus ne sont pas contractuels.", en: "Site information (prices, simulator estimates, equipment sheets) is provided for guidance and may change. Online estimates do not constitute a contractual quote: only a quote confirmed by Aklimasound binds the parties. Photographs and renders are not contractual." },
        ],
      },
      {
        h: { fr: "7. Droit applicable", en: "7. Applicable law" },
        p: [{ fr: "Les présentes mentions légales sont régies par le droit togolais. En cas de litige, et après tentative de résolution amiable, compétence est attribuée aux tribunaux de Lomé.", en: "This legal notice is governed by Togolese law. In the event of a dispute, and after an attempt at amicable resolution, jurisdiction is attributed to the courts of Lomé." }],
      },
    ],
  },
  {
    slug: "confidentialite",
    title: { fr: "Politique de confidentialité", en: "Privacy policy" },
    intro: { fr: "Comment nous collectons, utilisons et protégeons vos données personnelles.", en: "How we collect, use and protect your personal data." },
    sections: [
      {
        h: { fr: "1. Responsable du traitement", en: "1. Data controller" },
        p: [{ fr: "Aklimasound, Lomé, Togo — contact : aklimasoundpro@gmail.com / +228 97 67 57 64.", en: "Aklimasound, Lomé, Togo — contact: aklimasoundpro@gmail.com / +228 97 67 57 64." }],
      },
      {
        h: { fr: "2. Données collectées", en: "2. Data collected" },
        p: [
          { fr: "• Formulaires (devis, réservation, accès anticipé LOGICS, porte WhatsApp) : nom, numéro de téléphone/WhatsApp, adresse e-mail, détails de l'événement (date, lieu, message).", en: "• Forms (quotes, bookings, LOGICS early access, WhatsApp gate): name, phone/WhatsApp number, email address, event details (date, location, message)." },
          { fr: "• Journal d'audience (mesure 1re partie) : identifiant anonyme généré par le navigateur, pages vues, clics sur nos boutons d'action, provenance de la visite (référent, paramètres UTM de publicité), langue. Aucun cookie tiers de suivi n'est déposé sans votre consentement.", en: "• Audience log (first-party measurement): anonymous identifier generated by the browser, pages viewed, clicks on our action buttons, visit source (referrer, ad UTM parameters), language. No third-party tracking cookie is set without your consent." },
          { fr: "• Espace admin : identifiants de connexion hachés (jamais stockés en clair), journal des actions de gestion.", en: "• Admin area: hashed login credentials (never stored in plain text), management action log." },
        ],
      },
      {
        h: { fr: "3. Finalités et bases légales", en: "3. Purposes and legal bases" },
        p: [
          { fr: "• Traiter vos demandes de devis, réservations — exécution du contrat / mesures précontractuelles.", en: "• Processing your quote requests, bookings — performance of the contract / pre-contractual measures." },
          { fr: "• Mesurer l'audience du Site de façon anonyme et sécuriser le service (anti-spam, limite de requêtes) — intérêt légitime.", en: "• Measuring Site audience anonymously and securing the service (anti-spam, rate limiting) — legitimate interest." },
          { fr: "• Publicité et réseaux sociaux (Meta Pixel) — uniquement avec votre consentement exprimé via le gestionnaire de cookies.", en: "• Advertising and social networks (Meta Pixel) — only with your consent given via the cookie manager." },
        ],
      },
      {
        h: { fr: "4. Destinataires des données", en: "4. Data recipients" },
        p: [{ fr: "L'équipe Aklimasound exclusivement. Sous-traitants techniques : hébergeur (Netlify), base de données (Supabase), e-mails transactionnels (Brevo), et Meta Platforms uniquement si vous avez consenti aux cookies publicitaires. Nous ne vendons ni ne louons aucune donnée personnelle.", en: "The Aklimasound team exclusively. Technical processors: hosting (Netlify), database (Supabase), transactional emails (Brevo), and Meta Platforms only if you consented to advertising cookies. We never sell or rent personal data." }],
      },
      {
        h: { fr: "5. Durées de conservation", en: "5. Retention periods" },
        p: [
          { fr: "• Leads, devis, réservations : 3 ans à compter du dernier contact, puis archivage ou suppression.", en: "• Leads, quotes, bookings: 3 years from last contact, then archiving or deletion." },
          { fr: "• Journal d'audience anonyme : 13 mois glissants.", en: "• Anonymous audience log: rolling 13 months." },
          { fr: "• Choix cookies : 6 mois, puis le bandeau vous redemande votre préférence.", en: "• Cookie choices: 6 months, after which the banner asks for your preference again." },
        ],
      },
      {
        h: { fr: "6. Sécurité", en: "6. Security" },
        p: [{ fr: "Chiffrement HTTPS de bout en bout, mots de passe hachés (scrypt + sel unique), sessions signées (HMAC-SHA256) en cookies HttpOnly, champs piégés anti-robots (honeypot), limitation du débit des formulaires, validation systématique côté serveur, aucune donnée sensible exposée dans les en-têtes.", en: "End-to-end HTTPS encryption, hashed passwords (scrypt + unique salt), signed sessions (HMAC-SHA256) in HttpOnly cookies, anti-bot honeypot fields, form rate limiting, systematic server-side validation, no sensitive data exposed in headers." }],
      },
      {
        h: { fr: "7. Vos droits", en: "7. Your rights" },
        p: [
          { fr: "Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité de vos données. Exercice gratuit par e-mail à aklimasoundpro@gmail.com (réponse sous 30 jours). Vous pouvez retirer votre consentement cookies à tout moment via « Cookies » en pied de page.", en: "You have the right to access, rectify, erase, object to, restrict and port your data. Free exercise by email at aklimasoundpro@gmail.com (response within 30 days). You can withdraw your cookie consent at any time via “Cookies” in the footer." },
          { fr: "Vous pouvez également adresser une réclamation à l'autorité togolaise de protection des données personnelles (IPDC).", en: "You may also lodge a complaint with the Togolese personal data protection authority (IPDC)." },
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: { fr: "Politique de cookies & gestion du consentement", en: "Cookie policy & consent management" },
    intro: { fr: "Quels traceurs nous utilisons, pourquoi, et comment les contrôler.", en: "Which trackers we use, why, and how to control them." },
    sections: [
      {
        h: { fr: "1. Ce que nous utilisons", en: "1. What we use" },
        p: [
          { fr: "• Strictement nécessaires (aucun consentement requis) : cookie de session de l'espace admin (signé, HttpOnly, 7 jours) ; stockage local de vos préférences (langue, fiche de contact pour pré-remplir WhatsApp, affichage du popup réduction).", en: "• Strictly necessary (no consent required): admin area session cookie (signed, HttpOnly, 7 days); local storage of your preferences (language, contact card to prefill WhatsApp, discount popup display)." },
          { fr: "• Mesure d'audience anonyme (1re partie) : journal des pages vues et clics avec un identifiant aléatoire, sans recoupement avec d'autres sites et sans cookie tiers. Vous pouvez vous y opposer via le bandeau (« Refuser »).", en: "• Anonymous first-party audience measurement: log of page views and clicks with a random identifier, no cross-site matching, no third-party cookie. You can opt out via the banner (“Refuse”)." },
          { fr: "• Publicité (consentement préalable requis) : Meta Pixel (Facebook/Instagram) chargé uniquement si vous l'acceptez, pour mesurer l'efficacité de nos campagnes et les conversions (devis envoyé, clic WhatsApp).", en: "• Advertising (prior consent required): Meta Pixel (Facebook/Instagram) loaded only if you accept it, to measure our campaigns' effectiveness and conversions (quote sent, WhatsApp click)." },
        ],
      },
      {
        h: { fr: "2. Comment gérer vos choix", en: "2. How to manage your choices" },
        p: [
          { fr: "À tout moment : lien « Cookies » en pied de page → « Gérer mes choix », ou via votre navigateur (suppression des cookies, navigation privée, blocage des traceurs tiers). Le retrait du consentement est aussi simple que son dépôt.", en: "At any time: “Cookies” link in the footer → “Manage my choices”, or via your browser (cookie deletion, private browsing, third-party tracker blocking). Withdrawing consent is as easy as giving it." },
        ],
      },
      {
        h: { fr: "3. Durées", en: "3. Durations" },
        p: [{ fr: "Choix de consentement : 6 mois. Journal d'audience : 13 mois. Cookie de session admin : 7 jours.", en: "Consent choices: 6 months. Audience log: 13 months. Admin session cookie: 7 days." }],
      },
      {
        h: { fr: "4. Absence de traceurs non maîtrisés", en: "4. No uncontrolled trackers" },
        p: [{ fr: "Aucune régie publicitaire tierce, aucun traceur de réseaux sociaux hors Meta Pixel (sur consentement), aucune revente de données de navigation.", en: "No third-party ad networks, no social network trackers other than Meta Pixel (upon consent), no resale of browsing data." }],
      },
    ],
  },
  {
    slug: "cgv",
    title: { fr: "Conditions générales de vente", en: "General terms & conditions of sale" },
    intro: { fr: "Prestations de sonorisation, installations fixes et (à l'ouverture) vente de matériel.", en: "Sound reinforcement services, fixed installations and (upon opening) equipment sales." },
    sections: [
      {
        h: { fr: "1. Objet & champ d'application", en: "1. Purpose & scope" },
        p: [{ fr: "Les présentes conditions régissent toute prestation de sonorisation événementielle, toute installation fixe (étude, fourniture, pose, formation, maintenance) et toute vente de matériel réalisée par Aklimasound, partout au Togo. Toute commande implique leur acceptation sans réserve.", en: "These terms govern all event sound reinforcement services, all fixed installations (study, supply, fitting, training, maintenance) and all equipment sales carried out by Aklimasound, across Togo. Any order implies their unreserved acceptance." }],
      },
      {
        h: { fr: "2. Tarifs & devis", en: "2. Prices & quotes" },
        p: [
          { fr: "Les prix sont indiqués en francs CFA, nets — les frais de paiement Mobile Money sont absorbés dans nos tarifs affichés. Les estimations du simulateur en ligne sont indicatives et non contractuelles ; seul un devis émis et confirmé par Aklimasound fait foi. Les devis sont valables 30 jours.", en: "Prices are stated in CFA francs, net — Mobile Money payment fees are absorbed into our displayed prices. Online simulator estimates are indicative and non-contractual; only a quote issued and confirmed by Aklimasound is binding. Quotes are valid for 30 days." },
          { fr: "Des frais de déplacement peuvent s'appliquer hors zone urbaine ; ils sont toujours signalés avant confirmation.", en: "Travel fees may apply outside the urban area; they are always flagged before confirmation." },
        ],
      },
      {
        h: { fr: "3. Réservation", en: "3. Booking" },
        p: [
          { fr: "La réservation d'une date devient ferme après confirmation conjointe : Aklimasound vérifie la disponibilité, puis valide votre réservation après échange (téléphone ou WhatsApp). Les modalités de règlement sont convenues ensemble à ce moment-là — aucune somme n'est demandée en ligne.", en: "A date booking becomes firm after joint confirmation: Aklimasound checks availability, then validates your booking after an exchange (phone or WhatsApp). Payment terms are agreed together at that point — no money is requested online." },
          { fr: "Le solde est dû au plus tard le jour de la prestation, avant la mise en service du matériel. Le paiement automatisé en ligne (carte / Mobile Money intégré) sera proposé dès que notre statut légal le permettra ; les modalités actuelles restent garanties.", en: "The balance is due no later than the day of service, before equipment commissioning. Automated online payment (card / integrated Mobile Money) will be offered as soon as our legal status allows; current arrangements remain guaranteed." },
        ],
      },
      {
        h: { fr: "4. Annulation, report & remboursement", en: "4. Cancellation, postponement & refund" },
        p: [
          { fr: "• Annulation par le client à plus de 7 jours de l'événement : report possible sur une date disponible dans les 6 mois.", en: "• Cancellation by the client more than 7 days before the event: postponement possible to an available date within 6 months." },
          { fr: "• Annulation à moins de 7 jours : les coûts éventuellement déjà convenus lors de la confirmation restent dus (immobilisation du matériel et des équipes).", en: "• Cancellation less than 7 days before: any costs already agreed at confirmation remain due (equipment and crews are held)." },
          { fr: "• Annulation par Aklimasound (cas de force majeure inclus) : report au choix du client sur une date équivalente.", en: "• Cancellation by Aklimasound (including force majeure): postponement at the client's choice to an equivalent date." },
          { fr: "• Conditions météo : pour les événements en plein air, un repli couvert ou une protection du matériel doit être prévu par l'organisateur ; à défaut, Aklimasound peut suspendre la prestation pour sécurité, sans remboursement des sommes engagées pour le matériel déjà installé.", en: "• Weather: for open-air events, a covered fallback or equipment protection must be arranged by the organiser; otherwise Aklimasound may suspend the service for safety, without refund of amounts committed for equipment already installed." },
        ],
      },
      {
        h: { fr: "5. Obligations du client", en: "5. Client obligations" },
        p: [{ fr: "Fournir une alimentation électrique stable (ou accepter notre groupe électrogène en option), un accès au lieu au moins 2 heures avant l'événement, les autorisations administratives requises, et — pour les grands formats — la fiche technique des artistes. Toute heure d'attente imputable au client peut être facturée.", en: "Provide a stable power supply (or accept our optional generator), site access at least 2 hours before the event, required administrative authorisations, and — for large formats — the artists' technical rider. Any waiting time attributable to the client may be invoiced." }],
      },
      {
        h: { fr: "6. Exécution de la prestation", en: "6. Service performance" },
        p: [{ fr: "Aklimasound arrive au minimum 2 heures avant l'événement pour l'installation et la balance. Le matériel reste la propriété d'Aklimasound pendant toute la prestation ; toute dégradation imputable au public ou au client est facturée au coût de réparation ou de remplacement. Un repérage du lieu 24 h avant peut être exigé pour les grands rassemblements.", en: "Aklimasound arrives at least 2 hours before the event for setup and soundcheck. Equipment remains Aklimasound's property throughout the service; any damage attributable to the public or the client is invoiced at repair or replacement cost. A site survey 24 h ahead may be required for large gatherings." }],
      },
      {
        h: { fr: "7. Installations fixes & ventes de matériel", en: "7. Fixed installations & equipment sales" },
        p: [{ fr: "Les installations fixes font l'objet d'une étude préalable (relevé acoustique, dimensionnement, devis ferme). Après réception, le matériel vendu est garanti selon les conditions du fabricant ; la garantie exclut les mauvises utilisations, surcharges électriques et modifications non autorisées. La boutique en ligne ouvrira prochainement : ses conditions spécifiques (livraison, retour, garantie) seront publiées ici avant l'ouverture.", en: "Fixed installations are subject to a prior study (acoustic survey, sizing, firm quote). After acceptance, sold equipment is warranted per the manufacturer's conditions; the warranty excludes misuse, power surges and unauthorised modifications. The online shop will open soon: its specific conditions (delivery, returns, warranty) will be published here before opening." }],
      },
      {
        h: { fr: "8. Réduction membre", en: "8. Member discount" },
        p: [{ fr: "Les comptes membres connectés bénéficient automatiquement du pourcentage de réduction affiché sur les offres (défini par Aklimasound). La réduction ne s'applique pas aux prestations déjà contractées ni aux installations fixes sur étude.", en: "Connected member accounts automatically benefit from the discount percentage displayed on offers (set by Aklimasound). The discount does not apply to already contracted services or to study-based fixed installations." }],
      },
      {
        h: { fr: "9. Force majeure & litiges", en: "9. Force majeure & disputes" },
        p: [{ fr: "Aucune partie n'est responsable d'un manquement dû à un cas de force majeure (coupures électriques généralisées, troubles civils, catastrophes naturelles, décisions administratives). En cas de litige, résolution amiable d'abord (contact : aklimasoundpro@gmail.com), à défaut compétence des tribunaux de Lomé, droit togolais applicable.", en: "Neither party is liable for a failure due to force majeure (widespread power outages, civil unrest, natural disasters, administrative decisions). In case of dispute, amicable resolution first (contact: aklimasoundpro@gmail.com), failing which the courts of Lomé have jurisdiction, under Togolese law." }],
      },
    ],
  },
  {
    slug: "cgu",
    title: { fr: "Conditions générales d'utilisation du Site", en: "Website terms of use" },
    intro: { fr: "Règles d'utilisation du site, du simulateur de devis et de l'espace de gestion.", en: "Rules for using the site, the quote simulator and the management area." },
    sections: [
      {
        h: { fr: "1. Accès au Site", en: "1. Access to the Site" },
        p: [{ fr: "Le Site est accessible gratuitement à tout visiteur. L'espace de gestion (/admin) est strictement réservé à l'équipe Aklimasound ; tout accès non autorisé est interdit et susceptible de poursuites.", en: "The Site is freely accessible to any visitor. The management area (/admin) is strictly reserved for the Aklimasound team; any unauthorised access is prohibited and may be prosecuted." }],
      },
      {
        h: { fr: "2. Usage autorisé", en: "2. authorised use" },
        p: [{ fr: "Sont interdits : l'envoi automatisé ou frauduleux de formulaires, la collecte automatisée de contenus (scraping), toute tentative d'intrusion, de déni de service ou de contournement des sécurités, l'usurpation d'identité, et tout usage portant atteinte au fonctionnement du Site. Des limitations de débit et journaux techniques sont actifs pour protéger le service.", en: "Prohibited: automated or fraudulent form submissions, automated content harvesting (scraping), any intrusion, denial-of-service or security-bypass attempt, identity theft, and any use harming the Site's operation. Rate limits and technical logs are active to protect the service." }],
      },
      {
        h: { fr: "3. Comptes & espace membre", en: "3. Accounts & member area" },
        p: [{ fr: "L'espace membre client (prix membre automatique) sera ouvert dans une phase ultérieure. Vous êtes responsable de la confidentialité de vos identifiants et de l'exactitude des informations fournies (nom, téléphone WhatsApp, e-mail).", en: "The client member area (automatic member pricing) will open in a later phase. You are responsible for keeping your credentials confidential and for the accuracy of the information provided (name, WhatsApp phone, email)." }],
      },
      {
        h: { fr: "4. Contenu & propriété intellectuelle", en: "4. Content & intellectual property" },
        p: [{ fr: "Textes, images, rendus, logo, marque « AKLIMASOUND LOGICS » et code sont protégés. Aucune extraction ou réutilisation n'est autorisée sans accord écrit. Les contenus des visiteurs (messages de formulaire) nous sont transmis pour le seul traitement de leur demande.", en: "Texts, images, renders, logo, “AKLIMASOUND LOGICS” trademark and code are protected. No extraction or reuse is authorised without written agreement. Visitor content (form messages) is transmitted to us solely to process their request." }],
      },
      {
        h: { fr: "5. Disponibilité & évolutions", en: "5. Availability & changes" },
        p: [{ fr: "Nous nous efforçons d'assurer une disponibilité continue, sans engagement de niveau de service à ce stade. Les fonctionnalités (simulateur, réservation, boutique, LOGICS) évoluent ; les présentes conditions peuvent être mises à jour à tout moment, la version en ligne faisant foi.", en: "We strive to ensure continuous availability, without a service-level commitment at this stage. Features (simulator, booking, shop, LOGICS) evolve; these terms may be updated at any time, the online version prevailing." }],
      },
      {
        h: { fr: "6. Données personnelles", en: "6. Personal data" },
        p: [{ fr: "Le traitement de vos données est décrit dans notre Politique de confidentialité et notre Politique de cookies, accessibles en pied de page.", en: "The processing of your data is described in our Privacy Policy and Cookie Policy, accessible in the footer." }],
      },
      {
        h: { fr: "7. Droit applicable", en: "7. Applicable law" },
        p: [{ fr: "Droit togolais. Litiges : résolution amiable puis tribunaux de Lomé.", en: "Togolese law. Disputes: amicable resolution then the courts of Lomé." }],
      },
    ],
  },
];

export const docBySlug = (slug: string) => LEGAL_DOCS.find((d) => d.slug === slug);
