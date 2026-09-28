"use client";
/**
 * Champ téléphone avec sélection d'indicatif pays.
 *  • Mode local (défaut) : Togo + Bénin uniquement — fini les numéros sans indicatif.
 *  • Mode world (page LOGICS) : tous les pays — produit digital vendu partout.
 * Le numéro complet (+228XXXXXXXX) est transmis au formulaire via un champ caché :
 * les validations serveur/client existantes reçoivent toujours un format E.164.
 */
import { useState } from "react";

const LOCAL: { cc: string; label: string }[] = [
  { cc: "+228", label: "Togo" },
  { cc: "+229", label: "Bénin" },
];

/** Togo, Bénin et France en tête, puis ordre alphabétique. */
const WORLD: { cc: string; label: string }[] = [
  { cc: "+228", label: "Togo" },
  { cc: "+229", label: "Bénin" },
  { cc: "+33", label: "France" },
  { cc: "+93", label: "Afghanistan" },
  { cc: "+27", label: "Afrique du Sud" },
  { cc: "+355", label: "Albanie" },
  { cc: "+213", label: "Algérie" },
  { cc: "+49", label: "Allemagne" },
  { cc: "+376", label: "Andorre" },
  { cc: "+244", label: "Angola" },
  { cc: "+1268", label: "Antigua-et-Barbuda" },
  { cc: "+966", label: "Arabie saoudite" },
  { cc: "+54", label: "Argentine" },
  { cc: "+374", label: "Arménie" },
  { cc: "+61", label: "Australie" },
  { cc: "+43", label: "Autriche" },
  { cc: "+994", label: "Azerbaïdjan" },
  { cc: "+1242", label: "Bahamas" },
  { cc: "+973", label: "Bahreïn" },
  { cc: "+880", label: "Bangladesh" },
  { cc: "+1246", label: "Barbade" },
  { cc: "+32", label: "Belgique" },
  { cc: "+501", label: "Belize" },
  { cc: "+975", label: "Bhoutan" },
  { cc: "+375", label: "Biélorussie" },
  { cc: "+95", label: "Birmanie" },
  { cc: "+591", label: "Bolivie" },
  { cc: "+387", label: "Bosnie-Herzégovine" },
  { cc: "+267", label: "Botswana" },
  { cc: "+55", label: "Brésil" },
  { cc: "+673", label: "Brunei" },
  { cc: "+359", label: "Bulgarie" },
  { cc: "+226", label: "Burkina Faso" },
  { cc: "+257", label: "Burundi" },
  { cc: "+855", label: "Cambodge" },
  { cc: "+237", label: "Cameroun" },
  { cc: "+1", label: "Canada" },
  { cc: "+238", label: "Cap-Vert" },
  { cc: "+236", label: "Centrafrique" },
  { cc: "+56", label: "Chili" },
  { cc: "+86", label: "Chine" },
  { cc: "+357", label: "Chypre" },
  { cc: "+57", label: "Colombie" },
  { cc: "+269", label: "Comores" },
  { cc: "+850", label: "Corée du Nord" },
  { cc: "+82", label: "Corée du Sud" },
  { cc: "+506", label: "Costa Rica" },
  { cc: "+225", label: "Côte d'Ivoire" },
  { cc: "+385", label: "Croatie" },
  { cc: "+53", label: "Cuba" },
  { cc: "+45", label: "Danemark" },
  { cc: "+253", label: "Djibouti" },
  { cc: "+1767", label: "Dominique" },
  { cc: "+20", label: "Égypte" },
  { cc: "+593", label: "Équateur" },
  { cc: "+291", label: "Érythrée" },
  { cc: "+34", label: "Espagne" },
  { cc: "+372", label: "Estonie" },
  { cc: "+268", label: "Eswatini" },
  { cc: "+1", label: "États-Unis" },
  { cc: "+251", label: "Éthiopie" },
  { cc: "+679", label: "Fidji" },
  { cc: "+358", label: "Finlande" },
  { cc: "+241", label: "Gabon" },
  { cc: "+220", label: "Gambie" },
  { cc: "+995", label: "Géorgie" },
  { cc: "+233", label: "Ghana" },
  { cc: "+30", label: "Grèce" },
  { cc: "+1473", label: "Grenade" },
  { cc: "+502", label: "Guatemala" },
  { cc: "+224", label: "Guinée" },
  { cc: "+240", label: "Guinée équatoriale" },
  { cc: "+245", label: "Guinée-Bissau" },
  { cc: "+592", label: "Guyana" },
  { cc: "+509", label: "Haïti" },
  { cc: "+504", label: "Honduras" },
  { cc: "+36", label: "Hongrie" },
  { cc: "+91", label: "Inde" },
  { cc: "+62", label: "Indonésie" },
  { cc: "+964", label: "Irak" },
  { cc: "+98", label: "Iran" },
  { cc: "+353", label: "Irlande" },
  { cc: "+354", label: "Islande" },
  { cc: "+972", label: "Israël" },
  { cc: "+39", label: "Italie" },
  { cc: "+1876", label: "Jamaïque" },
  { cc: "+81", label: "Japon" },
  { cc: "+962", label: "Jordanie" },
  { cc: "+7", label: "Kazakhstan" },
  { cc: "+254", label: "Kenya" },
  { cc: "+996", label: "Kirghizistan" },
  { cc: "+686", label: "Kiribati" },
  { cc: "+965", label: "Koweït" },
  { cc: "+856", label: "Laos" },
  { cc: "+266", label: "Lesotho" },
  { cc: "+371", label: "Lettonie" },
  { cc: "+961", label: "Liban" },
  { cc: "+231", label: "Liberia" },
  { cc: "+218", label: "Libye" },
  { cc: "+423", label: "Liechtenstein" },
  { cc: "+370", label: "Lituanie" },
  { cc: "+352", label: "Luxembourg" },
  { cc: "+389", label: "Macédoine du Nord" },
  { cc: "+261", label: "Madagascar" },
  { cc: "+60", label: "Malaisie" },
  { cc: "+265", label: "Malawi" },
  { cc: "+960", label: "Maldives" },
  { cc: "+223", label: "Mali" },
  { cc: "+356", label: "Malte" },
  { cc: "+212", label: "Maroc" },
  { cc: "+692", label: "Marshall" },
  { cc: "+230", label: "Maurice" },
  { cc: "+222", label: "Mauritanie" },
  { cc: "+52", label: "Mexique" },
  { cc: "+691", label: "Micronésie" },
  { cc: "+373", label: "Moldavie" },
  { cc: "+377", label: "Monaco" },
  { cc: "+976", label: "Mongolie" },
  { cc: "+382", label: "Monténégro" },
  { cc: "+258", label: "Mozambique" },
  { cc: "+264", label: "Namibie" },
  { cc: "+674", label: "Nauru" },
  { cc: "+977", label: "Népal" },
  { cc: "+505", label: "Nicaragua" },
  { cc: "+227", label: "Niger" },
  { cc: "+234", label: "Nigeria" },
  { cc: "+47", label: "Norvège" },
  { cc: "+64", label: "Nouvelle-Zélande" },
  { cc: "+968", label: "Oman" },
  { cc: "+256", label: "Ouganda" },
  { cc: "+998", label: "Ouzbékistan" },
  { cc: "+92", label: "Pakistan" },
  { cc: "+680", label: "Palaos" },
  { cc: "+507", label: "Panama" },
  { cc: "+675", label: "Papouasie-N.-Guinée" },
  { cc: "+595", label: "Paraguay" },
  { cc: "+31", label: "Pays-Bas" },
  { cc: "+51", label: "Pérou" },
  { cc: "+63", label: "Philippines" },
  { cc: "+48", label: "Pologne" },
  { cc: "+351", label: "Portugal" },
  { cc: "+974", label: "Qatar" },
  { cc: "+243", label: "RD Congo" },
  { cc: "+242", label: "Congo" },
  { cc: "+1809", label: "République dominicaine" },
  { cc: "+40", label: "Roumanie" },
  { cc: "+44", label: "Royaume-Uni" },
  { cc: "+7", label: "Russie" },
  { cc: "+250", label: "Rwanda" },
  { cc: "+503", label: "Salvador" },
  { cc: "+685", label: "Samoa" },
  { cc: "+239", label: "São Tomé-et-Príncipe" },
  { cc: "+221", label: "Sénégal" },
  { cc: "+381", label: "Serbie" },
  { cc: "+248", label: "Seychelles" },
  { cc: "+232", label: "Sierra Leone" },
  { cc: "+65", label: "Singapour" },
  { cc: "+421", label: "Slovaquie" },
  { cc: "+386", label: "Slovénie" },
  { cc: "+252", label: "Somalie" },
  { cc: "+249", label: "Soudan" },
  { cc: "+211", label: "Soudan du Sud" },
  { cc: "+94", label: "Sri Lanka" },
  { cc: "+46", label: "Suède" },
  { cc: "+41", label: "Suisse" },
  { cc: "+597", label: "Suriname" },
  { cc: "+963", label: "Syrie" },
  { cc: "+992", label: "Tadjikistan" },
  { cc: "+255", label: "Tanzanie" },
  { cc: "+235", label: "Tchad" },
  { cc: "+420", label: "Tchéquie" },
  { cc: "+66", label: "Thaïlande" },
  { cc: "+670", label: "Timor oriental" },
  { cc: "+676", label: "Tonga" },
  { cc: "+1868", label: "Trinité-et-Tobago" },
  { cc: "+216", label: "Tunisie" },
  { cc: "+993", label: "Turkménistan" },
  { cc: "+90", label: "Turquie" },
  { cc: "+688", label: "Tuvalu" },
  { cc: "+380", label: "Ukraine" },
  { cc: "+598", label: "Uruguay" },
  { cc: "+678", label: "Vanuatu" },
  { cc: "+379", label: "Vatican" },
  { cc: "+58", label: "Venezuela" },
  { cc: "+84", label: "Vietnam" },
  { cc: "+967", label: "Yémen" },
  { cc: "+260", label: "Zambie" },
  { cc: "+263", label: "Zimbabwe" },
];

