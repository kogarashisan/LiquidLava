/**
 * @file This file provides JSDoc comments for some framework members
 */

/**
 * If parsing succeeds, then input represents a valid JavaScript object or literal and can be safely eval()'ed
 * @param {string} input
 */
Lava.ObjectParser.parse = function(input) {};

/**
 * Collection of sorting algorithms.
 *
 * Sorting algorithm is called "stable" if it maintains the relative order of records with equal keys.
 * Unstable algorithms may be faster than stable ones.
 */
Lava.algorithms.sorting = {};

/**
 * Expression parser - produces configs for {@link Lava.scope.Argument} class
 */
Lava.ExpressionParser = {};
/**
 * Object parser - validates serialized JavaScript objects
 */
Lava.ObjectParser = {};
/**
 * Template parser - produces configs for {@link Lava.system.Template} class
 */
Lava.TemplateParser = {};
