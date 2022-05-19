/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/develop/LICENSE
 */

import { Constants } from './util';
import analyse from './analyser';

/**
 * This class represents the formal grammar of Assma's view language which is defined as a
 * set of production rules for strings.
 */
export default class Producer {
  /**
   * The main function of the producer class.
   *
   * @param {string} input Input string.
   * @param {int} cursor A point from where to start parsing.
   * @return {function} A function that takes the input string to parse.
   */
	static main(input, cursor = 0) {
		return analyse.and(Producer.language(), analyse.endOfInput())(input, cursor);
	}

  /**
   * A function to produce the language.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static language() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.while(analyse.chainOfOr([
			Producer.comment(),
			analyse.try(Producer.node()),
			analyse.try(Producer.nodeData()),
			analyse.try(Producer.nodeDataChildren()),
			analyse.while(analyse.not([Constants.SLASH, Constants.HASH, Constants.QUOTATION, Constants.APOSTROPHE, Constants.GRAVE_ACCENT, Constants.PARENTHESIS_LEFT, Constants.PARENTHESIS_RIGHT, Constants.BRACKET_SQUARE_OPEN, Constants.BRACKET_SQUARE_CLOSE, Constants.BRACKET_OPEN, Constants.BRACKET_CLOSE, Constants.LESS_THAN_SIGN]), true)
		]))(input, cursor);
	}

  /**
   * A function to produce a node.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static node() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.alias(Constants.NODE, analyse.chainOfAnd([
			analyse.char(Constants.LESS_THAN_SIGN),
			Producer.separator(),
			Producer.value(),
			Producer.separator(),
			analyse.string(Constants.SLASH + Constants.GREATER_THAN_SIGN)
		]))(input, cursor);
	}

  /**
   * A function to produce a node with attributes.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static nodeData() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.alias(Constants.NODE_DATA, analyse.chainOfAnd([
			analyse.char(Constants.LESS_THAN_SIGN),
			Producer.separator(),
			Producer.value(),
			Producer.separator(),
			analyse.or(analyse.try(Producer.attributes()), Producer.value()),
			analyse.string(Constants.SLASH + Constants.GREATER_THAN_SIGN)
		]))(input, cursor);
	}

  /**
   * A function to produce a node with attributes and children.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static nodeDataChildren() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.alias(Constants.NODE_DATA_CHILDREN, analyse.chainOfAnd([
			analyse.char(Constants.LESS_THAN_SIGN),
			Producer.separator(),
			Producer.value(),
			Producer.separator(),
			Producer.attributes(),
			analyse.char(Constants.GREATER_THAN_SIGN),
			analyse.while(analyse.chainOfOr([
				analyse.try(Producer.node()),
				analyse.try(Producer.nodeData()),
				analyse.try(Producer.nodeDataChildren()),
				Producer.text(),
				Producer.interpolation()
			])),
			analyse.string(Constants.LESS_THAN_SIGN + Constants.SLASH),
			analyse.while(analyse.not([Constants.GREATER_THAN_SIGN])),
			analyse.char(Constants.GREATER_THAN_SIGN)
		]))(input, cursor);
	}

  /**
   * A function to produce attributes.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static attributes() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.alias(Constants.ATTRIBUTES, analyse.while(
			analyse.chainOfAnd([
				Producer.value(),
				analyse.char(Constants.EQUAL_SIGN),
				Producer.value(),
				Producer.separator()
			])
		))(input, cursor);
	}

  /**
   * A function to produce a value.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static value() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.chainOfOr([
			analyse.while(analyse.charRegEx(Constants.REGEX_IDENTIFIER), true),
			analyse.chainOfAnd([
				analyse.char(Constants.QUOTATION),
				analyse.while(analyse.or(
					Producer.escape(),
					analyse.not([Constants.QUOTATION])
				)),
				analyse.char(Constants.QUOTATION)
			]),
			analyse.chainOfAnd([
				analyse.char(Constants.APOSTROPHE),
				analyse.while(analyse.or(
					Producer.escape(),
					analyse.not([Constants.APOSTROPHE])
				)),
				analyse.char(Constants.APOSTROPHE)
			]),
			analyse.chainOfAnd([
				analyse.char(Constants.GRAVE_ACCENT),
				analyse.while(analyse.or(
					Producer.escape(),
					analyse.not([Constants.GRAVE_ACCENT])
				)),
				analyse.char(Constants.GRAVE_ACCENT)
			]),
			analyse.chainOfAnd([
				analyse.char(Constants.PARENTHESIS_LEFT),
				analyse.while(analyse.or(
					Producer.escape(),
					analyse.not([Constants.PARENTHESIS_LEFT, Constants.PARENTHESIS_RIGHT])
				)),
				analyse.char(Constants.PARENTHESIS_RIGHT)
			]),
			analyse.chainOfAnd([
				analyse.char(Constants.BRACKET_SQUARE_OPEN),
				analyse.while(analyse.or(
					Producer.escape(),
					analyse.not([Constants.BRACKET_SQUARE_OPEN, Constants.BRACKET_SQUARE_CLOSE])
				)),
				analyse.char(Constants.BRACKET_SQUARE_CLOSE)
			]),
			analyse.chainOfAnd([
				analyse.char(Constants.BRACKET_OPEN),
				analyse.while(analyse.or(
					Producer.escape(),
					analyse.not([Constants.BRACKET_OPEN, Constants.BRACKET_CLOSE])
				)),
				analyse.char(Constants.BRACKET_CLOSE)
			])
		])(input, cursor);
	}

  /**
   * A function to produce an interpolation.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static interpolation() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.alias(Constants.INTERPOLATION, analyse.chainOfAnd([
			analyse.char(Constants.BRACKET_OPEN),
			Producer.text(),
			analyse.char(Constants.BRACKET_CLOSE)
		]))(input, cursor);
	}

  /**
   * A function to produce a text.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static text() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.alias(Constants.TEXT, analyse.while(
			analyse.or(
				Producer.escape(),
				analyse.not([Constants.BRACKET_OPEN, Constants.LESS_THAN_SIGN, Constants.BRACKET_CLOSE])
			), true))(input, cursor);
	}

  /**
   * A function to produce a separator.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static separator() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.while(analyse.or(
			analyse.chainOfOr([
				analyse.char(Constants.SPACE),
				analyse.char(Constants.TAB),
				analyse.char(Constants.RETURN)
			]),
			Producer.comment()
		))(input, cursor);
	}

  /**
   * A function to produce a comment.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static comment() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.alias(Constants.COMMENT, analyse.chainOfAnd([
			analyse.string(Constants.COMMENT_BEGIN),
			analyse.while(
				analyse.or(
					Producer.escape(),
					analyse.not([Constants.COMMENT_BEGIN, Constants.COMMENT_END])
				)
			),
			analyse.string(Constants.COMMENT_END)
		]))(input, cursor);
	}

  /**
   * A function to produce an escaped character.
   *
   * @return {function} A function that takes the input string to parse.
   */
	static escape() {
    /**
     * @param {string} input Input string.
     * @param {int} cursor A point from where to start parsing.
     * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
     */
		return (input, cursor) => analyse.and(analyse.char(Constants.BACKSLASH), analyse.notEndYet())(input, cursor);
	}
}
