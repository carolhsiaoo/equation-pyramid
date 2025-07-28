import {
  BIG_NUMBER_THRESHOLD,
  INVALID_RESULT,
  MAX_BIG_NUMBER_TILES,
  MAX_DIVIDE_TILES,
  MAX_MULTIPLY_TILES,
  MAX_TILE_NUMBER,
  MAX_VALID_EQUATIONS,
  MIN_VALID_EQUATIONS,
  OPERATORS,
} from "@/constants";
import type { Equation, GameState, Tile } from "@/logic/game/types";

/**
 * Generate tiles with human-friendly constraints
 * - Max 2 multiply tiles
 * - Max 2 divide tiles
 * - Max 3 tiles with numbers >= 10
 */
function generateConstrainedTiles(): Tile[] {
  const tiles: Tile[] = [];
  const usedTiles = new Set<string>(); // Track duplicates
  let multiplyCount = 0;
  let divideCount = 0;
  let bigNumberCount = 0;

  for (let i = 0; i < 10; i++) {
    const label = String.fromCharCode(65 + i); // A, B, C, D, etc.
    let tile: Tile;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      // Generate a random tile
      const operatorIndex = Math.floor(Math.random() * OPERATORS.length);
      const operator = OPERATORS[operatorIndex];

      // Prefer smaller numbers to make calculation easier
      let number: number;
      if (bigNumberCount >= MAX_BIG_NUMBER_TILES) {
        // Force small number if we've hit the big number limit
        number = Math.floor(Math.random() * (BIG_NUMBER_THRESHOLD - 1)) + 1; // 1-9
      } else {
        // Bias towards smaller numbers (70% chance for 1-9, 30% for 10-15)
        if (Math.random() < 0.7) {
          number = Math.floor(Math.random() * (BIG_NUMBER_THRESHOLD - 1)) + 1; // 1-9
        } else {
          number =
            Math.floor(
              Math.random() * (MAX_TILE_NUMBER - BIG_NUMBER_THRESHOLD + 1),
            ) + BIG_NUMBER_THRESHOLD; // 10-15
        }
      }

      tile = { operator, number, label };
      attempts++;

      // Check if this tile violates constraints
      const wouldExceedMultiply =
        operator === "*" && multiplyCount >= MAX_MULTIPLY_TILES;
      const wouldExceedDivide =
        operator === "/" && divideCount >= MAX_DIVIDE_TILES;
      const wouldExceedBigNumber =
        number >= BIG_NUMBER_THRESHOLD &&
        bigNumberCount >= MAX_BIG_NUMBER_TILES;

      // Check for meaningless tiles
      const isMeaningless =
        (operator === "*" && number === 1) ||
        (operator === "/" && number === 1);

      // Check for duplicates
      const tileKey = `${operator}${number}`;
      const isDuplicate = usedTiles.has(tileKey);

      if (
        !wouldExceedMultiply &&
        !wouldExceedDivide &&
        !wouldExceedBigNumber &&
        !isMeaningless &&
        !isDuplicate
      ) {
        // Valid tile, update counters
        if (operator === "*") multiplyCount++;
        if (operator === "/") divideCount++;
        if (number >= BIG_NUMBER_THRESHOLD) bigNumberCount++;
        usedTiles.add(tileKey);
        break;
      }

      // If we've tried too many times, force a valid tile
      if (attempts >= maxAttempts) {
        // Generate a safe tile (+ or - with small number)
        const safeOperator = Math.random() < 0.5 ? "+" : "-";
        let safeNumber: number | undefined;
        let safeTileKey: string | undefined;

        // Try to find a safe number that's not duplicate
        for (let safeAttempt = 0; safeAttempt < 20; safeAttempt++) {
          safeNumber =
            Math.floor(Math.random() * (BIG_NUMBER_THRESHOLD - 1)) + 1;
          safeTileKey = `${safeOperator}${safeNumber}`;
          if (!usedTiles.has(safeTileKey)) {
            break;
          }
        }

        // At this point, safeNumber and safeTileKey are guaranteed to be defined
        if (safeNumber === undefined || safeTileKey === undefined) {
          // Fallback: use a guaranteed unique tile
          safeNumber = 1;
          safeTileKey = `${safeOperator}1`;
        }

        tile = { operator: safeOperator, number: safeNumber, label };
        usedTiles.add(safeTileKey);
        break;
      }
    } while (attempts < maxAttempts);

    tiles.push(tile);
  }

  return tiles;
}

/**
 * Core calculation function that handles order of operations correctly
 * Returns raw result without any validation constraints
 */
