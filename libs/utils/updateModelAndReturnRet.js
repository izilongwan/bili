const { COMMON } = require('../codeInfo')

exports.updateModelAndReturnRet = async (Model, updateData, conf) => {
  const ret = await Model.update(updateData, conf)

  return ret[0] === 1
    ? { ...COMMON.SUCCESS, data: await Model.findOne(conf) }
    : COMMON.UPDATE_ERROR
}
