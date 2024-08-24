import type { NightwatchAPI } from 'nightwatch';

describe('My First Test', function () {
  before((browser: NightwatchAPI) => {
    browser.init();
  });

  it('visits the app root url', function () {
    browser.assert.textContains('.green', 'You did it!');
  });

  after((browser: NightwatchAPI) => browser.end());
});
