export const DEBUG = true;
export const NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = "G-NCXGB9SQK9";

// Game Configuration Constants
export const MAX_PLAYERS = 2;
export const MIN_PLAYERS = 1;
export const PLAYERS_OPTIONS = [1, 2];
export const MAX_ROUNDS = 5;
export const MIN_ROUNDS = 1;
export const ROUNDS_OPTIONS = [1, 3, 5];
export const INITIAL_PLAYERS = 1;
export const INITIAL_ROUNDS = 3;

// Game Timing Constants
export const ROUND_DURATION = 180; // 3 minutes in seconds
export const GUESS_DURATION = 10; // 10 seconds in seconds

// Game Logic Constants
export const TILES_PER_EQUATION = 3;
export const OPERATORS = ["+", "-", "*", "/"];
export const INVALID_RESULT = -1;

// Tile Generation Constants
export const MAX_DIVIDE_TILES = 2;
export const MAX_MULTIPLY_TILES = 2;
export const MIN_VALID_EQUATIONS = 2;
export const MAX_VALID_EQUATIONS = 4;
export const MIN_TILE_NUMBER = 1;
export const MAX_TILE_NUMBER = 15;

// Human-friendly Constraint Constants
export const MAX_BIG_NUMBER_TILES = 3; // tiles with number >= 10
export const BIG_NUMBER_THRESHOLD = 10;
