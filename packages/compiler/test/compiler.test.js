/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/develop/LICENSE
 */

import { compile } from "../src/compile";

test("Compile input string to vDom tree", () => {
	const input = `
			<div>
					{this.state.active}
					<img src="assets/logo.png" />
					<h1>Hello World</h1>
					<br />
					<Foo>
							bar
					</Foo>
					<br />
					<button onClick={this.onClick}>Toggle</button>
			</div>
	`;

	expect(compile(input)).toEqual({
		"type": "div",
		"key": expect.stringContaining("div"),
		"attributes": null,
		"children": ["{this.state.active}", {
			"children": null,
			"type": "img",
			"key": expect.stringContaining("img"),
			"attributes": [{
				"src": "assets/logo.png"
			}]
		}, {
			"type": "h1",
			"key": expect.stringContaining("h1"),
			"attributes": null,
			"children": ["Hello World"]
		}, {
			"children": null,
			"attributes": null,
			"type": "br",
			"key": expect.stringContaining("br")
		}, {
			"type": "Foo",
			"key": expect.stringContaining("Foo"),
			"attributes": null,
			"children": ["bar"]
		}, {
			"children": null,
			"attributes": null,
			"type": "br",
			"key": expect.stringContaining("br")
		}, {
			"type": "button",
			"key": expect.stringContaining("button"),
			"attributes": [{
				"onClick": "this.onClick"
			}],
			"children": ["Toggle"]
		}]
	});
});
