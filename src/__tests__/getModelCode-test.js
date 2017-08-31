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
  TEST_MODEL,
  TEST_EXPECTED_CODE,
  TEST_GENERATED_CODE,
  TEST_MODEL_EXTENSION,
  TEST_MODEL_EXTENSION2,
  ENCODING,
  TEMPLATES_DIR,
  TEMPLATES_MODEL_DIR,
  TEMPLATES_DEFAULT_DIR,
  TEMPLATES_AUTH_DIR
} from '../constants';

const expect = require('chai').expect;
let gqlFiles;
let modelFiles;
let gqlFilesSources = {};
let modelFilesSources = {};
let generatedFiles = [];

describe('getmodelCode', () => {
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

    // read all *.model.js files in expectedCode directory
    const modelPath = path.join(
      SRC_DIR,
      TEST_DIR,
      TEST_CODE,
      TEST_MODEL,
      TEST_EXPECTED_CODE
    );
    modelFiles = fs
      .readdirSync(modelPath, ENCODING)
      .filter(
        file =>
          path.extname(file) === TEST_MODEL_EXTENSION &&
          path.basename(file).split('.')[1] === TEST_MODEL_EXTENSION2
      )
      .sort();
    modelFiles.forEach(file => {
      const filePath = path.join(
        SRC_DIR,
        TEST_DIR,
        TEST_CODE,
        TEST_MODEL,
        TEST_EXPECTED_CODE,
        file
      );
      const source = fs.readFileSync(filePath, ENCODING);
      modelFilesSources[file] = source;
    });

    done();
  }); // before

  it('should have equal number of files: ".graphql" and ".model.js"', () => {
    const gqlFilesCount = gqlFiles.length;
    const modelFilesCount = modelFiles.length;
    expect(gqlFilesCount).to.not.equal(0);
    expect(gqlFilesCount).to.equal(modelFilesCount);
  });

  it('generated model code files should be equal to expected files', done => {
    gqlFiles.forEach(gqlFile => {
      const modelFileName =
        path.basename(gqlFile, TEST_GQL_EXTENSION) +
        '.' +
        TEST_MODEL_EXTENSION2 +
        TEST_MODEL_EXTENSION;

      // generate model code from .graphql file
      const gqlSource = gqlFilesSources[gqlFile];
      const inputSchema = parse(gqlSource);
      const generatedSource = getCode({
        inputSchema,
        basePath: [TEMPLATES_DIR, TEMPLATES_MODEL_DIR, TEMPLATES_DEFAULT_DIR],
        authPath: [TEMPLATES_DIR, TEMPLATES_MODEL_DIR, TEMPLATES_AUTH_DIR]
      });
      const generateFilename = path.join(
        SRC_DIR,
        TEST_DIR,
        TEST_CODE,
        TEST_MODEL,
        TEST_GENERATED_CODE,
        modelFileName
      );
      fs.writeFileSync(generateFilename, generatedSource, ENCODING);
      generatedFiles.push(generateFilename);
      // the code can be parsed
      const parsedGeneratedCode = parseCode(generatedSource);
      expect(parsedGeneratedCode, generateFilename).to.not.equal({});

      // get original model code from .model.js file for comparison
      const expectedSource = modelFilesSources[modelFileName];

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
}); // describe getModelCode
