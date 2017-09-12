const BlockContentToTree = require('@sanity/block-content-to-tree')
const builtInHandlers = require('./type-handlers')
const escapeHtml = require('./escapeHtml')

const blockContentToTree = new BlockContentToTree()

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
    const base = blockContentToTree.convert(data)
    if (Array.isArray(base)) {
      return base.map(single => {
        return parseSingle(single, this.typeHandlers)
      }).join('\n')
    }
    return parseSingle(base, this.typeHandlers)
  }

}

module.exports = BlockContentToHtml
