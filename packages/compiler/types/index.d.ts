/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/develop/LICENSE
 */

type Key = string | number | undefined;

type Value = Array<string | Alias | Array<Value>>;

export interface Alias {
	type: string;
	value: Value;
}

//
// Abstract Syntax Tree
// -----------------------------------
export interface AbstractSyntaxTree {
	value: Value;
	cursor: number;
}

//
// Assma Virtual DOM
// -----------------------------------
export interface VirtualDomTree {
	type: string | Function; // The string of the DOM node to create or Component constructor to render
	children: Array<VirtualDomTree | string> | null;
	attributes: any;
	key: Key;
}
