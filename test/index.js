import fs from 'fs';
import path from 'path';
import chai from 'chai';

const expect = require('chai').expect;
const indexFile = 'dist/index.js';
chai.use(require('chai-fs'));

describe('index', function() {
  it('should return an object with with all functions', function() {
    const ls = fs.readdirSync(`${process.cwd()}/dist/lib`);
    ls.forEach((filename, index) => {
      const file = path.parse(filename);
      if (file.ext === '.js'){
        let objectName = file.name;
        let objectNameRegEx = new RegExp(`${objectName}`, "g");
        expect(indexFile).to.have.content.that.match(objectNameRegEx, `${objectName} must be in dist/index.js file`);
      }
    });
  });
});