/*------------------------------------- THIRD-PARTY MODULES --------------------------------------*/
import {
    toCamelCase,
    toSnakeCase,
    toDashCase,
    capitalize,
    array as arrayUtils,
    string as stringUtils,
    removeMatchingText,
} from 'mad-utils/lib/shared';

import {isDevelopment, isUAT, isQA} from 'env-var-helpers';

/*------------------------------------------- LOGGING --------------------------------------------*/
import {logFactory, Styles} from 'mad-logs/lib/shared';
const log = logFactory(`augment-string-prototype.ts`, Styles.angryBird);

/*---------------------------------- TYPE DECLARATIONS (GLOBAL) ----------------------------------*/
declare global {
    interface String {
        /**
         * Example: `some string example`.camelCase()  -[outputs]-> "someStringExample"
         */
        camelCase(): string;

        /**
         * Example: `Some String Example`.snakeCase()  -[outputs]->  "some_string_example"
         */
        snakeCase(): string;

        /**
         * Example: `some string example`.pascalCase()  -[outputs]->  "SomeStringExample"
         */
        pascalCase(): string;

        /**
         * Example: `Some String Example`.dashCase()  -[outputs]->  "some-string-example"
         */
        dashCase(): string;

        /**
         * Example: `ExampLe`.reverse()  -[outputs]-> "eLpmaxE"
         */
        reverse(): string;

        /**
         * Capitalize the first character in the string
         */
        capitalize: string;

        /**
         * Capitalize the first character in the string, lowercase the rest
         *
         * Example:
         *     `TeST StRing`.cap1LowerRest();
         *     // => `Test string`
         */
        cap1LowerRest(): string;

        first(): string;
        last(): string;
        second(): string;
        secondLast(): string;
        third(): string;
        thirdLast(): string;

        first2(): string;
        first3(): string;
        last2(): string;
        last3(): string;

        /**
         * Get all but first character in string
         */
        tail(): string;

        /**
         * Get all but last character in string
         */
        init(): string;

        /**
         * e.g. `"asdf"`.removeSurroundingQuotes() => `asdf`
         */
        removeSurroundingQuotes(): string;

        /**
         * Remove all whitespace from a string
         * Example: " Example  With Whitespace  " => "ExampleWithWhitespace"
         */
        removeWhitespace(): string;

        /**
         * Remove multiple empty lines in a row
         */
        removeMultiEmptyLines: string;

        /**
         * Remove whitespace at the end of each line.
         *
         * Example (where up-down lines are end-of line):
         *     |
         *       test     |
         *          another line|
         *            last written line          |
         *     |
         *
         * Output:
         *     |
         *       test|
         *          another line|
         *            last written line|
         *     |
         * `
         */
        removeEolSpace: string;

        /**
         * @deprecated Just use trim(), which does this much more comprehensively.
         * Remove whitespace from beginning & end of string.
         * Example (lines = string edges): |    my test   string here       |
         * Output:                         |my test   string here|
         */
        removeBookendSpace: string;

        /**
         * Remove empty lines from beginning and end of multiline string, but leave all others.
         * Removes all lines from each unless [removeOne] set to true (then it only removes one).
         */
        removeBookendEmptyLines: (removeOne?: boolean) => string;

        /**
         * Remove empty lines from string.
         *
         * Example - using someStr.removeBookendEmptyLines():
         *     ----------------
         *     |               |
         *     |    This is my |
         *     |                  |
         *     |  test|
         *     ||
         *     |    |
         *     |    string  |
         *     ||
         *     ----------------
         *
         * Output:
         *     ----------------
         *     |    This is my |
         *     |  test|
         *     |    string  |
         *     ----------------
         *
         * By default it also removes lines with only whitespace, unless opts.keepWhitespaceLines
         * is set to true e.g.: str.removeEmptyLines({keepWhitespaceLines: true});
         *
         * Example with str.removeEmptyLines({keepWhitespaceLines: true}):
         *     ----------------
         *     |               |
         *     |    This is my |
         *     |                  |
         *     |  test|
         *     ||
         *     |    |
         *     |    string  |
         *     ||
         *     ----------------
         *
         * Output:
         *     ----------------
         *     |               |
         *     |    This is my |
         *     |                  |
         *     |  test|
         *     |    |
         *     |    string  |
         *     ----------------
         *
         */
        removeEmptyLines(opts?: {
            preserve?: 'first' | 'last' | 'bookends';
            keepWhitespaceLines?: boolean;
        }): string;

        /**
         * Remove indents and empty lines before and after.
         *
         * Indent removal process:
         *    1. Removes empty lines at start and finish of string.
         *    2. Checks each line to find the smallest number of spaces from
         *       line start to the first letter.
         *    3. Removes that number of spaces from the start of each line.
         */
        removeIndent: string;

        /**
         * Repeat a string [numRepeats] number of times.
         *
         * Example: 'hello'.repeat(3); // => 'hellohellohello'
         */
        repeat: (numRepeats: number) => string;

        /**
         * Ensure single "#" prepended to string.
         *
         * Examples:
         *     "some-string".elID            // => "#some-string"
         *
         *     "#some-string".elID           // => "#some-string"
         *
         *     "##some-string".elID          // => "#some-string"
         *
         *     "some-string".elID.elID.elID  // => "#some-string"
         */
        elID: string;

        /**
         * Remove end-of-sentence/fragment punctuation (! . , ; : -) and
         * whitespace at end of string.
         *
         * Example: "someString.".rmEndPunc      // => "someString"
         * Example: "someString".rmEndPunc       // => "someString"
         * Example: "someString:".rmEndPunc      // => "someString"
         * Example: "text.someString,".rmEndPunc // => "text.someString"
         * Example: "someString!!!".rmEndPunc    // => "someString"
         * Example: "someString!.".rmEndPunc     // => "someString"
         */
        rmEndPunc: string;

        /**
         * Remove all text matching [needle] from string (haystack).
         *
         * Example: `Meeka is a Meeka`.removeMatches(`Meeka`)  =>  " is a "
         * Example: `Meeks doggy dog`.removeMatches(/\s?dog[a-z][a-z]\s?/)  =>  "Meeks"
         *
         * @param {string|RegExp} needle String or RegExp to search for in string
         */
        removeMatches(needle: string | RegExp): string;

        /**
         * Get string to trail off to keep it below given [length], optionally
         * with [ending] applied.
         *
         * @param {number} length Max str len. Excludes [ending] (dots) from total count.
         *                        Trails off so str less than or eql to this len {def: 100}.
         * @param {string} ending String to have trailing off at the end {def: ...}
         */
        truncate(length?: number, ending?: string): string;

        /**
         * Get string to trail in at beginning (e.g. ...fileName.zzz) to keep
         * it below given [length], optionally with [start] string applied.
         *
         * @param {number} [length] Max str len. Excludes [start] (dots) from total count.
         *                        Trails in so str less than or eql to this len {def: 100}.
         * @param {string} [start] String to have trailing off at the start {def: ...}
         */
        truncateStart(length?: number, start?: string): string;

        /**
         * Returns true if string includes [text]
         * @param {string} text Character or string to match against
         */
        includes(text: string): boolean;

        /**
         * Returns true if [regex] returns a match in string
         * @param {RegExp} regex Regular expression to match against string
         */
        includes(regex: RegExp): boolean;

        /**
         * Pad the string on the right side with character [padChar] (Default: ` `)
         * until it's the given [length] (Default: 0)
         *
         * @param {number} length Number of characters wide to make the output string
         * @param {string} padChar Character to pad the output string with
         */
        padRight(length?: number, padChar?: string): string;

        /**
         * Pad the string on the left side with character [padChar] (Default: ` `)
         * until it's the given [length] (Default: 0)
         *
         * @param {number} length Number of characters wide to make the output string
         * @param {string} padChar Character to pad the output string with
         */
        padLeft(length?: number, padChar?: string): string;

        /**
         * @param {string} substrToRm Substring to remove from end
         *                            Default: removes \r, \n, \r\n & \n\r
         * @return {string} New string with given substring removed from end
         */
        chomp(substrToRm?: string): string;

        /**
         * Merge strings into current string, treating them as file paths.
         * Decides whether to include
         * Normalizes result. If given no arguments, simply normalizes the provided string.
         *
         * Any empty strings given are ignored.
         *
         * Examples:
         *     "a/b/c".pathJoin();                   // => a/b/c
         *     "a/b/c/".pathJoin();                  // => a/b/c/
         *     "a/b/c/".pathJoin('');                // => a/b/c/
         *     "/a/b/c///".pathJoin();               // => /a/b/c/
         *     "/a/b/c".pathJoin('d');               // => /a/b/c/d
         *     "/a/b/c".pathJoin('d', 'e');          // => /a/b/c/d/e
         *     "//a//b/c".pathJoin('d/e');           // => /a/b/c/d/e
         *     "//a//b/c".pathJoin('d/e', '', 'f');  // => /a/b/c/d/e/f
         *     "//a//b/c".pathJoin('d/e', '', 'f/'); // => /a/b/c/d/e/f/
         *
         * @param {string[]} paths Paths to join to starting string
         * @return {string} New string w strings joined together w slashes in
         *                  between each part & path normalized
         */
        pathJoin(...paths: string[]): string;

        /**
         * Get file extension(s) from file name. Includes *all* extensions if
         * includeAllExts is true e.g. can return `d.ts` (or `.d.ts` if
         * includeFirstDot is true).
         *
         * @param {boolean} includeFirstDot If true, include dot preceding file type
         * @param {boolean} includeAllExts If true, include all extensions e.g. .d.ts
         * @return {string} File extensions as a string string e.g. `scss`
         */
        ext(opts?: {includeFirstDot?: boolean; includeAllExts?: boolean}): string;

        /**
         * Make string sit on one line (remove all `\n`) and remove whitespace
         * of more than 1 space.
         *
         *   e.g.: `
         *          a    b
         *          aeowf
         *          rf `
         *          // => `a b aeowf rf`
         *
         * Purpose: handling multiline strings
         */
        oneLine: string;

        /**
         *  Remove efs, efs/, /efs, /efs/, or ./efs, along with '/'  and './' from the path.
         *  Also normalizes path.
         *
         * Examples:
         *     'efs/asdf/123'.rmEfsRoot()          => 'asdf/123'.
         *     '/efs/asdf/123'.rmEfsRoot()         => 'asdf/123'.
         *     './efs/asdf/123'.rmEfsRoot()        => 'asdf/123'.
         *     '/'.rmEfsRoot()                     => ''.
         *     './'.rmEfsRoot()                    => ''.
         *     'asdf/123'.rmEfsRoot()              => 'asdf/123'.
         *     '//asdf//123//////afa'.rmEfsRoot()  => 'asdf/123/afa'.
         */
        rmEfsRoot: (prefix?: '/') => string;

        /**
         *  Add efs to path if not already present. Ensures it's not present
         *  multiple times.
         *  Also normalizes path.
         *
         * Examples:
         *     'efs/asdf/123'.ensureEfsRoot()              => '/efs/asdf/123'.
         *     '/efs/asdf/123'.ensureEfsRoot()             => '/efs/asdf/123'.
         *     './efs/asdf/123'.ensureEfsRoot()            => '/efsasdf/123'.
         *     '/'.ensureEfsRoot()                         => '/efs/'.
         *     './'.ensureEfsRoot()                        => '/efs/'.
         *     'asdf/123'.ensureEfsRoot()                  => '/efs/asdf/123'.
         *     '/asdf/123/afa'.ensureEfsRoot()             => '/efs/asdf/123/afa'.
         *     '//asdf//123//////afa'.ensureEfsRoot()      => '/efs/asdf/123/afa'.
         *     '/efs/efs/asdf/123/afa'.ensureEfsRoot()     => '/efs/asdf/123/afa'.
         *     'efs/efs/afaulkner/my_proj'.ensureEfsRoot() => '/efs/afaulkner/my_proj'.
         */
        ensureEfsRoot: () => string;

        /**
         * @deprecated Use rmEfsRoot() instead
         * Remove /efs/, ./efs/, or efs/ before a path, leaving just '/', './', or '' instead.
         *
         * If no prefix arg given, defaults to value based on what was initially given e.g.:
         *     '/efs/asdf/123'.rmEFSRootPath()  => '/asdf/123'
         *     'efs/asdf/123'.rmEFSRootPath()   => 'asdf/123'
         *     './efs/asdf/123'.rmEFSRootPath() => './asdf/123'
         *
         * If prefix arg given, uses that as prefix:
         *     '/efs/asdf/123'.rmEFSRootPath('./')  => './asdf/123'
         *     'efs/asdf/123'.rmEFSRootPath('')     => 'asdf/123'
         */
        rmEFSRootPath: (prefix?: '/' | './' | '') => string;

        /**
         * Ensure the string ends with the given extension ([ext]), but only once.
         *
         * Examples:
         *     'asdf'.ensureExtension('xyz'); // => asdf.xyz
         *     'asdf'.ensureExtension('.xyz'); // => asdf.xyz
         *
         *     'asdf.xyz'.ensureExtension('xyz'); // => asdf.xyz
         *     'asdf.xyz.xyz'.ensureExtension('xyz'); // => asdf.xyz
         *
         *     'asdf.'.ensureExtension('xyz'); // => asdf.xyz
         *     'asdf..'.ensureExtension('xyz'); // => asdf.xyz
         *     'asdfxyz'.ensureExtension('xyz'); // => asdfxyz.xyz
         *
         *     'asdf.abc'.ensureExtension('xyz'); // => asdf.abc.xyz
         *
         * @param {string} ext Extension to ensure the string ends with e.g. "xyz."
         */
        ensureExtension: (ext: string) => string;

        /**
         * Try to convert string to boolean. Handles 'true', 'True', 'TRUE', 'yes', 'y'
         * 't', 'T', 'false', 'False', 'FALSE', 'f', 'F', 'n', and 'no'.
         *
         * Returns null if it can't be converted.
         */
        toBool: () => boolean | null;
    }
}

