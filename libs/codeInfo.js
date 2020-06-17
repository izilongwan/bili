module.exports = {
  COMMON: {
    EMPTY_VALUE: {
      code: 10001,
      msg: 'The account or password is empty'
    },
    INVALID_ACCOUNT: {
      code: 10002,
      msg: 'The account is invalid'
    },
    NOT_EXIST: {
      code: 10003,
      msg: 'The user doesn\'t exist'
    },
    INVALID_ACCOUT_LENGTH: {
      code: 10004,
      msg: 'The account length is 5'
    },
    INVALID_PASSWORD_LENGTH: {
      code: 10005,
      msg: 'The password length is 5-20'
    },
    UNLOGIN_STATUS: {
      code: 10006,
      msg: 'This is unlogin status'
    },
    NO_DATA: {
      code: 10007,
      msg: 'The isn\'t data in database'
    },
    EMPTY_API_ANME: {
      code: 10008,
      msg: 'The api_name is empty'
    },
    INVALID_API_ANME: {
      code: 10009,
      msg: 'The api_name is invalid'
    },
    EMPTY_KW: {
      code: 10010,
      msg: 'The kw is invalid'
    },
    INVALID_KW: {
      code: 10011,
      msg: 'The kw is invalid'
    },
    LOGIN_STATUS: {
      code: 0,
      msg: 'This is login status'
    },
    LOGOUT_SUCCESS: {
      code: 0,
      msg: 'Logout success'
    }
  },

  LOGIN: {
    COMPARE_ERR: {
      code: 20001,
      msg: 'The account and password is not match'
    },
    SUCCESS: {
      code: 0,
      msg: 'Login success'
    }
  },

  REGISTER: {
    EXIST_ACCOUNT: {
      code: 30001,
      msg: 'The account has been exist'
    },
    SUCCESS: {
      code: 0,
      msg: 'Register success'
    }
  },

  CRAWLER: {
    FAILED: {
      code: 40001,
      msg: 'Crawl failed'
    },
    NOTHING: {
      code: 40002,
      msg: 'It is nothing in crawling'
    },
    EMPTY_API_ANME: {
      code: 40003,
      msg: 'The api_name is empty'
    },
    INVALID_API_ANME: {
      code: 40004,
      msg: 'The api_name is invalid'
    },
    SUCCESS_ONE: {
      code: 0,
      msg: 'Crawl data success'
    },
    SUCCESS_ALL: {
      code: 0,
      msg: 'Crawl all data success'
    },
    SUCCESS_TIME: {
      code: 0,
      msg: 'Crawl time update success'
    }
  },

  INDEX: {
    EMPTY_API_NAME: {
      code: 50001,
      msg: 'The api_name is empty'
    },
    INVALID_API_NAME: {
      code: 50002,
      msg: 'The api_name is invalid'
    },
    EMPTY_C_ID: {
      code: 50003,
      msg: 'The c_id is empty'
    },
    INVALID_C_ID: {
      code: 50004,
      msg: 'The c_id is invalid'
    },
    EMPTY_STATUS: {
      code: 50005,
      msg: 'The status is empty'
    },
    INVALID_STATUS: {
      code: 50006,
      msg: 'The status is invalid'
    },
    EMPTY_FIELD: {
      code: 50007,
      msg: 'The field is empty'
    },
    SUCCESS_GET: {
      code: 0,
      msg: 'The data get success'
    },
    SUCCESS_UPDATE_STATUS: {
      code: 0,
      msg: 'The data status update success'
    },
    SUCCESS_UPDATE_FIELD: {
      code: 0,
      msg: 'The data field update success'
    }
  }
}
