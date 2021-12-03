exports.CacheStore = class {

  store = {}
  ts = -1

  setItem(key, value, ts = this.ts) {
    const data = {
      value,
      ts: ts >= 0 
        ? Date.now() + ts 
        : -1,
    }

    try {
      return Reflect.set(this.store, key, JSON.stringify(data))
    }
    catch (error) {
      return false
    }
  }

  getItem (key) {
    const { value, ts } = JSON.parse(Reflect.get(this.store, key) || '{}')

    // 不存在key对应的值
    if (value == null || !ts) {
      return null
    }

    // 未过期 || 永不过期
    if (ts > Date.now() || ts === -1) {
      return value
    }

    // 过期、删除
    return this.removeItem(key)
  }

  removeItem(key) {
    return Reflect.deleteProperty(this.store, key)
  }
}
