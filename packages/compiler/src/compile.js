/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

import Producer from "./producer";
import Transformer from "./transformer";

/**
 * A function to compile input into a virtual dom tree.
 *
 * @param {string} input Input string.
 * @return {import('../types').VirtualDomTree} A virtual dom tree.
 */
export const compile = input => {
	const ast = new parse(input);
	const vnode = new generate(ast);
	return vnode;
};

/**
 * A function to parse input.
 *
 * @param {string} input Input string.
 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
 */
function parse(input) {
	return Producer.main(input);
}

/**
 * A function to generate a virtual dom.
 *
 * @param {import('../types').AbstractSyntaxTree} ast An abstract syntax tree.
 * @return {import('../types').VirtualDomTree} A virtual dom tree.
 */
function generate(ast) {
	return Transformer.main(ast);
}
