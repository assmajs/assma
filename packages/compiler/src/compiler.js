/**
 * @license
 * Copyright Assma All Rights Reserved.
 *
 * Use of this source code is governed by an MIT license that can be
 * found in the LICENSE file at https://github.com/assmajs/assma/blob/master/LICENSE
 */

/**
 * @module
 * @description
 * Entry point from which you should import all public compiler APIs.
 */
export * from './analyser';
export * from './producer';
export * from './transformer';
export * from './compile';
export { default as config } from './config';

// This file only reexports content of the `src` folder. Keep it that way.
