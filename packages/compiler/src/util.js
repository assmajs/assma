/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/develop/LICENSE
 */

import config from './config';

export class AST {
	/**
	 * A constructor for AST class.
	 *
	 * @param {string} input Input string.
	 * @param {int} cursor Cursor.
	 */
	constructor(value, cursor) {
		this.value = value;
		this.cursor = cursor;
	}
}

export class ProducerException {
	/**
	 * A constructor for ProducerException class.
	 *
	 * @param {string} message Message of the exception.
	 */
	constructor(message) {
		this.message = message;
		this.type = "ProducerException";
	}
}

export class NotAsExpected {
	/**
	 * A constructor for NotAsExpected class.
	 *
	 * @param {string} expected Expected value.
	 * @param {int} cursor Cursor.
	 */
	constructor(expected, cursor) {
		this.expected = expected;
		this.cursor = cursor;
	}
}

export const Constants = {
	"INTERPOLATION": "interpolation",
	"ATTRIBUTES": "attributes",
	"NODE": "node",
	"NODE_DATA": "nodeData",
	"NODE_DATA_CHILDREN": "nodeDataChildren",
	"COMMENT": "comment",
	"COMMENT_BEGIN": "<--",
	"COMMENT_END": "-->",
	"SPACE": " ",
	"TAB": "\t",
	"RETURN": "\n",
	"TEXT": "text",
	"BACKSLASH": "\\",
	"SLASH": "/",
	"BRACKET_OPEN": "{",
	"BRACKET_CLOSE": "}",
	"BRACKET_SQUARE_OPEN": "[",
	"BRACKET_SQUARE_CLOSE": "]",
	"LESS_THAN_SIGN": "<",
	"GREATER_THAN_SIGN": ">",
	"EQUAL_SIGN": "=",
	"PARENTHESIS_LEFT": "(",
	"PARENTHESIS_RIGHT": ")",
	"QUOTATION": "\"",
	"APOSTROPHE": "'",
	"GRAVE_ACCENT": "`",
	"ASTERISK": "*",
	"HASH": "#",
	"REGEX_IDENTIFIER": /[$\w.]/
};
Object.freeze(Constants);

export const isComponentType = type => tagNames.indexOf(type) == -1;

export const stringify = array => array.join("");

export const removeWs = string => string.trim().replace(/(\r\n|\n|\r|\t)/gm, "");

export const generateKey = string => string + Date.now();

export const isAliasObject = object => object != undefined && object.hasOwnProperty("type") && object.hasOwnProperty("value");

export const isVirtualDomTreeObject = object => object != undefined && object.hasOwnProperty("type") && object.hasOwnProperty("key");

export const reservedKeywords = ["NaN", "false", "in", "null", "this", "true", "typeof", "undefined"];

export const tagNames = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "math", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rbc", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "text", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];

/**
 * A function to show error.
 *
 * @param {string} message Message of the error.
 * @return {void}
 */
export const error = message => {
	if (config.silent === false) {
		console.error("[Assma] ERROR: " + message);
	}
};
