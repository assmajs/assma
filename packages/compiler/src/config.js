/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

export default {
	/**
	 * @description
	 * In case of using the compiler with node.js and a production environment (compile file components) Or
	 * In case of using the compiler in runtime and console object is undefined
	 */
	silent: (process.env.ASSMA_ENV === "production") || (typeof console === "undefined")
};