export function PhoneInput({
  name = "phone",
  world = false,
  compact = false,
  required = true,
}: {
  name?: string;
  world?: boolean;
  compact?: boolean;
  required?: boolean;
}) {
  const list = world ? WORLD : LOCAL;
  const [cc, setCc] = useState(list[0].cc);
  const [nat, setNat] = useState("");
  const digits = nat.replace(/\D/g, "");
  const full = digits ? `${cc}${digits}` : "";
  const cls = compact ? "input !py-2 text-sm" : "input";

  return (
    <span className="flex gap-2">
      <select
        className={`${cls} !w-auto max-w-[9.5rem] shrink-0`}
        value={cc}
        onChange={(e) => setCc(e.target.value)}
        aria-label="Indicatif pays / Country code"
      >
        {list.map((c) => (
          <option key={`${c.cc}-${c.label}`} className="bg-ink" value={c.cc}>
            {c.label} ({c.cc})
          </option>
        ))}
      </select>
      <input
        className={`${cls} min-w-0 flex-1`}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national-preferred"
        maxLength={world ? 15 : 12}
        placeholder={world ? "Numéro sans le 00" : "90 12 34 56"}
        value={nat}
        required={required}
        onChange={(e) => setNat(e.target.value.replace(/[^\d\s().-]/g, ""))}
      />
      {/* Numéro complet au format international, transmis au formulaire */}
      <input type="hidden" name={name} value={full} />
    </span>
  );
}
