let _store = {}

const set = (key, val) =>_store[key] = val
const get = key => _store[key]
const clear = () => _store = null

module.exports = { set, get, clear }