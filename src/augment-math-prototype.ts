/*--------------------------------------- TYPE DEFINITIONS ---------------------------------------*/
type RoundDecimals = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

/*------------------------------------------- LOGGING --------------------------------------------*/
import {logFactory, Styles} from 'mad-logs/lib/shared';
const log = logFactory(`augment-string-prototype.ts`, Styles.angryBird);

/*---------------------------------- TYPE DECLARATIONS (GLOBAL) ----------------------------------*/
declare global {
    interface Math {
        /**
         * Convert any number from 0 to 255 into a hexadecimal string e.g. `D9`.
         * @param {string|number} rgb Number or number string between 0 and 255.
         * @return {string} In this format: `09`, `A4`, `1F`, `FF`
         */
        rgbToHex: (rgb: string | number) => string;

        /**
         * Round [val] to given number of decimal places ([decimals]), or 0 if none given.
         * Tolerates number strings if they can be parsed to numbers.
         *
         * Examples: roundTo(1.123111, 3); // => 1.123
         *           roundTo(0.199999, 1); // => 0.2
         *           roundTo('1.199999');  // => 1
         */
        roundTo: (val: number | string, decimals?: RoundDecimals) => number;

        /**
         * Floor [val] to given number of decimal places ([decimals]), or 0 if none given.
         * Tolerates number strings if they can be parsed to numbers.
         *
         * Example: floorTo(1.123999, 3); // => 1.123
         */
        floorTo: (val: number | string, decimals?: RoundDecimals) => number;

        /**
         * Ceil [val] to given number of decimal places ([decimals]), or 0 if none given.
         * Tolerates number strings if they can be parsed to numbers.
         *
         * Example: ceilTo(1.123111, 3); // => 1.123
         */
        ceilTo: (val: number | string, decimals?: RoundDecimals) => number;

        /**
         * Get the lesserOf of 2 numbers (or return the equal val if they're the same). e.g.:
         *     lesserOf(-12, 5) // => -12
         *     lesserOf(7, 15)  // => 7
         *     lesserOf(6, 6)   // => 6
         */
        lesserOf: (val1: number, val2: number) => number;

        /**
         * Get the greaterOf of 2 numbers (or return the equal val if they're the same). e.g.:
         *     greaterOf(-12, 5) // => 5
         *     greaterOf(7, 15)  // => 15
         *     greaterOf(6, 6)   // => 6
         */
        greaterOf: (val1: number, val2: number) => number;

        /**
         * Get the distance between 2 numbers (1D). e.g.:
         *     distance(1, 6)   // => 5
         *     distance(7, -3)  // => 10
         *     distance(10, 10) // => 0
         */
        distance: (val1: number, val2: number) => number;

        /**
         * Limit [val] to a number between given values [min] and [max].
         * Technically allows reversing min and max.
         *
         * Example:
         *     clampNum(1, 5, 10); // => 5
         *     clampNum(7, 5, 10); // => 7
         *     clampNum(12, 5, 10); // => 10
         *     clampNum(-7, 5, -3); // => -3
         */
        clampNum: (val: number, min: number, max: number) => number;

        /**
         * Build a string containing a set of ranges from the given array and/or sets.
         *
         * Example:
         *     buildRangeString(this.viewer.selectedAtoms({elem: element}), this.store.manualHighlightAtomsSet)
         *     // => "1-7, 10, 11, 15, 17, 22-47, 78"
         */
        buildRangeString: (arr1: number[] | Set<number>, arr2?: number[] | Set<number>) => string;

        /**
         * Convert the given number of degrees to radians.
         * @param {number} degrees to convert to radians
         */
        degreesToRadians: (degrees: number) => number;

        /**
         * Convert the given radian value to degrees
         * @param {number} radians to convert to degrees
         */
        radiansToDegrees: (radians: number) => number;

        /**
         * Get random integer between the 2 given values, inclusively.
         * e.g. if getRandomInt(1, 5) is run, this is the list of possible values it could emit:
         *     [1, 2, 3, 4, 5]
         *
         * @param {number} min The lowest possible integer it's allowed to generate.
         * @param {number} max The highest possible integer it's allowed to generate.
         *
         * @return {number} A random integer between the given min and max values.
         */
        getRandomInt: (min: number, max: number) => number;

        /**
         * Get the cross product of two 3D vectors.
         *
         * @param {[number, number, number]} vector1 First vector to use in cross-product calculation.
         * @param {[number, number, number]} vector2 Second vector to use in cross-product calculation.
         *
         * @return {[number, number, number]} Cross product of vector1 & vector2 (result is another vector).
         */
        crossProduct: (
            vector1: [number, number, number],
            vector2: [number, number, number]
        ) => [number, number, number];

        /**
         * Get the dot product of two vectors.
         *
         * @param {number[]} vector1 First vector in the dot product.
         * @param {number[]} vector2 Second vector in the dot product.
         *
         * @return {number} Dot product of the 2 vectors.
         */
        dotProduct: (vector1: number[], vector2: number[]) => number;

        /**
         * Get the dihedral angle between four 3D coordinates (e.g. atom positions).
         *
         * @param {[number, number, number]} coord1 First 3D coordinate (e.g. atom).
         * @param {[number, number, number]} coord2 Second 3D coordinate (e.g. atom).
         * @param {[number, number, number]} coord3 Third 3D coordinate (e.g. atom).
         * @param {[number, number, number]} coord4 Fourth 3D coordinate (e.g. atom).
         *
         * @return {number} Dot product of the 2 vectors.
         */
        dihedralAngle: (
            coord1: [number, number, number],
            coord2: [number, number, number],
            coord3: [number, number, number],
            coord4: [number, number, number]
        ) => number;

        /**
         * Get the norm of the given vector.
         * This is the "magnitude" of a vector - i.e. a measure of distance
         * between the origin and the coordinate given.
         *
         * @param {number[]} arr Vector to run on. Usually has 2 or 3 values, but can be any length.
         * @return {number} Norm of the given vector.
         */
        normVector: (arr: number[]) => number;
    }
}

