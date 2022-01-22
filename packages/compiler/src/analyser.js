/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

import BaseAnalyser from './base-analyser';
import {
  AST,
  NotAsExpected
} from './util';

/**
 * This class provides methods that use techniques of compilation theory (a combination of lexer and parser) to transform
 * Assma view's string to an AbstractSyntaxTree structure.
 */
export default class Analyser extends BaseAnalyser {
  /**
   * A function to add an alias.
   *
   * @param {function} analyse Parse function.
   * @param {string} alias Alias value.
   * @return {function} A function that takes the input string to parse.
   */
	static alias(alias, analyse) {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => {
			const output = analyse(input, cursor);
			return output instanceof NotAsExpected ? output : new AST({ type: alias, value: output.value }, output.cursor);
		};
	}

  /**
   * A function to reset the cursor to the initial value when a NotAsExpected object is thrown.
   *
   * @param {function} analyse Parse function.
   * @return {function} A function that takes the input string to parse.
   */
	static try(analyse) {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => {
			const output = analyse(input, cursor);
			if (output instanceof NotAsExpected) {
				output.cursor = cursor;
			}
			return output;
		};
	}

  /**
   * A function to simulate the And operator.
   *
   * @param {function} firstAnalyse First parse function.
   * @param {function} secondAnalyse Second parse function.
   * @return {function} A function that takes the input string to parse.
   */
	static and(firstAnalyse, secondAnalyse) {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => {
			const firstOutput = firstAnalyse(input, cursor);
			if (firstOutput instanceof NotAsExpected) {
				return firstOutput;
			} else {
				const secondOutput = secondAnalyse(input, firstOutput.cursor);
				return secondOutput instanceof NotAsExpected ? secondOutput : new AST([firstOutput.value, secondOutput.value], secondOutput.cursor);
			}
		};
	}

  /**
   * A function to simulate the Or operator.
   *
   * @param {function} firstAnalyse First parse function.
   * @param {function} secondAnalyse Second parse function.
   * @return {function} A function that takes the input string to parse.
   */
	static or(firstAnalyse, secondAnalyse) {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => {
			const firstOutput = firstAnalyse(input, cursor);
			if (firstOutput instanceof NotAsExpected && firstOutput.cursor === cursor) {
				return secondAnalyse(input, cursor);
			} else {
				return firstOutput;
			}
		};
	}

  /**
   * A function to simulate a chain of And operators.
   *
   * @param {Array} analyses Array of parse functions.
   * @return {function} A function that takes the input string to parse.
   */
	static chainOfAnd(analyses) {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => {
			const values = [];
			for (let i = 0; i < analyses.length; i++) {
				const output = analyses[i](input, cursor);
				if (output instanceof NotAsExpected) {
					return output;
				} else {
					values.push(output.value);
					cursor = output.cursor;
				}
			}
			return new AST(values, cursor);
		};
	}

  /**
   * A function to simulate a chain of Or operators.
   *
   * @param {Array} analyses Array of parse functions.
   * @return {function} A function that takes the input string to parse.
   */
	static chainOfOr(analyses) {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => {
			let chainOfOrError = new NotAsExpected("chainOfOr", -1);
			for (let i = 0; i < analyses.length; i++) {
				const output = analyses[i](input, cursor);
				if (output instanceof NotAsExpected && output.cursor === cursor) {
					if (output.cursor > chainOfOrError.cursor) {
						chainOfOrError = output;
					}
				} else {
					return output;
				}
			}
			return chainOfOrError;
		};
	}

  /**
   * A function to simulate a while loop.
   *
   * @param {Array} analyses Array of parse functions.
   * @param {boolean} checkFirst Determine whether to check the first iteration.
   * @return {function} A function that takes the input string to parse.
   */
	static while(analyse, checkFirst = false) {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => {
			const values = [];
			let output;
			if (checkFirst === true) {
				output = analyse(input, cursor);
				if (output instanceof NotAsExpected) {
					return output;
				}
				values.push(output.value);
				cursor = output.cursor;
			}
			while (!((output = analyse(input, cursor)) instanceof NotAsExpected)) {
				values.push(output.value);
				cursor = output.cursor;
			}
			if (output.cursor === cursor) {
				return new AST(values, cursor);
			} else {
				return output;
			}
		};
	}
}
