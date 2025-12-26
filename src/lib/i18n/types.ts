 // Supported languages
export type Language = 'en' | 'de' | 'fr' | 'es' | 'it';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
];

// Translation schema
export interface Translations {
  // Common
  common: {
    cancel: string;
    confirm: string;
    save: string;
    close: string;
    gotIt: string;
    loading: string;
    error: string;
    success: string;
    yes: string;
    no: string;
    back: string;
    next: string;
    submit: string;
    edit: string;
    delete: string;
    add: string;
    remove: string;
    clear: string;
    search: string;
    comingSoon: string;
  };

  // Header
  header: {
    newGame: string;
    about: string;
    keeperPro: string;
    proSettings: string;
    gameHistory: string;
    manageLicense: string;
    addAsApp: string;
  };

  // Player Setup
  playerSetup: {
    title: string;
    addPlayer: string;
    playerName: string;
    enterName: string;
    startGame: string;
    minPlayers: string;
    maxPlayers: string;
    turnOrder: string;
    goesFirst: string;
    dragToReorder: string;
    savedPlayers: string;
  };

  // Game Controls
  gameControls: {
    turn: string;
    passTurn: string;
    undoLast: string;
    endGame: string;
    submitWord: string;
    clearTiles: string;
    timerPaused: string;
    resume: string;
    pause: string;
    scoreboard: string;
    rank: string;
    player: string;
    score: string;
  };

  // Board & Letter Picker
  board: {
    placeWord: string;
    horizontal: string;
    vertical: string;
    letters: string;
    blankTile: string;
    chooseBlankLetter: string;
    blankTileInfo: string;
    placeWordButton: string;
    fixConflicts: string;
    invalidPlacement: string;
    letterConflict: string;
    mustCoverCenter: string;
    mustConnectToTiles: string;
    alreadyOnBoard: string;
    newTile: string;
  };

  // Score View
  scoreView: {
    words: string;
    totalScore: string;
    currentPlayer: string;
    noWordsYet: string;
  };

  // New Game Modal
  newGameModal: {
    title: string;
    restartSamePlayers: string;
    newPlayers: string;
    keepScoresReset: string;
    startFresh: string;
  };

  // End Game Modal
  endGameModal: {
    title: string;
    saveToHistory: string;
    dontSave: string;
    saving: string;
  };

  // Pro Modal
  proModal: {
    title: string;
    subtitle: string;
    oneTimeFee: string;
    features: {
      dictionary: string;
      dictionaryDesc: string;
      gameHistory: string;
      gameHistoryDesc: string;
      wordHelper: string;
      wordHelperDesc: string;
      wordLookup: string;
      wordLookupDesc: string;
      multiLingual: string;
      multiLingualDesc: string;
      turnTimer: string;
      turnTimerDesc: string;
    };
    buyNow: string;
    activateLicense: string;
    enterLicenseKey: string;
    licenseKeyPlaceholder: string;
    activate: string;
    activating: string;
    invalidLicense: string;
    proActive: string;
    proActiveDesc: string;
    featuresIncluded: string;
  };

  // Pro Settings
  proSettings: {
    title: string;
    wordChecker: string;
    wordCheckerDesc: string;
    turnTimer: string;
    turnTimerDesc: string;
    minutes: string;
    languages: string;
    languagesDesc: string;
    savedPlayers: string;
    savedPlayersDesc: string;
    addPlayerName: string;
    noSavedPlayers: string;
  };

  // Game History
  gameHistory: {
    title: string;
    noGames: string;
    winner: string;
    duration: string;
    turns: string;
    players: string;
    viewBoard: string;
  };

  // Info Modal
  infoModal: {
    title: string;
    aboutTab: string;
    faqTab: string;
    aboutDescription: string;
    features: {
      trackScores: string;
      calculateScores: string;
      keepHistory: string;
      visualizeTiles: string;
    };
    boardSquares: string;
    tripleWord: string;
    doubleWord: string;
    tripleLetter: string;
    doubleLetter: string;
    blankTile: string;
    trademark: string;
    faq: {
      refundQ: string;
      refundA: string;
      licenseQ: string;
      licenseA: string;
      dataQ: string;
      dataA: string;
      devicesQ: string;
      devicesA: string;
      mobileAppQ: string;
      mobileAppA: string;
      whyKQ: string;
      whyKA: string;
      bugQ: string;
      bugA: string;
    };
  };

  // Install Prompt
  installPrompt: {
    title: string;
    description: string;
    iosSafari: string;
    iosSteps: string[];
    androidChrome: string;
    androidSteps: string[];
    browserSteps: string[];
  };

  // Footer
  footer: {
    madeBy: string;
    funnyPhrases: string[];
  };

  // Bingo Celebration
  bingo: {
    title: string;
    subtitle: string;
    bonusPoints: string;
    letsGo: string;
  };

  // Email (for server-side)
  email: {
    subject: string;
    thankYou: string;
    licenseReady: string;
    yourLicenseKey: string;
    howToActivate: string;
    activateSteps: string[];
    proFeaturesIncluded: string;
    keepEmailSafe: string;
    questions: string;
  };
}

