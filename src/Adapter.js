import BaseAdapter from '@sanity/block-content-to-tree'
import builtInHandlers from './type-handlers'

const baseAdapter = new BaseAdapter()


class Adapter {

  constructor(options = {}) {
    const customTypeHandlers = options.customTypeHandlers || {}
    this.typeHandlers = {
      ...builtInHandlers(options.blockTypeHandlers || {}),
      ...customTypeHandlers
    }
  }

  parse(data) {
    const base = baseAdapter.parse(data)
    if (Array.isArray(base)) {
      return base.map(single => {
        return this.parseSingle(single)
      }).join('\n')
    }
    return this.parseSingle(base)
  }

  parseSingle(data) {
    if (this.typeHandlers[data.type]) {
      return this.typeHandlers[data.type](data)
    }
    // Fallback
    return this.typeHandlers.unhandledBlock(data)
  }

}

export default Adapter