function calculateEquationCore(tiles: [Tile, Tile, Tile]): number {
  const [first, second, third] = tiles;

  // For a three-term expression: first.number second.operator second.number third.operator third.number
  // We need to follow order of operations (PEMDAS/BODMAS)

  // Case 1: Both second and third operators are multiplication or division
  // Evaluate left to right: ((first op2 second) op3 third)
  if (
    (second.operator === "*" || second.operator === "/") &&
    (third.operator === "*" || third.operator === "/")
  ) {
    let result = first.number;

    // Apply second operator
    if (second.operator === "*") {
      result *= second.number;
    } else {
      result = result / second.number;
    }

    // Apply third operator
    if (third.operator === "*") {
      result *= third.number;
    } else {
      result = result / third.number;
    }

    return result;
  }

  // Case 2: Only second operator is multiplication or division
  // Evaluate as: (first op2 second) op3 third
  if (second.operator === "*" || second.operator === "/") {
    let result = first.number;

    // Apply second operator first (higher precedence)
    if (second.operator === "*") {
      result *= second.number;
    } else {
      result = result / second.number;
    }

    // Then apply third operator
    if (third.operator === "+") {
      result += third.number;
    } else {
      result -= third.number;
    }

    return result;
  }

  // Case 3: Only third operator is multiplication or division
  // Evaluate as: first op2 (second op3 third)
  if (third.operator === "*" || third.operator === "/") {
    // Calculate second op3 third first (higher precedence)
    let rightResult = second.number;
    if (third.operator === "*") {
      rightResult *= third.number;
    } else {
      rightResult = rightResult / third.number;
    }

    // Then apply second operator with the result
    let result = first.number;
    if (second.operator === "+") {
      result += rightResult;
    } else {
      result -= rightResult;
    }

    return result;
  }

  // Case 4: Both operators are addition or subtraction
  // Evaluate left to right: ((first op2 second) op3 third)
  let result = first.number;

  // Apply second operator
  if (second.operator === "+") {
    result += second.number;
  } else {
    result -= second.number;
  }

  // Apply third operator
  if (third.operator === "+") {
    result += third.number;
  } else {
    result -= third.number;
  }

  return result;
}

/**
 * Calculate the raw mathematical result of a 3-tile equation following order of operations
 * Shows actual mathematical result without game validity constraints
 */
export function calculateEquationRaw(tiles: [Tile, Tile, Tile]): number {
  const result = calculateEquationCore(tiles);
  // Round to 2 decimal places to handle floating point precision issues
  return Math.round(result * 100) / 100;
}

/**
 * Calculate the game equation with validation for integer results and positive values
 */
export function calculateEquation(tiles: [Tile, Tile, Tile]): number {
  const [first, second, third] = tiles;

  // Validate division operations before calculation to ensure integer results
  // This requires checking intermediate steps for division operations

  // Case 1: Both second and third operators are multiplication or division
  if (
    (second.operator === "*" || second.operator === "/") &&
    (third.operator === "*" || third.operator === "/")
  ) {
    let result = first.number;

    // Apply second operator with validation
    if (second.operator === "*") {
      result *= second.number;
    } else {
      if (result % second.number !== 0) return INVALID_RESULT;
      result = result / second.number;
    }

    // Apply third operator with validation
    if (third.operator === "*") {
      result *= third.number;
    } else {
      if (result % third.number !== 0) return INVALID_RESULT;
      result = result / third.number;
    }

    // Check if final result is valid
    if (result <= 0 || !Number.isInteger(result)) {
      return INVALID_RESULT;
    }

    return result;
  }

  // Case 2: Only second operator is multiplication or division
  if (second.operator === "*" || second.operator === "/") {
    let result = first.number;

    // Apply second operator with validation
    if (second.operator === "*") {
      result *= second.number;
    } else {
      if (result % second.number !== 0) return INVALID_RESULT;
      result = result / second.number;
    }

    // Apply third operator (no division validation needed for +/-)
    if (third.operator === "+") {
      result += third.number;
    } else {
      result -= third.number;
    }

    // Check if final result is valid
    if (result <= 0 || !Number.isInteger(result)) {
      return INVALID_RESULT;
    }

    return result;
  }

  // Case 3: Only third operator is multiplication or division
  if (third.operator === "*" || third.operator === "/") {
    // Calculate second op3 third first with validation
    let rightResult = second.number;
    if (third.operator === "*") {
      rightResult *= third.number;
    } else {
      if (rightResult % third.number !== 0) return INVALID_RESULT;
      rightResult = rightResult / third.number;
    }

    // Apply second operator
    let result = first.number;
    if (second.operator === "+") {
      result += rightResult;
    } else {
      result -= rightResult;
    }

    // Check if final result is valid
    if (result <= 0 || !Number.isInteger(result)) {
      return INVALID_RESULT;
    }

    return result;
  }

  // Case 4: Both operators are addition or subtraction
  // Use the core calculation since no division validation is needed
  const result = calculateEquationCore(tiles);

  // Check if final result is valid
  if (result <= 0 || !Number.isInteger(result)) {
    return INVALID_RESULT;
  }

  return result;
}

