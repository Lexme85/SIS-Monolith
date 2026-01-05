
import { ListItem } from './types';

export interface SpecificItem extends ListItem {
    tf: 'tf1' | 'tf2' | 'tf3' | 'tf4' | 'tf5' | 'tf6';
}

export interface RecommendedAid {
    name: string;
    note: string;
}

export interface LogicEntry {
    specificItems: SpecificItem[];
    matrix: string[];
    measures: string[];
    concepts?: string[]; 
    recommendedAids?: RecommendedAid[];
}

const STATUS_NEURO = ["Leicht ausgeprägt", "Mäßig ausgeprägt", "Stark ausgeprägt", "Schwankend"];
const STATUS_MOB = ["Selbstständig möglich", "Mit personeller Hilfe", "Mit Hilfsmittel", "Nicht möglich"];
const STATUS_PAIN = ["Dauerschmerz", "Belastungsschmerz", "Ruheschmerz", "Einschießend"];
const STATUS_PSYCH = ["Akute Phase", "Remission", "Chronifiziert", "Krisenhaft"];
// Fix: Added missing STATUS_DIABETES definition
const STATUS_DIABETES = ["Stabil", "Instabil", "Hypoglykämie-Neigung", "Hyperglykämie-Neigung"];

export const LOGIC_DB: Record<string, LogicEntry> = {
    // --- NEUROLOGIE ---
    "Apoplex (Schlaganfall)": {
        specificItems: [
            { n: "Hemiparese / Lähmung", tf: 'tf2', l: STATUS_MOB, s: ["Rechts betont", "Links betont", "Spastik", "Subluxierte Schulter"] },
            { n: "Aphasie (Sprachstörung)", tf: 'tf1', l: STATUS_NEURO, s: ["Broca (Motorisch)", "Wernicke (Sensorisch)", "Globale Aphasie", "Ja-Nein-Vertauschung"] },
            { n: "Dysphagie (Schluckstörung)", tf: 'tf3', l: ["Breikost", "Passiert", "Flüssig"], s: ["Stumme Aspiration", "Verschlucken beim Trinken", "Speichelfluss"] },
            { n: "Neglect / Pusher-Syndrom", tf: 'tf1', s: ["Visuelle Vernachlässigung", "Raumwahrnehmungsstörung"] }
        ],
        matrix: ["Sturz", "Kontraktur", "Dekubitus", "Aspiration", "Thrombose", "Pneumonie"],
        measures: ["Bobath-Lagerung", "Schlucktraining / Logopädie", "Hemiparese-Gymnastik", "Gesichtsfeld-Training", "Unterstützung beim Essen (Anreichen)"],
        concepts: ["Bobath-Konzept", "Kinästhetik", "Basale Stimulation"]
    },
    "Demenz (Alzheimer/Vaskulär)": {
        specificItems: [
            { n: "Desorientierung", tf: 'tf1', l: ["Zeitlich", "Örtlich", "Situativ", "Personell"], s: ["Sundowning-Phänomen", "Tag-Nacht-Umkehr", "Weglauftendenz"] },
            { n: "Herausforderndes Verhalten", tf: 'tf1', l: STATUS_NEURO, s: ["Aggressives Verhalten", "Vokale Störung (Rufen)", "Abwehr bei Pflege", "Motorische Unruhe"] },
            { n: "Apraxie (Handlungsstörung)", tf: 'tf4', s: ["Ankleiden (Reihenfolge)", "Körperpflege vergessen", "Gebrauch von Besteck gestört"] },
            { n: "Gedächtnisverlust", tf: 'tf1', s: ["Kurzzeitgedächtnis gestört", "Langzeitgedächtnis (Biografie)", "Konfabulationen"] }
        ],
        matrix: ["Eigengefährdung", "Hinlauftendenz", "Sturz", "Exsikkose", "Mangelernährung"],
        measures: ["Validation nach Feil", "Biografiearbeit", "Tagesstrukturierung", "Erinnerungsalben", "Orientierungshilfen (Bilder/Symbole)"],
        concepts: ["Validation (nach Naomi Feil)", "Psychobiographisches Pflegemodell (Böhm)", "Wohnbereichskonzept"]
    },
    "Morbus Parkinson": {
        specificItems: [
            { n: "Rigor / Freezing", tf: 'tf2', l: STATUS_MOB, s: ["Zahnradphänomen", "Starthemmung", "Abstoppen vor Hindernissen"] },
            { n: "Tremor (Ruhezittern)", tf: 'tf2', l: STATUS_NEURO, s: ["Pillendreher-Tremor", "Einseitig beginnend"] },
            { n: "Hypomimie / Bradykinese", tf: 'tf1', s: ["Maskengesicht", "Leise/monotone Sprache", "Mikrografie"] },
            { n: "Posturale Instabilität", tf: 'tf2', s: ["Haltungsinstabilität", "Kleinschrittiger Gang", "Propulsion"] }
        ],
        matrix: ["Sturz", "Aspiration", "Kontraktur", "Dekubitus"],
        measures: ["Medikamente exakt nach Zeitplan", "Gehtraining (akustische/optische reize)", "Logopädie (Loud-Training)", "Hilfe bei der Nahrungsaufnahme"],
        concepts: ["Kinästhetik", "Bobath-Konzept"]
    },
    "Multiple Sklerose (MS)": {
        specificItems: [
            { n: "Fatigue-Syndrom", tf: 'tf5', l: ["Stark", "Mäßig"], s: ["Belastungsintoleranz", "Schnelle Erschöpfung am Vormittag"] },
            { n: "Ataxie & Spastik", tf: 'tf2', l: STATUS_MOB, s: ["Intentionstremor", "Gangunsicherheit", "Erhöhter Muskeltonus"] },
            { n: "Sensibilitätsstörung", tf: 'tf3', s: ["Parästhesien (Kribbeln)", "Taubheitsgefühl", "Uthoff-Phänomen (Wärmeempf.)"] },
            { n: "Blasen- / Mastdarmstörung", tf: 'tf4', s: ["Dranginkontinenz", "Harnverhalt", "Obstipation"] }
        ],
        matrix: ["Sturz", "Kontraktur", "Dekubitus", "Thrombose", "Harnwegsinfekt"],
        measures: ["Pausenmanagement", "Physiotherapie (Vojta/Bobath)", "Kältetherapie bei Hitze-Intoleranz", "Beckenbodentraining"]
    },
    "Epilepsie": {
        specificItems: [
            { n: "Krampfanfälle", tf: 'tf3', l: ["Grand-Mal", "Absencen", "Fokal"], s: ["Aura vorhanden", "Sturzneigung", "Zungenbiss", "Einnässen"] },
            { n: "Postiktale Phase", tf: 'tf1', s: ["Verwirrtheit nach Anfall", "Schläfrigkeit", "Muskelkater"] }
        ],
        matrix: ["Sturz", "Eigengefährdung", "Aspiration"],
        measures: ["Anfallsprotokoll führen", "Notfallmedikament bereitstellen", "Bettgitter-Polsterung", "Sicherung der Umgebung"]
    },
    "Wesensveränderung": {
        specificItems: [
            { n: "Persönlichkeitswandel", tf: 'tf5', s: ["Enthemmung", "Apathie", "Aggressivität", "Soziale Isolation"] },
            { n: "Affektstörung", tf: 'tf1', s: ["Labiler Affekt", "Reizbarkeit", "Distanzlosigkeit"] }
        ],
        matrix: ["Eigengefährdung", "Soziale Isolation"],
        measures: ["Deeskalationstraining", "Bezugspflege", "Feste Tagesstruktur"]
    },
    "Polyneuropathie": {
        specificItems: [
            { n: "Missempfindungen", tf: 'tf3', s: ["Brennende Schmerzen (Burning Feet)", "Kribbeln", "Ameisenlaufen", "Taubheit"] },
            { n: "Gangunsicherheit (Sensibel)", tf: 'tf2', s: ["Unsicherer Stand bei Dunkelheit", "Wahrnehmungsstörung Füße"] }
        ],
        matrix: ["Sturz", "Dekubitus (Fersen)", "Wundheilungsstörung"],
        measures: ["Tägliche Fußinspektion", "Druckentlastung Fersen", "Schmerztherapie (Neuropathisch)", "Festes Schuhwerk"]
    },

    // --- PSYCHIATRIE ---
    "Rezidivierende depressive Störung": {
        specificItems: [
            { n: "Antriebshemmung", tf: 'tf5', l: STATUS_PSYCH, s: ["Morgentief", "Abendliche Aufhellung", "Psychomotorische Hemmung"] },
            { n: "Kognitive Störung", tf: 'tf1', s: ["Grübelzwang", "Konzentrationsstörung", "Gefühl der Gefühllosigkeit"] },
            { n: "Selbstvernachlässigung", tf: 'tf4', s: ["Hygiene-Defizit", "Appetitlosigkeit", "Trinkmenge reduziert"] }
        ],
        matrix: ["Eigengefährdung (Suizidalität)", "Mangelernährung", "Exsikkose", "Soziale Isolation"],
        measures: ["Strukturierter Tagesplan", "Gesprächsangebote (validierend)", "Motivation zur Körperpflege", "Gewichtskontrolle"],
        concepts: ["Psychobiographisches Pflegemodell (Böhm)"]
    },
    "Angst- und Panikstörung": {
        specificItems: [
            { n: "Panikattacken", tf: 'tf1', s: ["Atemnot (Hyperventilation)", "Herzrasen", "Todesangst", "Schwindel"] },
            { n: "Vermeidungsverhalten", tf: 'tf5', s: ["Agoraphobie (Meidet Plätze)", "Soziale Phobie", "Zimmerrückzug"] }
        ],
        matrix: ["Sturz", "Soziale Isolation", "Eigengefährdung"],
        measures: ["Beruhigende Begleitung", "Atemübungen (Lippenbremse)", "Sicherheit vermitteln", "Skillstraining"]
    },
    "Schizophrenie": {
        specificItems: [
            { n: "Positivsymptomatik", tf: 'tf1', s: ["Stimmenhören (akustisch)", "Verfolgungswahn", "Ich-Störungen"] },
            { n: "Negativsymptomatik", tf: 'tf5', s: ["Sozialer Rückzug", "Sprachverarmung", "Affektverflachung"] },
            { n: "Formale Denkstörung", tf: 'tf1', s: ["Zerfahrenheit", "Gedankenabreißen", "Neologismen"] }
        ],
        matrix: ["Eigengefährdung", "Mangelernährung", "Infektionsrisiko"],
        measures: ["Reizabschirmung", "Klare Kommunikation", "Medikamenten-Überwachung (Compliance)", "Bezugspflege"]
    },
    "Bipolare Störung": {
        specificItems: [
            { n: "Manische Phase", tf: 'tf5', s: ["Distanzlosigkeit", "Rededrang (Logorrhö)", "Ideenflucht", "Kaufrausch"] },
            { n: "Depressive Phase", tf: 'tf5', s: ["Schwere Antriebslosigkeit", "Suizidalität"] }
        ],
        matrix: ["Eigengefährdung", "Sturz (Hyperaktivität)", "Schlafstörung"],
        measures: ["Begrenzung bei Überaktivität", "Schlafhygiene", "Stimmungs-Tagebuch", "Reizreduktion"]
    },
    "Sucht / Abhängigkeit": {
        specificItems: [
            { n: "Abstinenzproblematik", tf: 'tf1', s: ["Craving (Suchtdruck)", "Beschaffungsverhalten", "Verstecktes Trinken"] },
            { n: "Entzugssymptomatik", tf: 'tf3', s: ["Händezittern (Tremor)", "Schwitzen", "Unruhe", "Delir-Gefahr"] },
            { n: "Korsakow-Syndrom", tf: 'tf1', s: ["Gedächtnislücken", "Konfabulationen", "Orientierungsstörung"] }
        ],
        matrix: ["Sturz", "Mangelernährung", "Eigengefährdung", "Wundheilungsstörung"],
        measures: ["Alkoholfreies Milieu", "Vitamin B1 Gabe", "Motivierende Gesprächsführung", "Empathische Begrenzung"]
    },
    "Borderline-Störung": {
        specificItems: [
            { n: "Affektinstabilität", tf: 'tf1', s: ["Impulsivität", "Wutausbrüche", "Innere Leere"] },
            { n: "Selbstschädigung", tf: 'tf3', s: ["Ritzen (SVV)", "Suizidale Krisen", "Hochrisikoverhalten"] },
            { n: "Beziehungsmuster", tf: 'tf5', s: ["Splitting (Personal gut/böse)", "Verlustangst", "Manipulation"] }
        ],
        matrix: ["Eigengefährdung", "Schmerz", "Soziale Isolation"],
        measures: ["Klare Team-Absprachen (Einheitlichkeit)", "Skillstraining (DBT)", "Kriseninterventionsplan"]
    },

    // --- HERZ / KREISLAUF ---
    "Arterielle Hypertonie": {
        specificItems: [
            { n: "Blutdruck-Entgleisung", tf: 'tf3', s: ["Kopfschmerz ( Hinterhaupt)", "Schwindel", "Ohrensausen", "Nasenbluten"] }
        ],
        matrix: ["Sturz", "Thrombose"],
        measures: ["Regelmäßige RR-Messung", "Salzarme Kost", "Gewichtskontrolle", "Flüssigkeitsbilanz"]
    },
    "Herzinsuffizienz (Global/NYHA)": {
        specificItems: [
            { n: "Dyspnoe (Atemnot)", tf: 'tf3', l: ["NYHA I", "NYHA II", "NYHA III", "NYHA IV"], s: ["Belastungsdyspnoe", "Ruhedyspnoe", "Orthopnoe (Nacht)"] },
            { n: "Ödeme (Wassersucht)", tf: 'tf3', s: ["Beinödeme (Eindrückbar)", "Lungenödem (Rasselgeräusche)", "Gewichtszunahme"] },
            { n: "Nykturie", tf: 'tf4', s: ["Nächtliches Wasserlassen", "Schlafstörung durch Harndrang"] }
        ],
        matrix: ["Dekubitus", "Thrombose", "Pneumonie", "Exsikkose (bei Diuretika)"],
        measures: ["Tägliche Gewichtskontrolle", "Trinkmengenbeschränkung", "Oberkörperhochlagerung", "Kompressionstherapie"],
        concepts: ["Basale Stimulation"]
    },
    "Vorhofflimmern (Arrhythmie)": {
        specificItems: [
            { n: "Herzstolpern", tf: 'tf3', s: ["Palpitationen", "Innere Unruhe", "Angstgefüht", "Schwindel"] },
            { n: "Embolierisiko", tf: 'tf3', s: ["Blutungsneigung unter Antikoagulation", "Hämatome"] }
        ],
        matrix: ["Thrombose (Schlaganfallrisiko)", "Sturz"],
        measures: ["Pulskontrolle (Rhythmus)", "Überwachung der Gerinnungswerte", "Vermeidung von Verletzungen"]
    },
    "KHK (Koronare Herzkrankheit)": {
        specificItems: [
            { n: "Angina Pectoris", tf: 'tf3', l: ["Stabil", "Instabil"], s: ["Brustenge (Retrosternal)", "Ausstrahlung Arm/Kiefer", "Kaltschweißigkeit"] }
        ],
        matrix: ["Schmerz", "Sturz", "Angst"],
        measures: ["Nitro-Spray bereitstellen", "Vermeidung von Pressatmung", "Belastung limitieren", "Schmerzassessment"]
    },
    "pAVK (Durchblutungsstörung)": {
        specificItems: [
            { n: "Claudicatio intermittens", tf: 'tf2', s: ["Schaufensterkrankheit", "Wadenschmerz beim Gehen", "Ruheschmerz (Stadium IV)"] },
            { n: "Ischämische Haut", tf: 'tf3', s: ["Kühle Haut", "Blässe/Zyanose", "Nekrosen an Zehen"] }
        ],
        matrix: ["Dekubitus (Fersen)", "Wundheilungsstörung", "Schmerz"],
        measures: ["Tieflage der Beine", "Keine Kompression (bei pAVK!)", "Hautpflege", "Wundversorgung"]
    },
    "Ulcus cruris venosum": {
        specificItems: [
            { n: "Chronische Wunde", tf: 'tf3', s: ["Offenes Bein", "Starke Exsudation", "Ödeme Unterschenkel"] }
        ],
        matrix: ["Infektionsrisiko", "Schmerz", "Dekubitus"],
        measures: ["Kompressionstherapie", "Wundversorgung nach MWM", "Beine hochlagern"]
    },

    // --- ORTHOPÄDIE ---
    "Z.n. Schenkelhalsfraktur": {
        specificItems: [
            { n: "Post-OP Instabilität", tf: 'tf2', l: STATUS_MOB, s: ["Belastungslimitierung", "Angst vor erneutem Sturz"] },
            { n: "Operationswunde", tf: 'tf3', s: ["Hüftschmerz", "Rötung/Schwellung"] }
        ],
        matrix: ["Sturz", "Thrombose", "Kontraktur", "Dekubitus", "Pneumonie"],
        measures: ["Frühmobilisation", "Physiotherapie", "Kompression", "Hüftprotektoren nutzen"]
    },
    "Osteoporose": {
        specificItems: [
            { n: "Knochenbrüchigkeit", tf: 'tf2', s: ["Witwenbuckel", "Größenabnahme", "Fehlhaltung"] },
            { n: "Chronischer Rückenschmerz", tf: 'tf3', l: STATUS_PAIN }
        ],
        matrix: ["Sturz (Hohes Frakturrisiko)", "Schmerz"],
        measures: ["Kalzium-reiche Ernährung", "Sturzprophylaxe", "Rückenschonender Transfer"]
    },
    "Rheumatoide Arthritis": {
        specificItems: [
            { n: "Gelenkschmerz & Steifigkeit", tf: 'tf2', s: ["Morgensteifigkeit > 30 Min", "Gelenkdeformität", "Schwellung"] },
            { n: "Funktionseinschränkung", tf: 'tf4', s: ["Schwierigkeiten beim Greifen", "Hilfe beim Essen nötig"] }
        ],
        matrix: ["Kontraktur", "Schmerz", "Sturz"],
        measures: ["Kältetherapie bei Entzündung", "Bewegungsübungen", "Gelenkschutzberatung", "Hilfsmitteleinsatz (Griffverdickung)"]
    },

    // --- ATMUNG ---
    "COPD": {
        specificItems: [
            { n: "Chronische Atemwegsobstruktion", tf: 'tf3', l: ["GOLD I", "GOLD II", "GOLD III", "GOLD IV"], s: ["AHA-Symptomatik (Auswurf, Husten, Atemnot)", "Fassthorax"] },
            { n: "Sauerstoff-Pflicht", tf: 'tf3', isOxygen: true, s: ["Sauerstoff-Konzentrator", "Mobilgerät"] },
            { n: "Psychische Belastung", tf: 'tf1', s: ["Todesangst bei Atemnot", "Panikattacken"] }
        ],
        matrix: ["Pneumonie", "Mangelernährung", "Aspiration", "Thrombose"],
        measures: ["Lippenbremse anleiten", "Atemerleichternde Lagerung (V-A-T)", "Inhalation", "Vibrationsmassage", "Sauerstoffgabe überwachen"],
        concepts: ["Basale Stimulation", "Kinästhetik"]
    },
    "Pneumonie (Aktuell/Z.n.)": {
        specificItems: [
            { n: "Eingeschränkte Belüftung", tf: 'tf3', s: ["Rasselgeräusche", "Flache Atmung", "Fieber", "Erschöpfung"] }
        ],
        matrix: ["Pneumonie", "Thrombose", "Dekubitus"],
        measures: ["Atemgymnastik (LISA)", "Mobilisation", "Flüssigkeitszufuhr fördern", "Einreibungen (ASE)"]
    },

    // --- STOFFWECHSEL ---
    "Diabetes Mellitus Typ 2": {
        specificItems: [
            { n: "BZ-Entgleisung", tf: 'tf3', l: STATUS_DIABETES, s: ["Polydipsie (Durst)", "Gewichtsabnahme", "Heißhunger"] },
            { n: "Diabetische Spätfolgen", tf: 'tf3', s: ["Retinopathie (Sehverlust)", "Nephropathie (Niere)", "Mikroangiopathie"] }
        ],
        matrix: ["Wundheilungsstörung", "Dekubitus", "Infektionsrisiko", "Sturz (Hypoglykämie)"],
        measures: ["BZ-Kontrolle", "Diabetes-Diät / BE-Berechnung", "Medizinische Fußpflege", "Injektionstechnik überwachen"]
    },
    "Chronische Niereninsuffizienz (CNI)": {
        specificItems: [
            { n: "Urämie-Symptome", tf: 'tf3', s: ["Pruritus (Juckreiz)", "Uringeruch der Haut", "Ödeme", "Übelkeit"] },
            { n: "Dialyse-Pflicht", tf: 'tf3', s: ["Shunt-Arm beachten", "Dialyse-Tage (Mo/Mi/Fr)"] }
        ],
        matrix: ["Exsikkose", "Mangelernährung", "Hautdefekte"],
        measures: ["Trinkmengenbilanzierung", "Hautpflege (Rückfettend)", "Eiweißarme Kost", "Gewichtskontrolle"]
    },

    // --- ONKOLOGIE ---
    "Onkologie / Palliativ (Allgemein)": {
        specificItems: [
            { n: "Tumorschmerz", tf: 'tf3', l: STATUS_PAIN, s: ["Durchbruchschmerz", "Knochenschmerz"] },
            { n: "Kachexie & Anorexie", tf: 'tf4', s: ["Starker Gewichtsverlust", "Appetitlosigkeit", "Ekel vor Fleisch"] },
            { n: "Fatigue & Schwäche", tf: 'tf5', s: ["Extreme Müdigkeit", "Depressive Verstimmung"] }
        ],
        matrix: ["Schmerz", "Dekubitus", "Mangelernährung", "Thrombose", "Angst"],
        measures: ["Palliative Mundpflege", "Wunschkost", "Schmerztherapie nach WHO", "Psychosoziale Begleitung", "Lagerung zur Schmerzlinderung"],
        concepts: ["Palliativ-Care Ansatz", "Basale Stimulation"]
    },

    // --- GERÄTE / STOMA ---
    "PEG-Sonde": {
        specificItems: [
            { n: "Künstliche Ernährung", tf: 'tf4', s: ["Sondenkost (Bolus/Pumpe)", "Flüssigkeitssubstitution"] },
            { n: "Sondenkanal-Status", tf: 'tf3', s: ["Reizfrei", "Granulationsgewebe", "Leckage"] }
        ],
        matrix: ["Aspiration", "Infektionsrisiko", "Mangelernährung"],
        measures: ["Sondenpflege (Mobilisation)", "Verbandswechsel PEG", "Mundpflege", "Oberkörper hoch bei Gabe"]
    },
    "Suprapubischer Katheter (SPK)": {
        specificItems: [
            { n: "Harnableitung (Suprapubisch)", tf: 'tf4', s: ["Dauerbeutel", "Beinbeutel", "Ventil-Versorgung"] },
            { n: "Einstichstelle SPK", tf: 'tf3', s: ["Reizfrei", "Urin-Austritt", "Krustenbildung"] }
        ],
        matrix: ["Harnwegsinfekt", "Infektionsrisiko"],
        measures: ["Verbandswechsel SPK", "Katheterpflege", "Flüssigkeitszufuhr fördern"]
    },
    "Stoma (Colo-/Ileostoma)": {
        specificItems: [
            { n: "Anus praeter", tf: 'tf4', s: ["Stoma-Farbe (Rosig/Livid)", "Fördermenge", "Hautirritation"] },
            { n: "Selbstversorgung Stoma", tf: 'tf4', l: ["Möglich", "Teilhilfe", "Übernahme"] }
        ],
        matrix: ["Hautdefekt", "Mangelernährung (bei Ileostoma)", "Soziale Isolation"],
        measures: ["Stomapflege", "Hautschutz", "Ernährungsberatung (Blähende Kost meiden)"]
    },

    // --- ALLGEMEIN / SONSTIGE ---
    "Harninkontinenz": {
        specificItems: [
            { n: "Urinverlust", tf: 'tf4', l: ["Stress-IK", "Drang-IK", "Reflex-IK", "Überlauf-IK"], s: ["Nutzt Vorlagen", "Nutzt Pants", "Einnässen nachts"] }
        ],
        matrix: ["Harninkontinenz", "Dekubitus (Feuchtigkeit)", "Sturz (beim Eilen zur Toilette)"],
        measures: ["Toilettentraining", "Hautschutzsalbe", "Kontinenzberatung", "Miktionsprotokoll"]
    },
    "Dekubitus": {
        specificItems: [
            { n: "Druckgeschwür", tf: 'tf3', l: ["Grad I", "Grad II", "Grad III", "Grad IV"], s: ["Steißbein", "Fersen", "Trochanter major"] }
        ],
        matrix: ["Dekubitus", "Schmerz", "Infektionsrisiko"],
        measures: ["Regelmäßige Umlagerung", "Druckentlastende Matratze", "Wundversorgung", "Eiweißreiche Kost"]
    },
    "MRSA / Infektion": {
        specificItems: [
            { n: "Besiedelung mit Keimen", tf: 'tf3', s: ["Nase/Rachen", "Wunde", "Urin"] }
        ],
        matrix: ["Infektionsrisiko"],
        measures: ["Isolationsmaßnahmen", "Sanierung nach Plan", "Schutzkleidung nutzen", "Händedesinfektion"]
    },
    "Reduzierter Allgemeinzustand (Red. AZ)": {
        specificItems: [
            { n: "Multimorbidität", tf: 'tf3', s: ["Schwäche", "Geringe Belastbarkeit", "Hinfälligkeit"] }
        ],
        matrix: ["Sturz", "Mangelernährung", "Exsikkose", "Pneumonie", "Dekubitus"],
        measures: ["Engmaschige Überwachung", "Kleine Mahlzeiten", "Mobilisation nach Tagesform"]
    }
};

