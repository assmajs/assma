/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

import {
	stringify,
	removeWs,
	generateKey,
	isAliasObject,
	isVirtualDomTreeObject,
	Constants
} from './util';

/**
 * This class provides methods to transform an AbstractSyntaxTree structure to a VirtualDomTree structure
 * that will be used as input to the diffing process.
 */
export default class Transformer {
	/**
	 * The main function of the transformer class.
	 *
	 * @param {import('../types').AbstractSyntaxTree} ast An abstract syntax tree.
	 * @return {import('../types').VirtualDomTree} A virtual dom tree.
	 */
	static main(ast) {
		var vdomNode = Transformer.transform(ast.value);
		return vdomNode;
	}

	/**
	 * A function to transform an abstract syntax tree to a virtual dom.
	 *
	 * @param {import('../types').AbstractSyntaxTree} ast An abstract syntax tree.
	 * @return {import('../types').VirtualDomTree} A virtual dom tree.
	 */
	static transform(ast) {
		var vdomNode = {};
		if (Array.isArray(ast)) {
			for (let i = 0; i < ast.length; i++) {
				vdomNode = Object.assign(vdomNode, Transformer.transform(ast[i]));
			}
			return vdomNode;
		} else if (isAliasObject(ast)) {
			const type = ast.type;
			if (type === Constants.NODE) {
				const value = ast.value;
				vdomNode.children = null;
				vdomNode.attributes = null;
				vdomNode.type = stringify(value[2]);
				vdomNode.key = generateKey(vdomNode.type);
			} else if (type === Constants.NODE_DATA) {
				const value = ast.value;
				vdomNode.children = null;
				vdomNode.type = stringify(value[2]);
				vdomNode.key = generateKey(vdomNode.type);
				const attributes = value[4].value;
				const attributesLength = attributes.length;
				if (attributesLength === 0) {
					vdomNode.attributes = null;
				} else {
					vdomNode.attributes = [];
					for (let i = 0; i < attributesLength; i++) {
						const pair = attributes[i];
						var attribute = {};
						attribute[pair[0].join('')] = pair[2][1].toString().split(',').join('');
						vdomNode.attributes.push(attribute);
					}
					if (vdomNode.attributes.length === 0) {
						vdomNode.attributes = null;
					}
				}
			} else if (type === Constants.NODE_DATA_CHILDREN) {
				const value = ast.value;
				vdomNode.type = stringify(value[2]);
				vdomNode.key = generateKey(vdomNode.type);
				const attributes = value[4].value;
				const attributesLength = attributes.length;
				if (attributesLength === 0) {
					vdomNode.attributes = null;
				} else {
					vdomNode.attributes = [];
					for (let i = 0; i < attributesLength; i++) {
						const pair = attributes[i];
						const attribute = {};
						attribute[stringify(pair[0])] = stringify(pair[2][1].toString().split(','));
						vdomNode.attributes.push(attribute);
					}
					if (vdomNode.attributes.length === 0) {
						vdomNode.attributes = null;
					}
				}
				const children = value[6];
				const childrenLength = children.length;
				if (childrenLength === 0) {
					vdomNode.children = null;
				} else {
					vdomNode.children = [];
					for (let i = 0; i < childrenLength; i++) {
						const child = children[i];
						const childGenerated = Transformer.transform(child);
						if (isVirtualDomTreeObject(childGenerated) || typeof childGenerated == "string") {
							vdomNode.children.push(childGenerated);
						}
					}
					if (vdomNode.children.length === 0) {
						vdomNode.children = null;
					}
				}
			} else if (type === Constants.TEXT) {
				const text = ast.value;
				const textNoWhitespace = removeWs(stringify(text));
				if (textNoWhitespace != "") {
					return textNoWhitespace;
				}
			} else if (type === Constants.INTERPOLATION) {
				const interpolation = ast.value[1].value;
				const interpolationNoWhitespace = removeWs(stringify(interpolation));
				if (interpolationNoWhitespace != "") {
					return Constants.BRACKET_OPEN + interpolationNoWhitespace + Constants.BRACKET_CLOSE;
				}
			}
			return vdomNode;
		}
	}
}
