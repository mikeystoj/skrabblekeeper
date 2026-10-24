import { BINGO_BONUS, MAX_PLAYERS } from './constants';
import { LandingContent, PRO_PRICE } from './seo';

// Localized landing pages (/de, /fr, /es, /it). The app scores with the standard
// English tile values; Pro adds each language's special letters, so the copy says so.
export const LOCALIZED_CONTENT = {
  de: {
    lang: 'de',
    path: '/de',
    title: 'Skrabble Keeper - Kostenloser Scrabble Punkterechner & Punktezähler',
    description: `Kostenloser Scrabble Punktezähler: Wörter auf das Brett legen und Skrabble Keeper rechnet Buchstabenwerte, Prämienfelder und den ${BINGO_BONUS}-Punkte-Bonus für bis zu ${MAX_PLAYERS} Spieler aus. Ohne Anmeldung, auf Handy, Tablet und Computer.`,
    heading: 'Kostenloser Scrabble Punktezähler & Punkterechner',
    intro: `Skrabble Keeper zählt die Punkte für dein Scrabble®-Brettspiel. Lege jedes Wort auf ein interaktives Brett und die App rechnet Buchstabenwerte, Prämienfelder und den ${BINGO_BONUS}-Punkte-Bonus für bis zu ${MAX_PLAYERS} Spieler aus. Kein Stift, kein Papier, keine Anmeldung.`,
    howToHeading: 'So zählst du Punkte mit Skrabble Keeper',
    steps: [
      `Bis zu ${MAX_PLAYERS} Spielernamen eintragen und das Spiel starten.`,
      'Auf das Feld tippen, auf dem der erste Buchstabe des Wortes liegt.',
      'Das Wort eingeben und waagerecht oder senkrecht wählen.',
      'Die Punkte werden mit allen Prämienfeldern berechnet und dem Spieler gutgeschrieben.',
      'In der Punkteansicht siehst du alle Wörter und Zwischenstände.',
    ],
    faqHeading: 'Häufige Fragen',
    faqs: [
      {
        question: 'Wie zählt man Punkte beim Scrabble?',
        answer: 'Die Werte aller Buchstaben eines Wortes werden addiert, dann werden die Prämienfelder angewendet, die von neu gelegten Steinen bedeckt sind. Skrabble Keeper macht das automatisch, sobald du das Wort auf dem Brett eingibst.',
      },
      {
        question: 'Wie funktionieren die Prämienfelder?',
        answer: 'Doppelte und dreifache Buchstabenwerte multiplizieren den Stein auf dem Feld. Doppelte und dreifache Wortwerte multiplizieren das ganze Wort. Prämienfelder zählen nur in dem Zug, in dem ein Stein zum ersten Mal darauf gelegt wird.',
      },
      {
        question: 'Was bringt es, alle sieben Steine zu legen?',
        answer: `Wer in einem Zug alle sieben Steine seiner Bank legt, bekommt ${BINGO_BONUS} Bonuspunkte. Skrabble Keeper rechnet den Bonus automatisch dazu.`,
      },
      {
        question: 'Welche Buchstabenwerte verwendet die App?',
        answer: 'Skrabble Keeper verwendet die Buchstabenwerte der englischen Standardausgabe. Mit Keeper Pro kommen die deutschen Sonderbuchstaben Ä, Ö, Ü und ß dazu.',
      },
      {
        question: 'Ist Skrabble Keeper kostenlos?',
        answer: `Ja. Punkte zählen, das interaktive Brett und der Wortverlauf sind kostenlos und ohne Konto nutzbar. Keeper Pro ist ein optionaler Einmalkauf für ${PRO_PRICE} US-Dollar mit Wörterbuchprüfung, Spielverlauf, Wortvorschlägen und Zugtimer.`,
      },
    ],
    trademark: 'Scrabble® ist eine eingetragene Marke von Hasbro, Inc. Skrabble Keeper steht in keiner Verbindung zu Hasbro.',
  },
  fr: {
    lang: 'fr',
    path: '/fr',
    title: 'Skrabble Keeper - Compteur de points Scrabble gratuit',
    description: `Compteur de points Scrabble gratuit : placez vos mots sur un plateau interactif et Skrabble Keeper calcule la valeur des lettres, les cases bonus et la prime de ${BINGO_BONUS} points pour ${MAX_PLAYERS} joueurs maximum. Sans inscription, sur mobile, tablette et ordinateur.`,
    heading: 'Compteur de points Scrabble gratuit',
    intro: `Skrabble Keeper compte les points de votre partie de Scrabble® sur plateau. Placez chaque mot sur un plateau interactif et l'application additionne la valeur des lettres, les cases bonus et la prime de ${BINGO_BONUS} points pour ${MAX_PLAYERS} joueurs maximum. Ni stylo, ni papier, ni inscription.`,
    howToHeading: 'Comment compter les points avec Skrabble Keeper',
    steps: [
      `Ajoutez jusqu'à ${MAX_PLAYERS} joueurs et lancez la partie.`,
      'Touchez la case où se trouve la première lettre du mot.',
      'Tapez le mot et choisissez horizontal ou vertical.',
      'Le score est calculé avec toutes les cases bonus et ajouté au joueur.',
      'Ouvrez la vue des scores pour voir les mots et le total de chaque joueur.',
    ],
    faqHeading: 'Questions fréquentes',
    faqs: [
      {
        question: 'Comment compter les points au Scrabble ?',
        answer: "On additionne la valeur de chaque lettre du mot, puis on applique les cases bonus couvertes par les lettres posées pendant le tour. Skrabble Keeper le fait automatiquement dès que vous placez le mot sur le plateau.",
      },
      {
        question: 'Comment fonctionnent les cases bonus ?',
        answer: "Les cases lettre compte double et lettre compte triple multiplient la lettre posée dessus. Les cases mot compte double et mot compte triple multiplient tout le mot. Une case bonus ne compte qu'au tour où une lettre y est posée pour la première fois.",
      },
      {
        question: 'Que rapporte un scrabble (les sept lettres) ?',
        answer: `Poser les sept lettres de son chevalet en un seul tour rapporte une prime de ${BINGO_BONUS} points. Skrabble Keeper l'ajoute automatiquement.`,
      },
      {
        question: "Quelle valeur des lettres l'application utilise-t-elle ?",
        answer: "Skrabble Keeper utilise la valeur des lettres de l'édition anglaise standard. Keeper Pro ajoute les lettres accentuées françaises (É, È, À, Ç, Œ…).",
      },
      {
        question: 'Skrabble Keeper est-il gratuit ?',
        answer: `Oui. Le comptage des points, le plateau interactif et l'historique des mots sont gratuits et sans compte. Keeper Pro est un achat unique facultatif de ${PRO_PRICE} dollars US qui ajoute la vérification dans le dictionnaire, l'historique des parties, des suggestions de mots et un minuteur.`,
      },
    ],
    trademark: "Scrabble® est une marque déposée de Hasbro, Inc. Skrabble Keeper n'est ni affilié ni approuvé par Hasbro.",
  },
  es: {
    lang: 'es',
    path: '/es',
    title: 'Skrabble Keeper - Contador de puntos de Scrabble gratis',
    description: `Contador de puntos de Scrabble gratis: coloca tus palabras en un tablero interactivo y Skrabble Keeper suma el valor de las letras, las casillas de premio y el bonus de ${BINGO_BONUS} puntos para hasta ${MAX_PLAYERS} jugadores. Sin registro, en móvil, tablet y ordenador.`,
    heading: 'Contador de puntos de Scrabble gratis',
    intro: `Skrabble Keeper lleva la puntuación de tu partida de Scrabble® de mesa. Coloca cada palabra en un tablero interactivo y la app suma el valor de las letras, las casillas de premio y el bonus de ${BINGO_BONUS} puntos para hasta ${MAX_PLAYERS} jugadores. Sin lápiz, sin papel y sin registro.`,
    howToHeading: 'Cómo contar los puntos con Skrabble Keeper',
    steps: [
      `Añade hasta ${MAX_PLAYERS} jugadores y empieza la partida.`,
      'Toca la casilla donde va la primera letra de la palabra.',
      'Escribe la palabra y elige horizontal o vertical.',
      'La puntuación se calcula con todas las casillas de premio y se suma al jugador.',
      'Abre la vista de puntuaciones para ver las palabras y el total de cada jugador.',
    ],
    faqHeading: 'Preguntas frecuentes',
    faqs: [
      {
        question: '¿Cómo se cuentan los puntos en el Scrabble?',
        answer: 'Se suma el valor de cada letra de la palabra y luego se aplican las casillas de premio que cubren las fichas colocadas en ese turno. Skrabble Keeper lo hace automáticamente al colocar la palabra en el tablero.',
      },
      {
        question: '¿Cómo funcionan las casillas de premio?',
        answer: 'Las casillas de letra doble y letra triple multiplican la ficha colocada encima. Las de palabra doble y palabra triple multiplican toda la palabra. Una casilla de premio solo cuenta en el turno en que se coloca una ficha sobre ella por primera vez.',
      },
      {
        question: '¿Qué pasa si uso las siete fichas?',
        answer: `Colocar las siete fichas del atril en un solo turno da un bonus de ${BINGO_BONUS} puntos. Skrabble Keeper lo suma automáticamente.`,
      },
      {
        question: '¿Qué valores de letras usa la app?',
        answer: 'Skrabble Keeper usa los valores de la edición inglesa estándar. Keeper Pro añade las letras especiales del español (Ñ, Á, É, Í, Ó, Ú, Ü).',
      },
      {
        question: '¿Skrabble Keeper es gratis?',
        answer: `Sí. Contar puntos, el tablero interactivo y el historial de palabras son gratis y sin cuenta. Keeper Pro es una compra única opcional de ${PRO_PRICE} dólares estadounidenses que añade comprobación en diccionario, historial de partidas, sugerencias de palabras y temporizador.`,
      },
    ],
    trademark: 'Scrabble® es una marca registrada de Hasbro, Inc. Skrabble Keeper no está afiliado ni respaldado por Hasbro.',
  },
  it: {
    lang: 'it',
    path: '/it',
    title: 'Skrabble Keeper - Segnapunti Scrabble gratuito',
    description: `Segnapunti Scrabble gratuito: posiziona le parole su un tabellone interattivo e Skrabble Keeper calcola il valore delle lettere, le caselle premio e il bonus di ${BINGO_BONUS} punti per un massimo di ${MAX_PLAYERS} giocatori. Senza registrazione, su telefono, tablet e computer.`,
    heading: 'Segnapunti Scrabble gratuito',
    intro: `Skrabble Keeper tiene il punteggio della tua partita a Scrabble® da tavolo. Posiziona ogni parola su un tabellone interattivo e l'app somma il valore delle lettere, le caselle premio e il bonus di ${BINGO_BONUS} punti per un massimo di ${MAX_PLAYERS} giocatori. Niente penna, niente carta, nessuna registrazione.`,
    howToHeading: 'Come tenere il punteggio con Skrabble Keeper',
    steps: [
      `Aggiungi fino a ${MAX_PLAYERS} giocatori e inizia la partita.`,
      'Tocca la casella dove va la prima lettera della parola.',
      'Scrivi la parola e scegli orizzontale o verticale.',
      'Il punteggio viene calcolato con tutte le caselle premio e assegnato al giocatore.',
      'Apri la vista punteggi per vedere le parole e il totale di ogni giocatore.',
    ],
    faqHeading: 'Domande frequenti',
    faqs: [
      {
        question: 'Come si contano i punti a Scrabble?',
        answer: "Si somma il valore di ogni lettera della parola, poi si applicano le caselle premio coperte dalle tessere posate in quel turno. Skrabble Keeper lo fa in automatico quando inserisci la parola sul tabellone.",
      },
      {
        question: 'Come funzionano le caselle premio?',
        answer: "Le caselle lettera doppia e lettera tripla moltiplicano la tessera posata sopra. Le caselle parola doppia e parola tripla moltiplicano l'intera parola. Una casella premio vale solo nel turno in cui una tessera viene posata su di essa per la prima volta.",
      },
      {
        question: 'Cosa succede se uso tutte e sette le tessere?',
        answer: `Posare tutte e sette le tessere del leggio in un solo turno dà un bonus di ${BINGO_BONUS} punti. Skrabble Keeper lo aggiunge in automatico.`,
      },
      {
        question: "Quali valori delle lettere usa l'app?",
        answer: "Skrabble Keeper usa i valori delle lettere dell'edizione inglese standard. L'interfaccia è disponibile in italiano.",
      },
      {
        question: 'Skrabble Keeper è gratuito?',
        answer: `Sì. Il conteggio dei punti, il tabellone interattivo e la cronologia delle parole sono gratuiti e senza account. Keeper Pro è un acquisto unico facoltativo di ${PRO_PRICE} dollari USA che aggiunge il controllo nel dizionario, la cronologia delle partite, i suggerimenti di parole e il timer.`,
      },
    ],
    trademark: 'Scrabble® è un marchio registrato di Hasbro, Inc. Skrabble Keeper non è affiliato né approvato da Hasbro.',
  },
} satisfies Record<string, LandingContent>;

export type LocalizedLang = keyof typeof LOCALIZED_CONTENT;
export const LOCALIZED_LANGS = Object.keys(LOCALIZED_CONTENT) as LocalizedLang[];

// hreflang alternates shared by every landing page
export const LANGUAGE_ALTERNATES: Record<string, string> = {
  en: '/',
  ...Object.fromEntries(LOCALIZED_LANGS.map((lang) => [lang, `/${lang}`])),
  'x-default': '/',
};
