import BaseAdapter from '@sanity/block-content-adapter'
import builtInHandlers from './type-handlers'

const baseAdapter = new BaseAdapter()


class Adapter {

  constructor(options = {}) {
    const customTypeHandlers = options.customTypeHandlers || {}
    this.typeHandlers = Object.assign(
      {},
      builtInHandlers(options.customNodeHandlers),
      customTypeHandlers
    )
  }

  parse(data) {
    const base = baseAdapter.parse(data)
    if (this.typeHandlers[base.type]) {
      return this.typeHandlers[base.type](base)
    }
    return this.typeHandlers.object(base)
  }

}

export default Adapter
