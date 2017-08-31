const expect = require('chai').expect;

import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

describe('handlebars templating engine works', () => {
  it('should generate correct javascript', () => {
    const templateName = 'handlebars-test.template';
    const fileName = path.join(
      process.cwd(),
      'src',
      '__tests__',
      'templates',
      templateName
    );

    const source = fs.readFileSync(fileName, 'utf8');
    const template = handlebars.compile(source);
    const data = {
      users: [{ name: 'tmeasday' }, { name: 'lacker' }, { name: 'tobkle' }]
    };
    const result = template(data);

    expect(result).to.equal(`console.log("tmeasday");
console.log("lacker");
console.log("tobkle");
`);
  });
});