/**
 * Generate valid equations only (optimized for game state generation)
 */
function generateValidEquations(tiles: Tile[]): Equation[] {
  const equations: Equation[] = [];

  // Generate all possible combinations of 3 tiles
  for (let i = 0; i < tiles.length; i++) {
    for (let j = 0; j < tiles.length; j++) {
      if (j === i) continue;
      for (let k = 0; k < tiles.length; k++) {
        if (k === i || k === j) continue;

        const equationTiles: [Tile, Tile, Tile] = [
          tiles[i],
          tiles[j],
          tiles[k],
        ];
        const result = calculateEquation(equationTiles);

        // Only add valid equations with results in reasonable range
        if (result !== INVALID_RESULT && result >= 1 && result <= 15) {
          equations.push({
            tiles: equationTiles,
            result,
          });
        }
      }
    }
  }

  return equations;
}

/**
 * Improved game state generation with better time complexity
 * 1. Generate constrained tiles first
 * 2. Calculate only valid equations
 * 3. Use frequency counting to find the best target
 */
export function generateGameState(): GameState {
  let attempts = 0;
  const maxAttempts = 10; // Reduced max attempts since we're more strategic

  do {
    attempts++;

    // Step 1: Generate constrained tiles
    const tiles = generateConstrainedTiles();

    // Step 2: Calculate all valid equations
    const validEquations = generateValidEquations(tiles);

    // Check if we have enough valid equations
    if (validEquations.length < MIN_VALID_EQUATIONS) {
      if (attempts >= maxAttempts) {
        // Continue with what we have if we've tried enough times
        break;
      }
      continue;
    }

    // Step 3: Count frequency of each result using Map
    const resultFrequency = new Map<number, Equation[]>();

    for (const equation of validEquations) {
      if (!resultFrequency.has(equation.result)) {
        resultFrequency.set(equation.result, []);
      }
      const equations = resultFrequency.get(equation.result);
      if (equations) {
        equations.push(equation);
      }
    }

    // Step 4: Find the result that appears most frequently
    let bestTarget = -1;
    let maxFrequency = 0;
    let bestEquations: Equation[] = [];

    for (const [result, equations] of resultFrequency.entries()) {
      const frequency = equations.length;
      // Prefer results with 2-4 equations (not too few, not too many)
      if (
        frequency >= MIN_VALID_EQUATIONS &&
        frequency <= MAX_VALID_EQUATIONS &&
        frequency > maxFrequency
      ) {
        maxFrequency = frequency;
        bestTarget = result;
        bestEquations = equations;
      }
    }

    // If we found a good target, return the game state
    if (bestTarget !== -1 && bestEquations.length >= MIN_VALID_EQUATIONS) {
      return {
        tiles,
        targetNumber: bestTarget,
        validEquations: bestEquations,
      };
    }

    // If no ideal target found but we have valid equations, pick any valid target
    if (validEquations.length >= MIN_VALID_EQUATIONS) {
      // Group by result and pick the first one with adequate frequency
      for (const [result, equations] of resultFrequency.entries()) {
        if (
          equations.length >= MIN_VALID_EQUATIONS &&
          equations.length <= MAX_VALID_EQUATIONS
        ) {
          return {
            tiles,
            targetNumber: result,
            validEquations: equations,
          };
        }
      }
    }
  } while (attempts < maxAttempts);

  // If we still couldn't generate a valid state, return the best we have
  const tiles = generateConstrainedTiles();
  const validEquations = generateValidEquations(tiles);

  if (validEquations.length > 0) {
    // Try to find a target with <= MAX_VALID_EQUATIONS
    const resultFrequency = new Map<number, Equation[]>();

    for (const equation of validEquations) {
      if (!resultFrequency.has(equation.result)) {
        resultFrequency.set(equation.result, []);
      }
      const equations = resultFrequency.get(equation.result);
      if (equations) {
        equations.push(equation);
      }
    }

    // Look for a result with valid equation count
    for (const [result, equations] of resultFrequency.entries()) {
      if (
        equations.length >= MIN_VALID_EQUATIONS &&
        equations.length <= MAX_VALID_EQUATIONS
      ) {
        return {
          tiles,
          targetNumber: result,
          validEquations: equations,
        };
      }
    }
  }

  // Last resort: return with empty equations (should be very rare)
  return {
    tiles,
    targetNumber: 1,
    validEquations: [],
  };
}

// Export as object to help with Jest module resolution
const GameLogic = {
  calculateEquationRaw,
  calculateEquation,
  generateGameState,
};

export default GameLogic;
