function isPrimitive(val) {
  const type = typeof val
  return val === null || (type !== 'object' && type !== 'function')
}

function getContent(content, typeHandlers) {
  let output = ''
  content.forEach(item => {
    if (typeof item === 'string') {
      output += item
    } else {
      const handler = typeHandlers[item.type] || typeHandlers.text
      output += handler(item)
    }
  })
  return output
}

function getListItems(items, listHandlers, typeHandlers) {
  let output = ''
  items.forEach(item => {
    if (typeof item === 'string') {
      output += item
    } else {
      const contentHandler = typeHandlers[item.type] || typeHandlers.textBlock
      item.children = contentHandler(item)
      output += listHandlers.listItem(item)
    }
  })
  return output
}

export default function (blockTypeHandlers = {}) {

  const blockHandlers = {
    normal: node => {
      return `<p>${node.children}</p>`
    },
    ...blockTypeHandlers.textBlock || {}
  }

  const listHandlers = {
    number: node => {
      return `<ol>${node.children}</ol>`
    },
    bullet: node => {
      return `<ul>${node.children}</ul>`
    },
    listItem: node => {
      return `<li>${node.children}</li>`
    },
    ...blockTypeHandlers.listBlock || {}
  }

  const typeHandlers = {

    block: node => {
      if (blockHandlers[node.style]) {
        node.children = getContent(node.content, typeHandlers)
        return blockHandlers[node.style](node)
      }
      return `<${node.style}>${getContent(node.content, typeHandlers)}</${node.style}>`
    },

    list: node => {
      if (listHandlers[node.itemStyle]) {
        node.children = getListItems(node.items, listHandlers, typeHandlers)
        return listHandlers[node.itemStyle](node)
      }
      return `<ul>${getListItems(node.items, listHandlers, typeHandlers)}</ul>`
    },

    span: node => {
      let head = ''
      let tail = ''
      if (node.mark) {
        head += `<${node.mark}>`
        tail = `</${node.mark}>`
      }
      node.children = getContent(node.content, typeHandlers)
      if (blockTypeHandlers.span) {
        return `${head}${blockTypeHandlers.span(node)}${tail}`
      } else if (node.attributes && node.attributes.link) {
        // Deal with the default block editor setup 'link' attribute
        head += `<a href="${node.attributes.link.href}">`
        tail = `</a>${tail}`
      }
      return `${head}${getContent(node.content, typeHandlers)}${tail}`
    },
    unhandledBlock: node => {
      let result = ''
      Object.keys(node.attributes).forEach(aKey => {
        // Output a comment with metainfo
        const primitive = isPrimitive(node.attributes[aKey])
        const metaValue = primitive
          ? node.attributes[aKey]
          : JSON.stringify(node.attributes[aKey]).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
        result += `<div data-unhandled-attribute-name="${aKey}" data-unhandled-attribute-value="${metaValue}" />`
      })
      return result
    }
  }

  return typeHandlers
}
