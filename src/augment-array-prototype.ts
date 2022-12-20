/*------------------------------------- THIRD-PARTY MODULES --------------------------------------*/
// prettier-ignore
import {last, last2, last3, lastN, firstN, secondLast, thirdLast, first, first2, first3, second, third, compact, arrayRemove, removeDuplicates as rmDuplicates} from 'mad-utils/lib/shared';

import {orderBy, compare as natCompare} from 'natural-orderby';

/*------------------------------------------- LOGGING --------------------------------------------*/
import {logFactory, Styles} from 'mad-logs/lib/shared';
const log = logFactory(`augment-array-prototype.ts`, Styles.angryBird);

/*--------------------------------------- TYPE DEFINITIONS ---------------------------------------*/
export type ArrayGetter<T = any> = T[];
export type ArrayItemGetter<T = any> = T | undefined;

type MultiDimensionalArray<T> = (T | (T | T[])[])[];

type FalsyType = 'allFalsy' | 'nullUndef' | 'keep0' | 'keepStr';

declare global {
    interface Array<T> {
        /**
         * Get first item in array
         */
        first: ArrayItemGetter<T>;
        /**
         * Get second item in array
         */
        second: ArrayItemGetter<T>;
        /**
         * Get third item in array
         */
        third: ArrayItemGetter<T>;
        /**
         * Get last item in array
         */
        last: ArrayItemGetter<T>;
        /**
         * Get second-last item in array
         */
        secondLast: ArrayItemGetter<T>;
        /**
         * Get third-last item in array
         */
        thirdLast: ArrayItemGetter<T>;
        /**
         * Get first 2 items in array
         */
        first2: [T, T];
        /**
         * Get first 3 items in array
         */
        first3: [T, T, T];
        /**
         * Get first 4 items in array
         */
        first4: [T, T, T, T];
        /**
         * Get last 2 items in array
         */
        last2: [T, T];
        /**
         * Get last 3 items in array
         */
        last3: [T, T, T];
        /**
         * Get last 4 items in array
         */
        last4: [T, T, T, T];
        /**
         * Get all but last item in array
         */
        init: ArrayGetter<T>;
        /**
         * Get all but first item in array
         */
        tail: ArrayGetter<T>;

        /**
         * Remove falsy values from the array
         * By default removes all falsy val types, but can select a specific subset to rm w 2nd arg
         * @param {string} falsyTypes: 'allFalsy'  [DEFAULT] Remove all falsy values
         *                             'nullUndef' Remove only null & undefined values
         *                             'keep0'     Remove all falsy values except 0
         *                             'keepStr'   Remove all falsy values except ''
         * @return {Array} Array with set falsy val types removed (rms all falsy vals by default)
         */
        rmFalsyVals: <T = any>(this: T[], falsyTypes?: FalsyType) => T[];

        /**
         * Returns true if array is empty
         */
        isEmpty: <T = any>(this: T[]) => boolean;

        /**
         * Return first truthy value returned from predicate
         *
         * Similar to find, but returns whatever value you want from the
         * predicate, rather than the found value itself
         *
         * Returns null if no truthy value returned by predicate for any values
         * of array.
         *
         * Params of predicate:
         * @param {number} item Current item in predicate.
         * @param {number} idx Index of current item in predicate.
         */
        returnFirstTruthy: <R>(predicate: (item: T, idx?: number) => R) => R;

        /**
         * Recursively flatten an array e.g.: [1, [2, 3, [4, 5]]].flattenDeep() => [1, 2, 3, 4, 5]
         */
        flattenDeep: <T>(this: MultiDimensionalArray<T>) => T[];

        /**
         * Recursively flatten an array e.g.: [1, [2, 3, [4, 5]]].deepFlatten() => [1, 2, 3, 4, 5]
         */
        deepFlatten: <T>(this: MultiDimensionalArray<T>) => T[];

        /**
         * Insert [valToInsert] at position [index].
         * MUTATIVE
         *
         * Example:
         *     ['a', 'b', 'd'].insertAt(3, 'c');
         *     // => ['a', 'b', 'c', 'd']
         */
        insertAt: <T>(this: T[], index: number, valToInsert: T) => T[];

        /**
         * Move item at index [srcIdx] to index [destIdx], shifting all other
         * values forwards in the process.
         * MUTATIVE
         *
         * Example:
         *     ['a', 'b', 'c', 'd'].move(3, 0);
         *     // => ['d', 'a', 'b', 'c']
         */
        move: <T>(this: T[], srcIdx: number, destIdx: number) => T[];

        /**
         * Mutatively removes all matches of given value from array, or if
         * predicate given, all items where predicate returned true
         *
         * Return new array, or array of deleted elements if returnRemovals=true
         *
         * Example 1:
         *     const arr = ['a', 'b', 'c', 'd', 'b'];
         *     arr.rmMatchesMutative('b');
         *     // => ['a', 'c', 'd']
         *
         * Example 2:
         *     const arr = ['a', 'b', 'c', 'd', 'b'];
         *     arr.rmMatchesMutative('b', true); // => ['b', 'b']
         *     console.log(arr) // => ['a', 'c', 'd']
         *
         * Example 3:
         *     const arr = [-5, 0, 3, 3, 3, 8, 12, 15];
         *     arr.rmMatchesMutative((num => num > 10), true); // => [12, 15]
         *     console.log(arr) // => [-5, 0, 3, 3, 3, 8]
         *
         * @param {any|Function} needle Item to remove from array (remove ALL matches), or
         *                              predicate where item removed if this returns true
         * @param {boolean} returnRemovals If true, return removed elements instead of
         *                                 new array
         * @return {Array} array from haystack property with all "needle"s (or
         *                 predicate matches) returned, or if returnRemovals is
         *                 true, array of all removed elements
         */
        rmMatchesMutative: <T>(
            this: T[],
            predicate: ((item: T) => boolean) | T,
            returnRemovals?: boolean
        ) => T[];

        /**
         * Remove duplicate items from the array.
         */
        removeDuplicates: <T>(this: T[]) => T[];

        /**
         * Empty the array, and return the eliminated values.
         * MUTATIVE
         */
        emptyArray: <T>(this: T[]) => T[];

        /**
         * Sort array in numerical order.
         * Mutative.
         *
         * Example:
         *     [1, 10, 20, 2, 50, 6, 4, 22, 33, 80, 14, 8].sortByNumber()
         *     // => 1, 2, 4, 6, 8, 10, 14, 20, 22, 33, 50, 80]
         */
        sortByNumber: <T>(this: T[]) => T[];

        /**
         * Natural sort - sorts strings with full numbers accounted for.
         * Defaults to ascending search ('asc').
         * Mutative.
         *
         * Example:
         *     [1, 10, 20, 2, 50, 6, 4, 22, 33, 80, 14, 8].sortNatural()
         *     // => [1, 2, 4, 6, 8, 10, 14, 20, 22, 33, 50, 80]
         *
         * Example 2:
         *     [1, 10, 20, 2, 50, 6, 4, 22, 33, 80, 14, 8].sortNatural('desc')
         *     // => [80, 50, 33, 22, 20, 14, 10, 8, 6, 4, 2, 1]
         */
        sortNatural: <T>(this: T[], order?: 'asc' | 'desc') => T[];

        /**
         * Shallow clone an array.
         *
         * Any objects contained in the original array will still be pointed to
         * by the clone, but array operations (e.g. popping, items reversing) will
         * only affect the clone, and any primitives will be duplicated.
         *
         * @return {Array<T>} Duplicate of the original array.
         */
        clone: <T>(this: T[]) => T[];

        /**
         *  Group an array into clusters of 2-item arrays.
         *  Example: [1].chunkPairs() => [[1]]
         */
        chunkPairs<T>(this: [T]): [[T]];
        /**
         *  Group an array into clusters of 2-item arrays.
         *  Example: [1, 2].chunkPairs() => [[1, 2]]
         */
        chunkPairs<T>(this: [T, T]): [[T, T]];
        /**
         *  Group an array into clusters of 2-item arrays.
         *  Example: [1, 2, 3].chunkPairs() => [[1, 2], [3]]
         */
        chunkPairs<T>(this: [T, T, T]): [[T, T], [T]];

        /**
         *  Group an array into clusters of 2-item arrays.
         *  Example: [1, 2, 3, 4, 5, 6].chunkPairs() => [[1, 2], [3, 4], [5, 6]]
         *  Example: [].chunkPairs() => []
         */
        chunkPairs<T>(this: T[]): Array<[T, T]>;
    }
}