/*------------------------------------ AUGMENTATION FUNCTIONS ------------------------------------*/
/*
 * Don't re-apply augmentations if they're already present.
 */
if (
    !String.prototype?.camelCase ||
    !('removeMatches' in String.prototype) ||
    !('oneLine' in String.prototype) ||
    !String.prototype?.removeIndent
) {
    String.prototype.camelCase = function camelCase() {
        return toCamelCase(this);
    };

    String.prototype.pascalCase = function pascalCase() {
        return capitalize(toCamelCase(this));
    };

    String.prototype.snakeCase = function snakeCase() {
        return toSnakeCase(this);
    };

    String.prototype.dashCase = function dashCase() {
        return toDashCase(this);
    };

    String.prototype.reverse = function reverse() {
        return this.split(``).reverse().join(``);
    };

    String.prototype.removeMatches = function removeMatches(textToRm: string | RegExp) {
        return removeMatchingText(this, textToRm);
    };

    String.prototype.truncate = function truncate(length: number = 100, ending = `...`): string {
        return this.length > length ? this.substring(0, length) + ending : this;
    };

    String.prototype.truncateStart = function truncateStart(
        len: number = 100,
        start = `...`
    ): string {
        return this.length > len ? start + this.reverse().substring(0, len).reverse() : this;
    };

    //
    // Override "includes" method with a polyfill that also takes regexes
    //

    // Store original includes
    const origIncludes = String.prototype.includes;

    // Override includes
    String.prototype.includes = function includesAugmented<T extends string | RegExp>(
        match: T
    ): boolean {
        return match instanceof RegExp ? !!this.match(match) : origIncludes.call(this, match);
    };

    String.prototype.padRight = function padRightAugmented(outWidth?: number, padChar?: string) {
        return stringUtils.padRight(this, outWidth, padChar);
    };

    String.prototype.padLeft = function padLeftAugmented(outWidth?: number, padChar?: string) {
        return stringUtils.padLeft(this, outWidth, padChar);
    };

    Reflect.defineProperty(String.prototype, `elID`, {
        get: function elID(this: string): string {
            if (this === ``) {
                console.error(`ERROR :: elID cannot be run on an empty string`);
                return this;
            }

            return `#${this.removeMatches(/^#+/g)}`;
        },
    });

    Reflect.defineProperty(String.prototype, `rmEndPunc`, {
        get: function rmEndPunc(this: string): string {
            return this.replace(/[!.,;:\- ]+$/g, ``);
        },
    });

    Reflect.defineProperty(String.prototype, `chomp`, {
        configurable: false,
        enumerable: false,
        value: function chomp(this: string, substrToRm?: string): string {
            return substrToRm
                ? this.replace(new RegExp(`(${substrToRm})+$`, `g`), ``)
                : this.replace(/[\r\n]+$/g, ``);
        },
    });

    Reflect.defineProperty(String.prototype, `ext`, {
        configurable: false,
        enumerable: false,
        value: function ext(
            this: string,
            opts: {includeFirstDot?: boolean; includeAllExts?: boolean} = {}
        ): string {
            const {includeFirstDot, includeAllExts} = opts;
            const fileNameArr = this.split(`/`);
            const fileName = fileNameArr[fileNameArr.length - 1];

            const fileStrArr = fileName.split(`.`);
            fileStrArr.shift(); // Remove actual file name (not the extension)

            if (!includeAllExts) return (includeFirstDot ? `.` : ``) + fileStrArr.pop();

            const fileNameExt = fileStrArr.join(`.`);
            return (includeFirstDot ? `.` : ``) + fileNameExt;
        },
    });

    /*-------------------------------------- GET FROM POSITION ---------------------------------------*/
    String.prototype.tail = function tailAugmented(this: string): string {
        return this.slice(1);
    };

    String.prototype.init = function initAugmented(this: string): string {
        return this.slice(0, -1);
    };

    Reflect.defineProperty(String.prototype, `capitalize`, {
        get: function capitalizeAugmented(this: string): string {
            return capitalize(this);
        },
    });

    Reflect.defineProperty(String.prototype, `oneLine`, {
        configurable: false,
        enumerable: false,
        get: function oneLine(this: string): string {
            return this.replace(/\n|\t|\r/g, ` `).replace(/ {2,}/g, ` `);
        },
    });

    Reflect.defineProperty(String.prototype, `removeIndent`, {
        configurable: false,
        enumerable: false,
        get: function removeIndent(this: string): string {
            const baseStrArr = this.split(/\n/g);

            // Clone the array
            const filteredStrArr = baseStrArr.slice(0);

            // Remove blank lines at start
            let fromStartIdx = 0;
            while (fromStartIdx < baseStrArr.length) {
                if (baseStrArr[fromStartIdx].match(/^\s+$/) || baseStrArr[fromStartIdx] === ``) {
                    filteredStrArr[fromStartIdx] = null;
                } else {
                    break;
                }
                fromStartIdx++;
            }

            // Remove blank lines at end
            let fromEndIdx = baseStrArr.length - 1;
            while (fromEndIdx > 0) {
                if (baseStrArr[fromEndIdx].match(/^\s+$/) || baseStrArr[fromEndIdx] === ``) {
                    filteredStrArr[fromEndIdx] = null;
                } else {
                    break;
                }
                fromEndIdx--;
            }

            const strArr = arrayUtils.compact(filteredStrArr, 'nullUndef');

            // Calculate minimum number of spaces at start of string
            let minLength = null;
            for (const line of strArr) {
                // Don't count blank lines in the middle
                if (line.length === 0 || line.match(/^ *$/)) continue;

                const spacesAtStartMatches = line.match(/^\s+(?=[^\s])/g);
                if (spacesAtStartMatches === null || spacesAtStartMatches.length === 0) {
                    minLength = 0;
                    break;
                }

                const spacesAtStart = spacesAtStartMatches[0];
                if (minLength === null) {
                    minLength = spacesAtStart.length;
                } else if (spacesAtStart.length < minLength) {
                    minLength = spacesAtStart.length;
                }
            }

            // Slice off correct # of spaces from each line then merge lines into single string.
            const slicedStr = strArr.map(line => line.slice(minLength));
            return slicedStr.join(`\n`);
        },
    });

    Reflect.defineProperty(String.prototype, `removeMultiEmptyLines`, {
        configurable: false,
        enumerable: false,
        get: function removeMultiEmptyLines(this: string): string {
            return this.replace(/ *\n *\n/g, `\n`); // rm double empty spaces
        },
    });

    Reflect.defineProperty(String.prototype, `removeBookendSpace`, {
        configurable: false,
        enumerable: false,
        get: function removeBookendSpace(this: string): string {
            // Rm start and end spaces
            return this.replace(/^[ \s]+/g, ``).replace(/[ \s]+$/g, ``);
        },
    });

    Reflect.defineProperty(String.prototype, `removeBookendEmptyLines`, {
        configurable: false,
        enumerable: false,
        value: function removeBookendEmptyLines(this: string, removeOne?: boolean): string {
            // Rm all start and end empty lines
            if (!removeOne) return this.replace(/^\n+/g, '').replace(/\n+$/g, '');
            // Rm 1st empty line at start and 1st empty line at end
            return this.replace(/^\n/g, '').replace(/\n$/g, '');
        },
    });

    /**
     * Remove all empty lines and whitespace at the end of each line.
     */
    Reflect.defineProperty(String.prototype, `removeEolSpace`, {
        configurable: false,
        enumerable: false,
        get: function removeEolSpace(this: string): string {
            return this.replace(/ +\n/g, `\n`) // rm empty spaces at end of each line
                .replace(/ +$/g, ``); // rm empty last line(s)
        },
    });

    /**
     * Remove empty lines from string
     */
    Reflect.defineProperty(String.prototype, `removeEmptyLines`, {
        configurable: false,
        enumerable: false,
        value: function removeEmptyLines(
            this: string,
            opts: {preserve?: 'first' | 'last' | 'bookends'; keepWhitespaceLines?: boolean} = {}
        ): string {
            // Rm empty 1st line, even with spaces
            let str =
                opts?.preserve === 'first' || opts?.preserve === 'bookends'
                    ? this
                    : opts?.keepWhitespaceLines
                    ? this.replace(/^\n+/g, ``)
                    : this.replace(/^( *\n)+/g, ``);
            // rm empty last line(s)
            str =
                opts?.preserve === 'last' || opts?.preserve === 'bookends'
                    ? str
                    : opts?.keepWhitespaceLines
                    ? str.replace(/\n+$/g, ``)
                    : str.replace(/(\n *)+$/g, ``);

            return opts?.keepWhitespaceLines
                ? str.replace(/\n{2,}/g, `\n`)
                : str.replace(/\n( *\n)+/g, `\n`); // rm empty lines, except at start
        },
    });

    Reflect.defineProperty(String.prototype, `repeat`, {
        configurable: false,
        enumerable: false,
        value: function repeat(this: string, numRepeats: number): string {
            return Array(numRepeats + 1).join(this);
        },
    });

    // Inspired by https://stackoverflow.com/a/29855511/4212668
    Reflect.defineProperty(String.prototype, `pathJoin`, {
        configurable: false,
        enumerable: false,
        value: function pathJoin(this: string, ...paths: string[]): string {
            // Determine end of final string (i.e. whether it has a trailing slash)
            const end =
                (paths.length === 0 && this.match(/\/$/)) ||
                (paths.length === 1 && !paths[0] && this.match(/\/$/)) ||
                !!(paths[paths.length - 1] || ``).match(/\/$/)
                    ? `/`
                    : ``;

            // Split inputs into a list of path commands.
            let pathParts = this.split(`/`);
            for (let idx = 0, l = paths.length; idx < l; idx++) {
                pathParts = pathParts.concat(paths[idx].split(`/`));
            }

            // Interpret the path commands to get the new resolved path.
            const newParts = [];
            for (let idx = 0, l = pathParts.length; idx < l; idx++) {
                const part = pathParts[idx];
                if (!part || part === `.`) continue;
                if (part === `..`) newParts.pop();
                else newParts.push(part);
            }

            // Preserve initial slash if there was one.
            if (pathParts[0] === ``) newParts.unshift(``);

            // Turn back into a single string path, add trailing slash if missing.
            return ((newParts.join(`/`) || (newParts.length ? `/` : `.`)) + end).replace(
                /\/+/g,
                `/`
            );
        },
    });

    Reflect.defineProperty(String.prototype, `toBool`, {
        configurable: false,
        enumerable: false,
        value: function toBool(this: string): boolean | null {
            const cleanStr = this.toLowerCase().trim();
            if (['true', 't', 'y', 'yes'].some(val => cleanStr === val)) return true;
            if (['false', 'f', 'n', 'no'].some(val => cleanStr === val)) return false;
            return null;
        },
    });

    /*---------------------------------------- PATH HANDLING -----------------------------------------*/
    /**
     * @deprecated Prefer rmEfsRoot.
     */
    Reflect.defineProperty(String.prototype, `rmEFSRootPath`, {
        configurable: false,
        enumerable: false,
        value: function rmEFSRootPath(this: string, prefix?: '/' | './' | ''): string {
            if (this.match(/^\/efs\//g)) return this.replace(/^\/efs\//g, prefix ?? `/`);
            if (this.match(/^\.\/efs\//g)) return this.replace(/^\.\/efs\//g, prefix ?? `./`);
            if (this.match(/^efs\//g)) return this.replace(/^efs\//g, prefix ?? ``);
            return this;
        },
    });

    Reflect.defineProperty(String.prototype, `rmEfsRoot`, {
        configurable: false,
        enumerable: false,
        value: function rmEfsRoot(this: string, prefix: '/' | '' = ''): string {
            // Remove all efs prefix variants
            const retVal = this.replace(/^ *\.?((\/*efs(?![a-zA-Z0-9_\-])\/*)|(\/+))/g, '');
            // Add prefix, remove duplicate slashes
            return (prefix + retVal).replace(/\/+/g, '/');
        },
    });

    Reflect.defineProperty(String.prototype, `ensureEfsRoot`, {
        configurable: false,
        enumerable: false,
        value: function rmEfsRoot(this: string, prefix: '/' | '' = ''): string {
            // Should output string in "abc/123/def/456" form
            const noEfsStr = this
                // Remove efs from the start of the string
                .replace(/^\.?(\/+)?(efs\/+)+/g, '')
                // Remove initial slash(es)
                .replace(/^\.?\/+/g, '')
                // Remove duplicate slashes
                .replace(/\/+/g, '/')
                // Remove trailing slash(es).
                .replace(/\/+$/g, '');

            return `/efs${noEfsStr ? '/' + noEfsStr : ''}`;
        },
    });

    Reflect.defineProperty(String.prototype, `ensureExtension`, {
        configurable: false,
        enumerable: false,
        value: function ensureExtension(this: string, ext: string): string {
            const onePreDot = '.' + ext.replace(/^\.+/gi, '');
            const escapedExt = String(onePreDot).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
            const extMatch = new RegExp(`(${escapedExt})+$`);
            return this.replace(/\.+$/g, '').replace(extMatch, '') + onePreDot;
        },
    });

    /*---------------------------- BULK ADD FUNCTIONS TO STRING PROTOTYPE ----------------------------*/
    const newStrFuncs = [`cap1LowerRest`, `removeSurroundingQuotes`, `removeWhitespace`].forEach(
        fn => {
            String.prototype[fn] = function () {
                return stringUtils[fn](this);
            };
        }
    );

    const newArrFuncs = [
        `first`,
        `last`,
        `second`,
        `secondLast`,
        `third`,
        `thirdLast`,
        `first2`,
        `first3`,
        `last2`,
        `last3`,
    ].forEach(fn => {
        String.prototype[fn] = function () {
            return arrayUtils[fn](this);
        };
    });

    log.verbose(
        `Successfully augmented String.prototype. String.prototype keys:`,
        Object.keys(String.prototype)
    );
}

/*--------------------- EXPORTS REQUIRED TO ENSURE UPTAKE FOR AUGMENTATIONS ----------------------*/
export type BaseStrFunc = () => string;
