// Define the type for sports configuration
export const SPORTS_CONFIG: Record<string, string[]> = {
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
  ],
  // baseball: [
  //   'baseball_mlb',
  //   // 'baseball_npb', // Japanese League
  //   // 'baseball_kbo'  // Korean League
  // ],
  // cricket: [
  //   'cricket_ipl',
  //   'cricket_test_match',
  //   'cricket_odi',
  //   'cricket_t20'
  // ],
  // icehockey: [
  //   'icehockey_nhl',
  //   'icehockey_khl',
  //   'icehockey_shl',
  //   'icehockey_liiga'
  // ]
};

// Export league name mappings for consistent formatting
export const LEAGUE_NAMES: Record<string, string> = {
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
  'tennis_wta_singles': 'WTA Singles',
};

// Type for supported sports
export type SupportedSport = keyof typeof SPORTS_CONFIG;

// Type for league keys
export type LeagueKey = keyof typeof LEAGUE_NAMES; 