// Automatisches Mapping für alle Keys aus MasterData, um Lückenlosigkeit zu garantieren
const allDiagnosisKeys = [
    "Apoplex (Schlaganfall)", "Demenz (Alzheimer/Vaskulär)", "Morbus Parkinson", "Multiple Sklerose (MS)", "Epilepsie", "Wesensveränderung", "Polyneuropathie",
    "Rezidivierende depressive Störung", "Angst- und Panikstörung", "Schizophrenie", "Bipolare Störung", "Sucht / Abhängigkeit", "Borderline-Störung",
    "Insomnie (Schlafstörung)", "Schlafapnoe-Syndrom", "Restless-Legs-Syndrom (RLS)",
    "Arterielle Hypertonie", "Herzinsuffizienz (Global/NYHA)", "Vorhofflimmern (Arrhythmie)", "KHK (Koronare Herzkrankheit)", "pAVK (Durchblutungsstörung)", "Ulcus cruris venosum",
    "Z.n. Schenkelhalsfraktur", "Hüft-TEP (Implantation)", "Knie-TEP (Implantation)", "Z.n. Amputation (Gliedmaßen)", "Osteoporose", "Rheumatoide Arthritis", "Spinalkanalstenose", "Bandscheibenvorfall (LWS/HWS)",
    "Diabetes Mellitus Typ 1", "Diabetes Mellitus Typ 2", "Chronische Niereninsuffizienz (CNI)", "Leberzirrhose", "Gicht (Hyperurikämie)", "Adipositas",
    "Onkologie / Palliativ (Allgemein)", "Mammakarzinom", "Bronchialkarzinom", "Kolorektales Karzinom", "Prostatakarzinom", "Pankreaskarzinom",
    "COPD", "Pneumonie (Aktuell/Z.n.)", "Asthma Bronchiale", "Tracheostoma",
    "PEG-Sonde", "Dauerkatheter (Transurethral)", "Suprapubischer Katheter (SPK)", "Stoma (Colo-/Ileostoma)",
    "Harninkontinenz", "Inkontinenz (Stuhl)", "Harnwegsinfekt (HWI)", "Dekubitus", "Reduzierter Allgemeinzustand (Red. AZ)", "Glaukom / Blindheit", "MRSA / Infektion"
];

allDiagnosisKeys.forEach(key => {
    if (!LOGIC_DB[key]) {
        // Logik für verbleibende Keys, falls oben vergessen (Sicherheitsnetz)
        let items: SpecificItem[] = [{ n: "Klinische Beobachtung", tf: 'tf3', s: ["Tagesform abhängig"] }];
        let matrix: string[] = ["Sturz"];
        let measures: string[] = ["Beobachtung", "Vitalwertkontrolle"];

        if (key.includes("Karzinom")) {
            items = [{ n: "Onkologische Symptomatik", tf: 'tf3', s: ["Schmerzen", "Schwäche", "Gewichtsverlust"] }];
            matrix = ["Schmerz", "Mangelernährung", "Dekubitus"];
        } else if (key.includes("TEP") || key.includes("Bandscheibe")) {
            items = [{ n: "Bewegungsschmerz", tf: 'tf2', s: ["Eingeschränkter Radius", "Schonhaltung"] }];
            matrix = ["Sturz", "Thrombose", "Kontraktur"];
        }

        LOGIC_DB[key] = { specificItems: items, matrix, measures };
    }
});
