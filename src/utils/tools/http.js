import axios from 'axios'

export const asyncFunc = async (fn) => {
	const ret = {}

  try {
		const { data: { retBody = {}, retCode, retMsg } } = await fn();

		if (retCode !== 0) {
			return [true, { code: retCode, msg: retMsg }]
		}

		for (const key in retBody) {
			if (Object.hasOwnProperty.call(retBody, key)) {
				const { retBody: body = {}, retCode, retMsg } = retBody[key];

				if (retCode !== 0) {
					ret[key] = [true, { code: retCode, msg: retMsg }]
					continue
				}

				const { code, msg, data } = body

				ret[key] = [code !== 0, { code, msg, data }]
			}
		}

    return [null, ret]
  } catch (error) {
    error.message && (error.msg = error.message)
    return [true, error];
  }
}

export const http = async (...args) => asyncFunc(() => axios(...args))
