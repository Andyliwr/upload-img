import { History } from '../models'

export default function (router) {
  router.post('/api/history', async (ctx, next) => {
    ctx.body = { a: 1 }
  })
}
