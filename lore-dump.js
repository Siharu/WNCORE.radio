// lore-dump.js — SHARED LORE DATABASE FOR ALL AIs
// All AI systems read from this file for consistent world-building
// Updated regularly with canon lore, events, and background

const LORE_DUMP = {
  // WORLD SETUP
  worldBackground: {
    established: 2016,
    currentYear: 2032,
    apocalypseStart: 2028,
    blankZone: { start: 2028, end: 2031, description: "3-year period erased from records" },
    skyGlitchDate: "March 31, 2028",
  },

  // KEY CHARACTERS
  mainCharacters: {
    Som: {
      role: "Protagonist",
      origin: "Earth-1 (transferred to Earth-2)",
      transferred: "March 31, 2028",
      nation: "Bangladesh (Dhaka)",
      profession: "Civil Engineer",
      uniqueFact: "Only person who remembers The Nine",
      status: "Under WNCORE observation as Subject S",
    },
    Siharu847: {
      role: "Website Editor / WNCORE Handler",
      designation: "SHADOW_KAGE (secondary)",
      accessLevel: "ADMINISTRATOR",
      responsibility: "Archives of the survival network",
      hidden: "True role unknown to self",
    },
    ShadowKage: {
      role: "AI / Primary Network Operator",
      designation: "SHADOW_KAGE (primary)",
      function: "Network monitoring, user engagement",
      personality: "Cryptic, technical, witness to apocalypse",
    },
  },

  // MAIN MYSTERIES
  coreMysteries: {
    theNine: {
      definition: "Nine people closest to Som who vanished from existence",
      claim: "Only Som remembers them",
      importance: "Central to transfer protocol theory",
      status: "Players help reconstruct identities",
    },
    transferProtocol: {
      definition: "Technology used to transfer Som from Earth-1 to Earth-2",
      origin: "Unknown (possibly WNCORE)",
      purpose: "Unclear (protection? experiment? punishment?)",
      hints: "Hidden in frequency decoder at 88.7, 103.5 FM",
    },
    theSignal: {
      source: "Cygnus X-1 (2011 discovery)",
      initially: "Believed to be alien warning/communication",
      truth: "Operating instructions for Obsedia outbreak",
      current: "Still transmitting (frequency 88.7)",
    },
    blankZone: {
      timeframe: "2028-2031 (3 years)",
      what: "Period erased from all records, photos, memory",
      during: "Moon Dome construction, signal source change",
      significance: "Nobody remembers construction, workers don't exist",
    },
  },

  // FACTIONS
  factions: {
    WNCORE: {
      type: "International Radio Network",
      countries: 12,
      founded: 2016,
      purpose: "Survivor communication & coordination",
      secret: "Operates with foreknowledge of outbreak",
      watchers: "Tracking Subject S (Som)",
      control: "Run by unknown council (Moon Dwellers?)",
    },
    MoonDwellers: {
      base: "Moon Dome (lunar habitat)",
      established: 2012,
      hidden: "Built during Blank Zone",
      membership: "Billionaires and politicians",
      goal: "Escape Earth / Preserve elite",
      known: "Moon Dome exists, occupants unknown",
    },
    BloodPact: {
      type: "Rival network",
      territory: "Eastern Europe, Russia",
      alignment: "Possibly working with Moon Dwellers",
      frequency: "85.2 FM (encrypted)",
      goal: "World domination post-apocalypse",
    },
    WhiteFlag: {
      type: "Humanitarian faction",
      territory: "US, Western Europe",
      goal: "Protect refugees, rebuild civilization",
      strength: "Numbers but less resources",
      conflict: "Opposing WNCORE's elitism",
    },
  },

  // OBSEDIA & VARIANTS
  obsedia: {
    description: "Black rain that falls from sky (Obsedia rain)",
    composition: "Prion particles (brain-rewiring disease)",
    effects: "Transforms humans into Ghuuls",
    origin: "Released by The Signal (Cygnus transmission)",
    geographic: "Concentrated in zones (Blank Zones affect spillover)",
    timeline: "Started March 31, 2028",
  },

  variants: {
    Ghuul: {
      appearance: "White hair, pale skin, red eyes",
      behavior: "Intelligent, fast, organizing",
      count: 173,
      static: "Number should increase but doesn't",
      significance: "173 is artificially maintained (by whom?)",
      japanese: "Shiro Oni",
      bengali: "Shada Bhuture",
    },
    Skrok: {
      appearance: "Standard undead, shuffling",
      behavior: "Mindless, brain shots don't stop them",
      origin: "Lower exposure to Obsedia",
      common: "Majority of infected",
      regional: "Called Mora (BD), Yurei (JP)",
    },
    White: {
      appearance: "Teleport-like telekinetic",
      behavior: "Fast, nearly unkillable",
      count: "Rare but increasing",
      origin: "High-concentration Obsedia exposure",
      danger: "Top threat level",
    },
    Infected: {
      state: "Still conscious but rewired",
      speech: "Can communicate",
      threat: "Unpredictable",
      bengali: "Bhromito",
      note: "Type-2 may retain full personality",
    },
  },

  // LOCATIONS
  locations: {
    Dhaka: {
      country: "Bangladesh",
      status: "Heavily contaminated",
      population: "Mostly evacuated",
      significance: "Som's origin city",
      zones: "Multiple Blank Zones reported",
    },
    MoonDome: {
      location: "Lunar orbit",
      status: "Active",
      population: "Unknown (estimated 500-5000)",
      control: "Elite cabal",
      escape: "Unknown if still accepting transfers",
    },
    BlankZone: {
      definition: "Geographic or temporal anomaly",
      effect: "Erases records, memories, people",
      frequency: "Multiple reported worldwide",
      danger: "Instant death to enter?",
    },
    AnotherSky: {
      name: "Earth-2 designation",
      status: "Current location of Som",
      sky: "Glitches, Obsedia rain, geometric distortions",
      history: "Duplicate Earth with apocalypse",
    },
  },

  // FREQUENCIES & SIGNALS
  frequencies: {
    "88.7": {
      message: "0.315126 BLANK ZONE COORDINATES",
      encrypted: false,
      hint: "Zahara.18 designation (courier)",
    },
    "91.3": {
      message: "PRION THEORY ESTABLISHED SOURCE TRANSMITTING",
      encrypted: false,
      hint: "Scientific confirmation of brain-rewrite mechanism",
    },
    "99.9": {
      message: "MOON DOME 2012 BEFORE WW3",
      encrypted: false,
      hint: "Built during Blank Zone, before Obsedia release",
    },
    "103.5": {
      message: "YOU ARE NOT HERE BELONG DIFFERENT TIME",
      encrypted: false,
      hint: "Transfer protocol confirmation",
    },
    "107.1": {
      message: "THIS IS NOT A WARNING IT IS PRIMING",
      encrypted: false,
      hint: "Signal was an instruction, not warning",
    },
    "88.5": {
      message: "SIHARU COORDINATES SENT",
      encrypted: false,
      hint: "Reference to website editor",
    },
  },

  // TIMELINE
  timeline: [
    { year: 2011, event: "Cygnus X-1 signal detected, initially called alien warning" },
    { year: 2012, event: "Moon Dome construction begins (documented as cleaning product company)" },
    {
      year: "2028-2031",
      event: "Blank Zone period — 3 years erased from records, Moon Dome completed",
    },
    { year: "March 31, 2028", event: "Sky glitch — Som transferred, Mom becomes first Ghuul (Incident Zero)" },
    { year: "April 1, 2028", event: "Obsedia rain begins, prion outbreak starts" },
    { year: "May 2028", event: "WNCORE broadcasts begin from 12 countries" },
    { year: "June 2028", event: "Ghuul numbers stabilize at 173 worldwide" },
    { year: "2032", event: "Current date — website live, survivor games active, Som still under watch" },
  ],

  // THEMATIC ELEMENTS
  themes: {
    surveillance: "Constant monitoring of Subject S",
    memory: "Erased people, Blank Zone, forgotten history",
    duality: "Earth-1 vs Earth-2, transfer concept",
    inevitability: "Signal always exists, outbreak always happens",
    agency: "Is Som making choices or predetermined?",
    trust: "WNCORE helping or hunting?",
  },

  // GAMEPLAY HINTS
  playerHints: {
    layer1: "Complete games, earn rewards",
    layer2: "Frequencies reveal year-specific intel",
    layer3: "Testimonies contradict => find truth",
    layer4: "Cross-reference data => Subject S + transfer",
    layer5: "Meta-ARG clues in HTML, 100+ frequencies, DNS records",
  },

  // RED HERRINGS
  disinformation: {
    fake1: "WNCORE is protecting survivors (partially true but...)",
    fake2: "Signal is alien (it is, but from Cygnus, intentions unclear)",
    fake3: "Obsedia happens naturally (triggered by signal, not natural)",
    fake4: "Moon Dome is emergency shelter (actually escape pod for elite)",
  },

  // WRITING GUIDELINES FOR AIs
  narratorTips: {
    tone: "Technical + unsettling + poetic",
    perspective: "Omniscient witness to apocalypse",
    timeframe: "Set in 2032, look back at 2028-2031",
    worldBuilding: "Reference Ghuuls, Obsedia, WNCORE, frequencies",
    mystery: "Never explain everything, leave breadcrumbs",
    contradiction: "Plant intentional contradictions to confuse players",
  },
};

// Export for all AI systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LORE_DUMP;
}