/*---------------------------------------- Math POLYFILLS ----------------------------------------*/
if (!Math.rgbToHex) {
    Reflect.defineProperty(Math, `rgbToHex`, {
        value(rgb: string | number) {
            const hex = Math.round(Number(rgb)).toString(16);
            return hex.length < 2 ? `0${hex}` : hex;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.roundTo) {
    Reflect.defineProperty(Math, `roundTo`, {
        value(val: number, decimals: RoundDecimals = 0) {
            const multiplier = 10 ** decimals;
            return Math.round(val * multiplier) / multiplier;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.floorTo) {
    Reflect.defineProperty(Math, `floorTo`, {
        value(val: number, decimals: RoundDecimals = 0) {
            const multiplier = 10 ** decimals;
            return Math.floor(val * multiplier) / multiplier;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.ceilTo) {
    Reflect.defineProperty(Math, `ceilTo`, {
        value(val: number, decimals: RoundDecimals = 0) {
            const multiplier = 10 ** decimals;
            return Math.ceil(val * multiplier) / multiplier;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.lesserOf) {
    Reflect.defineProperty(Math, `lesserOf`, {
        value(val1: number, val2: number) {
            return val1 < val2 ? val1 : val2;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.greaterOf) {
    Reflect.defineProperty(Math, `greaterOf`, {
        value(val1: number, val2: number) {
            return val1 > val2 ? val1 : val2;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.distance) {
    Reflect.defineProperty(Math, `distance`, {
        value(val1: number, val2: number) {
            return Math.abs(val1 - val2);
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.clampNum) {
    Reflect.defineProperty(Math, `clampNum`, {
        value(value: number, min: number, max: number) {
            const cleanMin = min < max ? min : max;
            const cleanMax = max > min ? max : min;
            if (value <= cleanMin) return cleanMin;
            if (value >= cleanMax) return cleanMax;
            return value;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.degreesToRadians) {
    Reflect.defineProperty(Math, `degreesToRadians`, {
        value(degrees: number) {
            return (degrees / 180) * Math.PI;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.radiansToDegrees) {
    Reflect.defineProperty(Math, `radiansToDegrees`, {
        value(radians: number) {
            return (180 * radians) / Math.PI;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.crossProduct) {
    Reflect.defineProperty(Math, `crossProduct`, {
        value(
            vector1: [number, number, number],
            vector2: [number, number, number]
        ): [number, number, number] {
            return [
                vector1[1] * vector2[2] - vector1[2] * vector2[1],
                vector1[2] * vector2[0] - vector1[0] * vector2[2],
                vector1[0] * vector2[1] - vector1[1] * vector2[0],
            ];
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.dotProduct) {
    Reflect.defineProperty(Math, `dotProduct`, {
        value(vector1: number[], vector2: number[]): number {
            let result = 0;
            for (let i = 0; i < 3; i++) {
                result += vector1[i] * vector2[i];
            }
            return result;
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.normVector) {
    Reflect.defineProperty(Math, `normVector`, {
        value(arr: number[]): number {
            let n = 0;
            arr.forEach(val => {
                n = n + Math.pow(Math.abs(val), 2);
            });
            return Math.pow(n, 0.5);
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.dihedralAngle) {
    Reflect.defineProperty(Math, `dihedralAngle`, {
        value(
            a: [number, number, number],
            b: [number, number, number],
            c: [number, number, number],
            d: [number, number, number]
        ): number {
            const b0 = b.map((val, idx) => (val - a[idx]) * -1);
            let b1 = c.map((val, idx) => val - b[idx]);
            const b2 = d.map((val, idx) => val - c[idx]);

            const b1Norm = Math.normVector(b1);

            b1 = b1.map(val => val / b1Norm);

            const b0b1Dot = Math.dotProduct(b0, b1);
            const b0b1DotXB1 = b1.map(val => val * b0b1Dot);
            const v = b0.map((val, idx) => val - b0b1DotXB1[idx]) as [number, number, number];

            const b2b1Dot = Math.dotProduct(b2, b1);
            const w = b2.map(val => val * b2b1Dot);

            const x = Math.dotProduct(v, w);
            const y = Math.dotProduct(Math.crossProduct(b1 as [number, number, number], v), w);

            const dihedral = Math.atan2(y, x);

            return Math.radiansToDegrees(dihedral);
        },
        configurable: false,
        enumerable: false,
    });
}

if (!Math.buildRangeString) {
    Reflect.defineProperty(Math, `buildRangeString`, {
        value(arr1: number[] | Set<number>, arr2: number[] | Set<number> = []) {
            // Collect all atoms into a set
            const numSet = new Set();
            arr1.forEach(item => numSet.add(item));
            arr2.forEach(item => numSet.add(item));

            // Convert atom set into array and sort it
            const numsArr = [];
            numSet.forEach(item => numsArr.push(item));
            numsArr.sortByNumber();

            const ranges = [];
            const curRange = [];
            numsArr.forEach((item, idx) => {
                const isLast = idx === numsArr.length - 1;

                // If curRange is empty, add item to it. If it's also the last item, add it to output.
                if (curRange.isEmpty()) {
                    return isLast ? ranges.push(item) : curRange.push(item);
                }

                // If current item in range = previous serial plus 1, add to range
                if (curRange.last + 1 === item) {
                    curRange.push(item);
                }

                // If previous item in current range != current serial minus 1...
                else {
                    // ...and there's only 1 item in the range, add the number, clear the range
                    if (curRange.length === 1) {
                        ranges.push(curRange.pop());
                    }
                    // ...and there are 2 items in the range, add both numbers, clear the range
                    else if (curRange.length === 2) {
                        curRange.reverse();
                        ranges.push(curRange.pop());
                        ranges.push(curRange.pop());
                    }
                    // ...and there are > 2 items in the range, create a range string, clear the range
                    else {
                        ranges.push(curRange.first + `-` + curRange.last);
                        curRange.emptyArray();
                    }
                    curRange.push(item);
                }

                // If this is the last item...
                if (isLast) {
                    // Add it to the list
                    if (curRange.length === 1) {
                        ranges.push(curRange.pop());
                    }
                    // If there are 2 items, add both to the list
                    else if (curRange.length === 2) {
                        curRange.reverse();
                        ranges.push(curRange.pop());
                        ranges.push(curRange.pop());
                    }
                    // If there are > 2 items, add them as a range
                    else {
                        ranges.push(curRange.first + `-` + curRange.last);
                        curRange.emptyArray();
                    }
                }
            });

            const rangeStr = ranges.join(`, `);
            console.log(`buildRangeString :: rangeStr:`, rangeStr);
            return rangeStr;
        },
    });

    if (!Math.getRandomInt) {
        Reflect.defineProperty(Math, `getRandomInt`, {
            value(min: number, max: number) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1) + min);
            },
            configurable: false,
            enumerable: false,
        });
    }
}

/*-------------------------------------------- EXPORT --------------------------------------------*/
/**
 * Log and export to ensure uptake
 */
log.verbose(`Successfully augmented global Math object. Math object keys:`, Object.keys(Math));
export const MathOut = Math;
