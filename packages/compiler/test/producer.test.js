/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

import Producer from "../src/producer";

/**
 * A function to parse input.
 *
 * @param {string} input Input string.
 * @return {import('../types').AbstractSyntaxTree} An abstract syntax tree.
 */
function parse(input) {
	return Producer.main(input);
}

test("Produce main", () => {
	expect(parse("<br />")).toEqual({
		"value": [
			[{
				"type": "node",
				"value": ["<", [],
					["b", "r"],
					[" "], "/>"
				]
			}], "EndOfInput"
		],
		"cursor": 6
	});
});
