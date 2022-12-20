import isNode from 'detect-node';

/*------------------------------------ GLOBAL TYPE OVERRIDES -------------------------------------*/
declare global {
    interface Error {
        name: string;
        message: string;
        stack?: string;
        /**
         * Allow attaching stdout+stderr manually to error object.
         */
        stdall?: string;
    }

    interface Function {
        displayName?: DisplayName;
    }

    interface RegExpConstructor {
        escape: (unescapedStr: string) => string;
    }

    /**
     * Returns the names of the enumerable string properties and methods of an object.
     * (Turned into an explicit global)
     *
     * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
     */
    var keys: typeof Object['keys'];

    // Below ensures the 'window' global works in node.js code.
    /**
     * A window containing a DOM document; the document property points to the DOM document loaded in that window.
     */
    var window: Window & typeof globalThis;
}

// Note: it's important to have at least 1 export from here, or typescript imports will fail.
export type DisplayName = string;

/*--------------------------------------- GLOBAL FUNCTIONS ---------------------------------------*/
// Safely turn Object.keys into global "keys" function, for convenience.
if (global && !global?.keys) global.keys = Object.keys;
if (globalThis && !globalThis?.keys) globalThis.keys = Object.keys;
if (!isNode && window && !window?.keys) window.keys = Object.keys;

/*--------------------------------------- RegExp POLYFILLS ---------------------------------------*/
if (!RegExp.escape) {
    Reflect.defineProperty(RegExp, `escape`, {
        value(unescapedStr: string) {
            return String(unescapedStr).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
        },
        configurable: false,
        enumerable: false,
    });
}

/*----------------------- BARREL EXPORTS FOR OTHER PROTOTYPE AUGMENTATIONS -----------------------*/
import * as MathProto from './augment-math-prototype';
import * as StringProto from './augment-string-prototype';
import * as ArrayProto from './augment-array-prototype';

export {MathProto, StringProto, ArrayProto};
