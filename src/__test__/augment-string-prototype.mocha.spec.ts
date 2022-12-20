/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/node/index.d.ts" />
/// <reference path="../../../node_modules/mad-utils/lib/node.d.ts" />

// Run directly with:
//     npx ts-mocha -p app/server/tsconfig-server.json shared/augment-global-prototypes/__test__/augment-string-prototype.mocha.spec.ts
//     --watch --watch-files ./shared/augment-global-prototypes/augment-string-prototype.ts

import '../../nodejs-backend/nodejs-process-setup';

/*------------------------------------------- LOGGING --------------------------------------------*/
import {logFactory, Styles} from 'mad-logs/lib/shared';
const log = logFactory(__filename.replace(`${__dirname}/`, ``), Styles.aquarium);

/*------------------------------------- THIRD-PARTY MODULES --------------------------------------*/
import {expect} from 'chai';

/*---------------------------------- IMPORT AUGMENTATION FOR TESTING -----------------------------------*/
/*
 * Note: next 2 imports are dummies, but Typescript must get a value from a
 * module to apply the global values it declares.
 */
import * as AUGMENT_STRING_PROTOTYPE from '../augment-string-prototype'; // tslint:disable-line
log.verbose(`AUGMENT_STRING_PROTOTYPE:`, AUGMENT_STRING_PROTOTYPE); // Important: ensures uptake of global augmentations

/*-------------------------------------------- TESTS ---------------------------------------------*/
describe(`augment-string-prototype`, function () {
    describe(`ensureEfsRoot`, function () {
        let parsedMoldynConf: Record<string, any> = {};

        it(`should leave absolute efs paths unchanged e.g. /efs/projs -> /efs/projs`, function () {
            expect('/efs/asdf/123'.ensureEfsRoot()).eql('/efs/asdf/123');
        });

        it(`should add slash to start of paths starting w "efs/" e.g. efs/a/1 => /efs/a/1`, function () {
            expect('efs/asdf/123'.ensureEfsRoot()).eql('/efs/asdf/123');
        });

        it(`should remove "." at the start of the path before "/efs" e.g. ./efs/a/1 => /efs/a/1`, function () {
            expect('efs/asdf/123'.ensureEfsRoot()).eql('/efs/asdf/123');
        });

        it(`should convert paths containing just a / or ./ to /efs`, function () {
            expect('/'.ensureEfsRoot()).eql('/efs');
            expect('./'.ensureEfsRoot()).eql('/efs');
        });

        it(`should convert '/efs/' to /efs (to keep standard output format)`, function () {
            expect('./efs/'.ensureEfsRoot()).eql('/efs');
        });

        it(`should convert './efs/' to /efs`, function () {
            expect('./efs/'.ensureEfsRoot()).eql('/efs');
        });

        it(`should convert '/efs/' to /efs (to keep standard output format)`, function () {
            expect('/efs/'.ensureEfsRoot()).eql('/efs');
            expect('./efs/'.ensureEfsRoot()).eql('/efs');
        });

        it(`should add /efs to start of relative paths (i.e. with no preceding /). e.g. a/1/b -> /efs/a/1/b`, function () {
            expect('asdf/123'.ensureEfsRoot()).eql('/efs/asdf/123');
        });

        // Reason: the frontend can send up paths preceded by / that actually start with /efs. The
        // file NE navigator isn't allowed to access any directories outside /efs, so this is a safe assumption.
        it(`should add /efs to start of seemingly "absolute" paths (i.e. with preceding /). e.g. /a/1/b -> /efs/a/1/b`, function () {
            expect('/asdf/123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
        });

        it(`should remove trailing slashes from paths`, function () {
            expect('/efs/asdf/123/'.ensureEfsRoot()).eql('/efs/asdf/123');
        });

        it(`should remove duplicate slashes from paths`, function () {
            // One double-slash
            expect('/efs/asdf/123//afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs/asdf//123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('//efs/asdf/123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs/asdf/123/afa//'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('efs/asdf/123/afa//'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('efs//asdf/123/afa/'.ensureEfsRoot()).eql('/efs/asdf/123/afa');

            // Multiple double-slashes
            expect('/efs/asdf//123//afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs//asdf//123//afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('//efs/asdf//123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('//efs//asdf//123//afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('//efs/asdf/123/afa//'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs//asdf//123//afa//'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('//efs//asdf//123//afa//'.ensureEfsRoot()).eql('/efs/asdf/123/afa');

            // Multiple double-slashes, no preceding /
            expect('efs/asdf//123//afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('efs//asdf//123//afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('efs/asdf/123/afa//'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('efs//asdf//123//afa//'.ensureEfsRoot()).eql('/efs/asdf/123/afa');

            // Triple-or-more duplicate slashes
            expect('/efs/asdf///123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('///efs/asdf/123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs/asdf/123/afa///'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('///efs///asdf///123///afa///'.ensureEfsRoot()).eql('/efs/asdf/123/afa');

            expect('/efs/asdf//////123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('//////////efs/asdf/123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs/asdf/123/afa//////////'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/////efs/asdf/123/afa//////////'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs/////asdf///123//afa//////////'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('////efs//asdf/123/////afa////'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
        });

        it(`should remove duplicate "efs" paths from start of path`, function () {
            expect('/efs/efs/asdf/123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('efs/efs/asdf/123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('efs/efs/efs/efs/efs/efs/asdf/123/afa'.ensureEfsRoot()).eql('/efs/asdf/123/afa');
            expect('/efs/efs/efs/efs/efs/efs/asdf/123/afa'.ensureEfsRoot()).eql(
                '/efs/asdf/123/afa'
            );
        });

        it(`should leave folders after the start of the path with efs in the name`, function () {
            expect('/efs/asdf/123/efs/afa'.ensureEfsRoot()).eql('/efs/asdf/123/efs/afa');
            expect('/efs/asdf/123/efs/afa'.ensureEfsRoot()).eql('/efs/asdf/123/efs/afa');
            expect('/efs/asdf/123/efsafa'.ensureEfsRoot()).eql('/efs/asdf/123/efsafa');
            expect('/efs/asdf/123/efsafa/zzz'.ensureEfsRoot()).eql('/efs/asdf/123/efsafa/zzz');
        });
    });
});
