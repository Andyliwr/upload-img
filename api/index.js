import user from './user'
import file from './file'
import history from './history'

export default function (router) {
    user(router)
    file(router)
    history(router)
}

