const pt = require('puppeteer');

const crawler = async (options) => {

  const launchConfig = {
    timeout: 10 * 60 * 1000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }

  const bs = await pt.launch(launchConfig),
        pg = await bs.newPage(),
        { url, callback } = options;

  await pg.goto(url, {
    timeout: 30 * 1000,
    waitUtil: 'networkidel2'
  })

  const result = await pg.evaluate(callback);

  await bs.close();

  process.send(result);

  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

module.exports = crawler;
