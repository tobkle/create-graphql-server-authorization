/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { parse } from 'graphql';
import { parseCode } from '../utilities';
import { getCode } from '../generator/getCode';

import {
  SRC_DIR,
  TEST_DIR,
  TEST_GQL_DATA,
  TEST_GQL_EXTENSION,
  TEST_CODE,
  TEST_RESOLVER,
  TEST_EXPECTED_CODE,
  TEST_GENERATED_CODE,
  TEST_RESOLVER_EXTENSION,
  TEST_RESOLVER_EXTENSION2,
  ENCODING,
  TEMPLATES_DIR,
  TEMPLATES_RESOLVER_DIR,
  TEMPLATES_DEFAULT_DIR,
  TEMPLATES_AUTH_DIR
} from '../constants';

const expect = require('chai').expect;
let gqlFiles;
let resolverFiles;
let gqlFilesSources = {};
let resolverFilesSources = {};
let generatedFiles = [];

describe('getCode Resolver', () => {
  before(done => {
    // read all *.graphql files test data directory
    const gqlPath = path.join(SRC_DIR, TEST_DIR, TEST_GQL_DATA);
    gqlFiles = fs
      .readdirSync(gqlPath, ENCODING)
      .filter(file => path.extname(file) === TEST_GQL_EXTENSION)
      .sort();
    gqlFiles.forEach(file => {
      const filePath = path.join(SRC_DIR, TEST_DIR, TEST_GQL_DATA, file);
      const source = fs.readFileSync(filePath, ENCODING);
      gqlFilesSources[file] = source;
    });

    // read all *.resolver.js files in expectedCode directory
    const resolverPath = path.join(
      SRC_DIR,
      TEST_DIR,
      TEST_CODE,
      TEST_RESOLVER,
      TEST_EXPECTED_CODE
    );
    resolverFiles = fs
      .readdirSync(resolverPath, ENCODING)
      .filter(
        file =>
          path.extname(file) === TEST_RESOLVER_EXTENSION &&
          path.basename(file).split('.')[1] === TEST_RESOLVER_EXTENSION2
      )
      .sort();
    resolverFiles.forEach(file => {
      const filePath = path.join(
        SRC_DIR,
        TEST_DIR,
        TEST_CODE,
        TEST_RESOLVER,
        TEST_EXPECTED_CODE,
        file
      );
      const source = fs.readFileSync(filePath, ENCODING);
      resolverFilesSources[file] = source;
    });

    done();
  }); // before

  it('should have equal number of files: ".graphql" and ".resolver.js"', () => {
    const gqlFilesCount = gqlFiles.length;
    const resolverFilesCount = resolverFiles.length;
    expect(gqlFilesCount).to.not.equal(0);
    expect(gqlFilesCount).to.equal(resolverFilesCount);
  });

  it('generated resolver code files should be equal to expected files', done => {
    gqlFiles.forEach(gqlFile => {
      const resolverFileName =
        path.basename(gqlFile, TEST_GQL_EXTENSION) +
        '.' +
        TEST_RESOLVER_EXTENSION2 +
        TEST_RESOLVER_EXTENSION;

      // generate resolver code from .graphql file
      const gqlSource = gqlFilesSources[gqlFile];
      const inputSchema = parse(gqlSource);
      const generatedSource = getCode({
        inputSchema,
        basePath: [
          TEMPLATES_DIR,
          TEMPLATES_RESOLVER_DIR,
          TEMPLATES_DEFAULT_DIR
        ],
        authPath: [TEMPLATES_DIR, TEMPLATES_RESOLVER_DIR, TEMPLATES_AUTH_DIR]
      });
      const generateFilename = path.join(
        SRC_DIR,
        TEST_DIR,
        TEST_CODE,
        TEST_RESOLVER,
        TEST_GENERATED_CODE,
        resolverFileName
      );
      fs.writeFileSync(generateFilename, generatedSource, ENCODING);
      generatedFiles.push(generateFilename);
      // the code can be parsed
      const parsedGeneratedCode = parseCode(generatedSource);
      expect(parsedGeneratedCode, generateFilename).to.not.equal({});

      // get original resolver code from .resolver.js file for comparison
      const expectedSource = resolverFilesSources[resolverFileName];

      // compare AST of both sources
      expect(generatedSource, generateFilename).to.deep.equal(expectedSource);
    });
    done();
  });

  after(done => {
    console.log('\n    Summary:\n    ========');
    generatedFiles.forEach(file => console.log('    Generated file: ', file));
    done();
  });
}); // describe getResolverCode
