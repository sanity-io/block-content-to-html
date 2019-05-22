const blocksToHyperScript = require('@sanity/hyperscript-portabletext')

const h = blocksToHyperScript.renderNode
const blocksToHtml = options => {
  const rootNode = blocksToHyperScript(options)
  return rootNode.outerHTML || rootNode
}

blocksToHtml.defaultSerializers = blocksToHyperScript.defaultSerializers
blocksToHtml.getImageUrl = blocksToHyperScript.getImageUrl
blocksToHtml.renderNode = h
blocksToHtml.h = h

module.exports = blocksToHtml