/*==================================== AUGMENTATION FUNCTIONS ====================================*/
/*
 * Don't re-apply augmentations if they're already present.
 */
if (
    !('first' in Array.prototype) ||
    !('last' in Array.prototype) ||
    !('tail' in Array.prototype) ||
    !Array.prototype?.sortByNumber ||
    !Array.prototype?.move
) {
    /*--------------------------------------- HELPERS ----------------------------------------*/
    /**
     * Comparison algorithm
     */
    const sameValueZero = (x: number, y: number) =>
        x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));

    const standardNewPropKeys = {configurable: false, enumerable: false, writable: true};

    /*---------------------------------- GET FROM POSITION -----------------------------------*/
    /**
     * Get first item in array
     */
    Reflect.defineProperty(Array.prototype, `first`, {
        get: function firstAugmented<T = any>(this: T[]): T {
            return this[0];
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get second item in array
     */
    Reflect.defineProperty(Array.prototype, `second`, {
        get: function secondAugmented<T = any>(this: T[]): T {
            return second(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get third item in array.
     */
    Reflect.defineProperty(Array.prototype, `third`, {
        get: function thirdAugmented<T = any>(this: T[]): T {
            return third(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get last item in array
     */
    Reflect.defineProperty(Array.prototype, `last`, {
        get: function lastAugmented<T = any>(this: T[]): T {
            return last(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get second-last item in array
     */
    Reflect.defineProperty(Array.prototype, `secondLast`, {
        get: function secondLastAugmented<T = any>(this: T[]): T {
            return secondLast(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get second-last item in array
     */
    Reflect.defineProperty(Array.prototype, `thirdLast`, {
        get: function thirdLastAugmented<T = any>(this: T[]): T {
            return thirdLast(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get first 2 items in array
     */
    Reflect.defineProperty(Array.prototype, `first2`, {
        get: function first2Augmented<T = any>(this: T[]): T[] {
            return first2(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get first 3 items in array
     */
    Reflect.defineProperty(Array.prototype, `first3`, {
        get: function first3Augmented<T = any>(this: T[]): T[] {
            return first3(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get first 4 items in array
     */
    Reflect.defineProperty(Array.prototype, `first4`, {
        get: function first4Augmented<T = any>(this: T[]): T[] {
            return firstN(this, 4);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get last 2 items in array
     */
    Reflect.defineProperty(Array.prototype, `last2`, {
        get: function last2Augmented<T = any>(this: T[]): T[] {
            return last2(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get last 3 items in array
     */
    Reflect.defineProperty(Array.prototype, `last3`, {
        get: function last3Augmented<T = any>(this: T[]): T[] {
            return last3(this);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get last 4 items in array
     */
    Reflect.defineProperty(Array.prototype, `last4`, {
        get: function last4Augmented<T = any>(this: T[]): T[] {
            return lastN(this, 4);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get all but last item in array
     */
    Reflect.defineProperty(Array.prototype, `init`, {
        get: function initAugmented<T = any>(this: T[]): T[] {
            return this.slice(0, -1);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get all but first item in array
     */
    Reflect.defineProperty(Array.prototype, `tail`, {
        get: function tailAugmented<T = any>(this: T[]): T[] {
            return this.slice(1);
        },
        configurable: false,
        enumerable: false,
    });

    /**
     * Get new array containing all non-falsy vals from array
     */
    Reflect.defineProperty(Array.prototype, 'rmFalsyVals', {
        value: function rmFalsyVals<T = any>(this: T[], falsyType: FalsyType = 'allFalsy'): T[] {
            return compact(this, falsyType);
        },
        configurable: false,
        enumerable: false,
    });

    /*--------------------------------- ARRAY INFO POLYFILLS ---------------------------------*/
    /**
     * Return true if current array is not empty
     */
    Reflect.defineProperty(Array.prototype, `isEmpty`, {
        value: function emptyAugmented<T = any>(this: T[]): boolean {
            return !this.last;
        },
        configurable: false,
        enumerable: false,
    });

    /*---------------------------------- flatMap POLYFILLS -----------------------------------*/
    Reflect.defineProperty(Array.prototype, `flattenDeep`, {
        value: function flattenDeep<T>(this: T[]) {
            return Array.isArray(this)
                ? this.reduce(
                      (acc, val) => acc.concat(Array.isArray(val) ? val.flattenDeep() : val),
                      []
                  )
                : this;
        },
        configurable: false,
        enumerable: false,
    });

    Reflect.defineProperty(Array.prototype, `deepFlatten`, {
        configurable: false,
        enumerable: false,
        value: Array.prototype.flattenDeep,
    });

    Reflect.defineProperty(Array.prototype, `rmMatchesMutative`, {
        value: function rmMatchesMutative<T>(
            this: T[],
            itemToRemove: T | ((item: T) => boolean),
            returnRemovals = false
        ) {
            return arrayRemove(this, itemToRemove, returnRemovals);
        },
        ...standardNewPropKeys,
    });

    Reflect.defineProperty(Array.prototype, `emptyArray`, {
        value: function emptyArray<T>(this: T[]) {
            const dup = this.slice();
            while (this.length > 0) this.pop();
            return dup;
        },
        ...standardNewPropKeys,
    });

    Reflect.defineProperty(Array.prototype, `insertAt`, {
        value: function insertAt<T>(this: T[], index: number, valToInsert: T) {
            this.splice(index, 0, valToInsert);
            return this;
        },
        ...standardNewPropKeys,
    });

    Reflect.defineProperty(Array.prototype, `move`, {
        value: function move<T>(this: T[], srcIdx: number, destIdx: number) {
            const srcEl = this.splice(srcIdx, 1)[0];
            this.splice(destIdx, 0, srcEl);
            return this;
        },
        ...standardNewPropKeys,
    });

    Reflect.defineProperty(Array.prototype, `returnFirstTruthy`, {
        value: function returnFirstTruthy<T>(
            this: T[],
            predicate: (item: T, idx?: number) => boolean
        ) {
            let count = 0;
            for (const item of this) {
                const val = predicate(item, count);
                if (val) return val;
                count++;
            }
            return null;
        },
        configurable: false,
        enumerable: false,
    });

    Reflect.defineProperty(Array.prototype, `sortByNumber`, {
        value: function sortNum<T>(this: T[]) {
            this.sort(natCompare({order: 'asc'}));
            return this;
        },
        ...standardNewPropKeys,
    });

    Reflect.defineProperty(Array.prototype, `sortNatural`, {
        value: function sortNatural<T>(this: T[], order: 'asc' | 'desc' = 'asc') {
            this.sort(natCompare({order}));
            return this;
        },
        ...standardNewPropKeys,
    });

    Reflect.defineProperty(Array.prototype, `clone`, {
        value: function clone<T>(this: T[]) {
            return this.slice(0);
        },
        configurable: false,
        enumerable: false,
    });

    Reflect.defineProperty(Array.prototype, `chunkPairs`, {
        value: function chunkPairs<T>(this: T[]) {
            const len = this.length;
            if (len === 0) return [];
            if (len <= 2) return [this];

            const arr = [];
            for (let idx = 0; idx < len; idx = idx + 2) {
                const val1 = this[idx];
                const val2 = this[idx + 1];
                if (idx >= len - 1) arr.push([this[idx]]);
                else arr.push([this[idx], this[idx + 1]]);
            }
            return arr;
        },
    });

    Reflect.defineProperty(Array.prototype, `removeDuplicates`, {
        value: function removeDuplicates<T>(this: T[]) {
            return rmDuplicates(this);
        },
    });

    /*--------------------------------------- LOG SUCCESS ----------------------------------------*/
    log.verbose(
        `Successfully augmented Array.prototype. Array.prototype keys:`,
        Object.keys(Array.prototype)
    );
}
