module.exports = {
  COMMON: {
    OPERATE_DATABASE_ERROR: {
      code: -2,
      msg: 'Operate database error'
    },
    SUCCESS: {
      code: 0,
      msg: 'success'
    },
    INVALID_PARAMS: {
      code: 1100,
      msg: 'The params is invalid'
    },
    ACCOUNT_EXISTS: {
      code: 1101,
      msg: 'The account exists'
    },
    ADD_ACCOUNT_FAILED: {
      code: 1102,
      msg: 'Create account failed'
    },
    INVALID_ACCOUNT_OR_PASSWORD: {
      code: 1103,
      msg: 'The account or password is invalid'
    },
    INVALID_CAPTCHA: {
      code: 1104,
      msg: 'The captcha is invalid'
    },
    DATA_NOT_FOUND: {
      code: 1106,
      msg: 'The data is not found'
    },
    UPDATE_ERROR: {
      code: 1106,
      msg: 'Update data error'
    },
    FIELD_NOT_EXIST: {
      code: 1107,
      msg: 'The field doesn\'t exist'
    },
    MODELS_NOT_EXIST: {
      code: 1108,
      msg: 'The model doesn"t exist'
    },
    DATA_QUERY_ERROR: {
      code: 1109,
      msg: 'The data query error'
    },
    CRAWLER_DATA_DOING: {
      code: 1110,
      msg: 'The crawling data now'
    }
  },

  ENTRY: {
    MODULE_NOT_EXIST: {
      retCode: 2001,
      retMsg: 'The module doesn"t exist'
    },
    METHOD_NOT_EXIST: {
      retCode: 2002,
      retMsg: 'The method doesn"t exist'
    },
    NOU_LOGIN: {
      retCode: -1,
      retMsg: 'You are not logged'
    },
    SUCCESS: {
      retCode: 0,
      retMsg: 'Success'
    }
  }
}
