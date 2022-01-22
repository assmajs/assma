/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

import Transformer from "../src/transformer";

/**
 * A function to transform an abstract syntax tree to a virtual dom.
 *
 * @param {import('../types').AbstractSyntaxTree} ast An abstract syntax tree.
 * @return {import('../types').VirtualDomTree} A virtual dom tree.
 */
function transform(ast) {
	return Transformer.main(ast);
}

test("Transform an AST to a vDom tree", () => {
	const vdom = transform({
		"value": [
			[{
				"type": "nodeDataChildren",
				"value": ["<", [],
					["d", "i", "v"],
					[""], {
						"type": "attributes",
						"value": [
							[
								["c", "l", "a", "s", "s"], "=", ["{", ["s", "t", "a", "t", "e"], "}"],
								[]
							]
						]
					}, ">", [{
						"type": "nodeDataChildren",
						"value": ["<", [],
							["h", "1"],
							[], {
								"type": "attributes",
								"value": []
							}, ">", [{
								"type": "text",
								"value": ["T", "i", "t", "l", "e"]
							}], "</", ["h", "1"], ">"
						]
					}, {
						"type": "nodeDataChildren",
						"value": ["<", [],
							["p"],
							[""], {
								"type": "attributes",
								"value": [
									[
										["c", "o", "l", "o", "r"], "=", ["\"", ["b", "l", "u", "e"], "\""],
										[]
									]
								]
							}, ">", [{
								"type": "text",
								"value": ["T", "e", "x", "t"]
							}], "</", ["p"], ">"
						]
					}], "</", ["d", "i", "v"], ">"
				]
			}], "EndOfInput"
		],
		"cursor": 63
	});

	expect(vdom.type).toBeDefined();
	expect(vdom.type).toEqual("div");
	expect(vdom.key).toBeDefined();
	expect(vdom.key).toEqual(expect.stringContaining("div"));
	expect(vdom.attributes).toBeDefined();
	expect(vdom.attributes).toEqual(expect.arrayContaining([{
		"class": "state"
	}]));
	expect(vdom.children).toBeDefined();
	expect(vdom.children[0].type).toBeDefined();
	expect(vdom.children[0].type).toEqual("h1");
	expect(vdom.children[0].key).toBeDefined();
	expect(vdom.children[0].key).toEqual(expect.stringContaining("h1"));
	expect(vdom.children[0].attributes).toBeNull();
	expect(vdom.children[0].children).toBeDefined();
	expect(vdom.children[0].children).toEqual(expect.arrayContaining(["Title"]));
	expect(vdom.children[1].type).toBeDefined();
	expect(vdom.children[1].type).toEqual("p");
	expect(vdom.children[1].key).toBeDefined();
	expect(vdom.children[1].key).toEqual(expect.stringContaining("p"));
	expect(vdom.children[1].attributes).toBeDefined();
	expect(vdom.children[1].attributes).toEqual(expect.arrayContaining([{
		"color": "blue"
	}]));
	expect(vdom.children[1].children).toBeDefined();
	expect(vdom.children[1].children).toEqual(expect.arrayContaining(["Text"]));
});
