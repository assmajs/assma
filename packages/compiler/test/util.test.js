/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

import {
	isComponentType,
	stringify,
	removeWs,
	generateKey,
	isAliasObject,
	isVirtualDomTreeObject,
	error
} from "../src/util";

test("Assert that is a component (nominal)", () => {
	expect(isComponentType("App")).toEqual(true);
});

test("Assert that is a component (alternative)", () => {
	expect(isComponentType("div")).toEqual(false);
});

test("Stringify an array", () => {
	expect(stringify(["div", "span", "h1", "h2", "h3", "h4"])).toEqual("divspanh1h2h3h4");
});

test("Remove whitespace from string", () => {
	expect(removeWs("div \n")).toEqual("div");
});

test("Generate key for element", () => {
	expect(generateKey("div")).toEqual(expect.stringContaining("div"));
});

test("Assert that is an alias object (nominal)", () => {
	expect(isAliasObject({
		"type": "attributes",
		"value": []
	})).toEqual(true);
});

test("Assert that is an alias object (alternative)", () => {
	expect(isAliasObject({
		"type": "h1",
		"key": "h11640516529582",
		"attributes": null,
		"children": ["Title"]
	})).toEqual(false);
});

test("Assert that is a virtual dom object (nominal)", () => {
	expect(isVirtualDomTreeObject({
		"type": "h1",
		"key": "h11640516529582",
		"attributes": null,
		"children": ["Title"]
	})).toEqual(true);
});

test("Assert that is a virtual dom object (alternative)", () => {
	expect(isVirtualDomTreeObject({
		"type": "attributes",
		"value": []
	})).toEqual(false);
});

test("Handle error", () => {
	expect(error("just for testing purpose")).toBeUndefined();
});
