/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />

/*------------------------------------- THIRD-PARTY MODULES --------------------------------------*/
import {expect} from 'chai';

import fs from 'fs';
import path from 'path';

/*---------------------------------- IMPORT FILES TO BE TESTED -----------------------------------*/
import {nodeModuleBoilerplate} from '../index';

/*-------------------------------------------- TESTS ---------------------------------------------*/
describe(`nodeModuleBoilerplate`, function() {
    it(`exists`, function() {
        expect(nodeModuleBoilerplate).to.exist;
    });
    it(`is an object`, function() {
        expect(nodeModuleBoilerplate).to.be.an(`object`);
    });
    it(`has property called placeholder, containing string 'placeholder'`, function() {
        expect(nodeModuleBoilerplate.placeholder).to.eql(`placeholder`);
    });
    it(`nodeModuleBoilerplate.placeholderFn throws if run`, function() {
        expect(nodeModuleBoilerplate.placeholderFn).to.throw(Error);
    });
});
