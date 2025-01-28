export const SUPPORTED_SPORTS = {
  soccer: [
    // Top 5 Leagues
    'soccer_epl',           // Premier League
    'soccer_spain_la_liga', // La Liga
    'soccer_germany_bundesliga', // Bundesliga
    'soccer_italy_serie_a', // Serie A
    'soccer_france_ligue_one', // Ligue 1
    
    // European Competitions
    'soccer_uefa_champs_league', // Champions League
    'soccer_uefa_europa_league', // Europa League
    'soccer_uefa_conference_league', // Conference League
    
    // Domestic Cups
    'soccer_fa_cup',        // England FA Cup
    'soccer_copa_del_rey',  // Spain Copa del Rey
    'soccer_dfb_pokal',     // Germany DFB Pokal
    'soccer_coppa_italia',  // Italy Coppa Italia
    'soccer_coupe_de_france', // France Coupe de France
    
    // Super Cups
    'soccer_uefa_super_cup',    // UEFA Super Cup
    'soccer_england_super_cup', // Community Shield
    'soccer_spain_super_cup',   // Supercopa de España
    'soccer_germany_super_cup', // DFL-Supercup
    'soccer_italy_super_cup',   // Supercoppa Italiana
    'soccer_france_super_cup'   // Trophée des Champions
  ],
  basketball: [
    'basketball_nba',
    'basketball_euroleague'
  ],
  tennis: [
    'tennis_atp_singles',
    'tennis_wta_singles'
  ]
};

export const LEAGUE_NAMES = {
  // Soccer - Top 5 Leagues
  'soccer_epl': 'Premier League',
  'soccer_spain_la_liga': 'La Liga',
  'soccer_germany_bundesliga': 'Bundesliga',
  'soccer_italy_serie_a': 'Serie A',
  'soccer_france_ligue_one': 'Ligue 1',
  
  // European Competitions
  'soccer_uefa_champs_league': 'Champions League',
  'soccer_uefa_europa_league': 'Europa League',
  'soccer_uefa_conference_league': 'Conference League',
  
  // Domestic Cups
  'soccer_fa_cup': 'FA Cup',
  'soccer_copa_del_rey': 'Copa del Rey',
  'soccer_dfb_pokal': 'DFB Pokal',
  'soccer_coppa_italia': 'Coppa Italia',
  'soccer_coupe_de_france': 'Coupe de France',
  
  // Super Cups
  'soccer_uefa_super_cup': 'UEFA Super Cup',
  'soccer_england_super_cup': 'Community Shield',
  'soccer_spain_super_cup': 'Supercopa de España',
  'soccer_germany_super_cup': 'DFL-Supercup',
  'soccer_italy_super_cup': 'Supercoppa Italiana',
  'soccer_france_super_cup': 'Trophée des Champions',
  
  // Basketball
  'basketball_nba': 'NBA',
  'basketball_euroleague': 'EuroLeague',
  
  // Tennis
  'tennis_atp_singles': 'ATP Singles',
  'tennis_wta_singles': 'WTA Singles'
} as const;

// Add type for league keys
export type LeagueKey = keyof typeof LEAGUE_NAMES;

// Add type for sport categories
export type SportCategory = keyof typeof SUPPORTED_SPORTS;

interface SingleBetLimits {
  type: 'SINGLE';
  minAmount: number;
  maxAmount: number;
  minOdds: number;
  maxOdds: number;
  maxPotentialWin: number;
}

interface MultipleBetLimits {
  type: 'MULTIPLE';
  minAmount: number;
  maxAmount: number;
  minOdds: number;
  maxOdds: number;
  maxSelections: number;
  maxPotentialWin: number;
}

interface SystemBetLimits {
  type: 'SYSTEM';
  minWonSelections: number;
  minPendingSelections: number;
  minTimeBeforeMatch: number;
}

export const BET_LIMITS: {
  SINGLE: SingleBetLimits;
  MULTIPLE: MultipleBetLimits;
  SYSTEM: SystemBetLimits;
} = {
  SINGLE: {
    type: 'SINGLE',
    minAmount: 1,
    maxAmount: 1000,
    minOdds: 1.01,
    maxOdds: 1000,
    maxPotentialWin: 10000
  },
  MULTIPLE: {
    type: 'MULTIPLE',
    minAmount: 1,
    maxAmount: 500,
    minOdds: 1.01,
    maxOdds: 1000,
    maxSelections: 20,
    maxPotentialWin: 10000
  },
  SYSTEM: {
    type: 'SYSTEM',
    minWonSelections: 2,
    minPendingSelections: 3,
    minTimeBeforeMatch: 300
  }
};

export type BetType = 'SINGLE' | 'MULTIPLE' | 'SYSTEM'; 