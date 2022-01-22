/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

import {
	AST,
	NotAsExpected
} from './util';

/**
 * BaseAnalyser is the base class that provides elemantary methods for the analyser subclass to transform
 * Assma view's string to an AbstractSyntaxTree structure.
 */
export default class BaseAnalyser {
	/**
	 * A function to analyse the existence of a character.
	 *
	 * @param {string} character Character.
	 * @return {function} A function that takes the input string to parse.
	 */
	static char(character) {
		/**
		 * @param {string} input Input string.
		 * @param {int} cursor A point from where to start parsing.
		 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
		 */
		return (input, cursor) => {
			const value = input[cursor];
			return value === character ? new AST(value, cursor + 1) : new NotAsExpected(`"${character}"`, cursor);
		};
	}

	/**
	 * A function to analyse the existence of a character
	 * according to a regular expression.
	 *
	 * @param {RegExp} regex Regular expression.
	 * @return {function} A function that takes the input string to parse.
	 */
	static charRegEx(regex) {
		/**
		 * @param {string} input Input string.
		 * @param {int} cursor A point from where to start parsing.
		 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
		 */
		return (input, cursor) => {
			const value = input[cursor];
			return value !== undefined && regex.test(value) ? new AST(value, cursor + 1) : new NotAsExpected(regex.toString(), cursor);
		};
	}

	/**
	 * A function to analyse the existence of a string.
	 *
	 * @param {string} string Input string.
	 * @return {function} A function that takes the input string to parse.
	 */
	static string(string) {
		/**
		 * @param {string} input Input string.
		 * @param {int} cursor A point from where to start parsing.
		 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
		 */
		return (input, cursor) => {
			const cursorNew = cursor + string.length;
			return input.slice(cursor, cursorNew) === string ? new AST(string, cursorNew) : new NotAsExpected(`"${string}"`, cursor);
		};
	}

	/**
	 * A function to simulate the not operator.
	 *
	 * @param {Array} strings Input strings.
	 * @return {function} A function that takes the input string to parse.
	 */
	static not(strings) {
		/**
		 * @param {string} input Input string.
		 * @param {int} cursor A point from where to start parsing.
		 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
		 */
		return (input, cursor) => {
			if (cursor < input.length) {
				for (let i = 0; i < strings.length; i++) {
					const string = strings[i];
					if (input.slice(cursor, cursor + string.length) === string) {
						return new NotAsExpected(`not "${string}"`, cursor);
					}
				}
				return new AST(input[cursor], cursor + 1);
			} else {
				return new NotAsExpected(`not ${strings.map(JSON.stringify).join(", ")}`, cursor);
			}
		};
	}

	/**
	 * A function to indicate if the cursor has not reached the end yet.
	 *
	 * @return {function} A function that takes the input string to parse.
	 */
	static notEndYet() {
		/**
		 * @param {string} input Input string.
		 * @param {int} cursor A point from where to start parsing.
		 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
		 */
		return (input, cursor) => {
			return cursor < input.length ? new AST(input[cursor], cursor + 1) : new NotAsExpected("notEndYet", cursor);
		};
	}

	/**
	 * A function to indicate if the cursor has reached the end.
	 *
	 * @return {function} A function that takes the input string to parse.
	 */
	static endOfInput() {
		/**
		 * @param {string} input Input string.
		 * @param {int} cursor A point from where to start parsing.
		 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
		 */
		return (input, cursor) => {
			return cursor === input.length ? new AST("EndOfInput", cursor) : new NotAsExpected("EndOfInput", cursor);
		};
	}
}
