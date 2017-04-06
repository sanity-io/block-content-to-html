import BaseAdapter from '@sanity/block-content-to-tree'
import builtInHandlers from './type-handlers'
import escapeHtml from './escapeHtml'

const baseAdapter = new BaseAdapter()

function parseSingle(data, typeHandlers) {
  if (typeHandlers[data.type]) {
    return typeHandlers[data.type](data)
  }
  throw new Error(`Don't know how to handle type '${data.type}'`)
}

class BlockContentToHtml {

  static escapeHtml(unsafe) {
    return escapeHtml(unsafe)
  }

  constructor(options = {}) {
    const customTypeHandlers = options.customTypeHandlers || {}
    this.typeHandlers = {
      ...builtInHandlers(options.blockTypeHandlers || {}),
      ...customTypeHandlers
    }
  }

  convert(data) {
    const base = baseAdapter.parse(data)
    if (Array.isArray(base)) {
      return base.map(single => {
        return parseSingle(single, this.typeHandlers)
      }).join('\n')
    }
    return parseSingle(base, this.typeHandlers)
  }

}

export default BlockContentToHtml