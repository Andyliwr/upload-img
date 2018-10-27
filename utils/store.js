const Redis = require("ioredis")
const config = require('../config')
const { Store } = require("koa-session2")

class RedisStore extends Store {
  constructor() {
    super();
    this.redis = new Redis({
      port: config.redis_port, // Redis port
      host: config.redis_host, // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: config.redis_pass
    })
  }

  async get(sid, ctx) {
    let data = await this.redis.get(`SESSION:${sid}`)
    return JSON.parse(data)
  }

  async set(session, { sid = this.getID(24), maxAge = 1000000 } = {}, ctx) {
    try {
      // Use redis set EX to automatically drop expired sessions
      await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000)
    } catch (e) {
      console.warn(e)
    }
    return sid
  }

  async destroy(sid, ctx) {
    return await this.redis.del(`SESSION:${sid}`)
  }
}

module.exports = RedisStore
