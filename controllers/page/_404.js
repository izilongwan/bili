const { CONF } = require('../../config')

module.exports = async (ctx) => {
  const { notFound } = CONF;

  await ctx.render('notFound', {
    CONF: notFound,
  });
}
