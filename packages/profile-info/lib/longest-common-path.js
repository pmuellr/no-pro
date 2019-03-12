'use strict'

// from https://www.rosettacode.org/wiki/Find_common_directory_path#JavaScript

module.exports = longestCommonPath

/**
 * Given an array of strings, return an array of arrays, containing the
 * strings split at the given separator
 * @param {!Array<!string>} a
 * @param {string} sep
 * @returns {!Array<!Array<string>>}
 */
const splitStrings = (a, sep = '/') => a.map(i => i.split(sep));

/**
 * Given an index number, return a function that takes an array and returns the
 * element at the given index
 * @param {number} i
 * @return {function(!Array<*>): *}
 */
const elAt = i => a => a[i];

/**
 * Transpose an array of arrays:
 * Example:
 * [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]] ->
 * [['a', 'A', 1], ['b', 'B', 2], ['c', 'C', 3]]
 * @param {!Array<!Array<*>>} a
 * @return {!Array<!Array<*>>}
 */
const rotate = a => a[0].map((e, i) => a.map(elAt(i)));

/**
 * Checks of all the elements in the array are the same.
 * @param {!Array<*>} arr
 * @return {boolean}
 */
const allElementsEqual = arr => arr.every(e => e === arr[0]);

function longestCommonPath (fileNames, sep = '/') {
  return rotate(splitStrings(fileNames, sep))
    .filter(allElementsEqual).map(elAt(0)).join(sep)
}
