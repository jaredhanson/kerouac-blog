var chai = require('chai');

global.expect = chai.expect;

chai.use(require('chai-kerouac-handler'));
chai.use(require('chai-kerouac-mapper'));
