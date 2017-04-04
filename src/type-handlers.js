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
      const contentHandler = typeHandlers[item.type] || typeHandlers.text
      output += listHandlers.listItem(item).replace('{content}', contentHandler(item))
    }
  })
  return output
}

function attributesToHeadAndTail(attributes, spanHandlers) {
  let head = ''
  let tail = ''
  Object.keys(attributes).forEach(aKey => {
    // If there is a registered handler for this attribute
    if (spanHandlers[aKey]) {
      const wrappedContent = spanHandlers[aKey](attributes[aKey]).split('{content}')
      head += wrappedContent[0] || ''
      tail = (wrappedContent[1] || '') + tail
    } else {
    // Output a comment with metainfo
      const primitive = isPrimitive(attributes[aKey])
      const metaValue = primitive
        ? attributes[aKey]
        : JSON.stringify(attributes[aKey]).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
      head += `<span data-unhandled-attribute-name="${aKey}" data-unhandled-attribute-value="${metaValue}" />`
      tail = ''
    }
  })
  return {
    head: head,
    tail: tail
  }
}

export default function (contentHandlers = {}) {

  const blockHandlers = {
    normal: node => {
      return '<p>{content}</p>'
    },
    ...contentHandlers.block || {}
  }

  const spanHandlers = {
    link: attributes => {
      return `<a href="${attributes.href}">{content}</a>`
    },
    ...contentHandlers.span || {}
  }

  const listHandlers = {
    number: node => {
      return '<ol>{content}</ol>'
    },
    bullet: node => {
      return '<ul>{content}</ul>'
    },
    listItem: node => {
      return '<li>{content}</li>'
    },
    ...contentHandlers.list || {}
  }

  const typeHandlers = {

    block: node => {
      if (blockHandlers[node.style]) {
        return blockHandlers[node.style](node).replace('{content}', getContent(node.content, typeHandlers))
      }
      return `<${node.style}>${getContent(node.content, typeHandlers)}</${node.style}>`
    },

    list: node => {
      if (listHandlers[node.itemStyle]) {
        return listHandlers[node.itemStyle](node)
          .replace('{content}', getListItems(node.items, listHandlers, typeHandlers))
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
      if (node.attributes) {
        const attrHeadAndTail = attributesToHeadAndTail(node.attributes, spanHandlers)
        head += attrHeadAndTail.head
        tail = attrHeadAndTail.tail + tail
      }
      return `${head}${getContent(node.content, typeHandlers)}${tail}`
    },
    object: node => {
      const {head, tail} = attributesToHeadAndTail(node.attributes, spanHandlers)
      return `${head}${tail}`
    }
  }

  return typeHandlers
}
