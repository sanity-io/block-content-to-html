const objectHandlers = {
  link: object => {
    return {
      head: `<a href="${object.href}">`,
      tail: '</a>'
    }
  }
}

const textHandlers = {
  normal: node => {
    return '<p>{text}</p>'
  }
}

const typeHandlers = {}

function getContent(content) {
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

function attributesToHeadAndTail(attributes) {
  let head = ''
  let tail = ''
  Object.keys(attributes).forEach(aKey => {
    if (objectHandlers[aKey]) {
      const handled = objectHandlers[aKey](attributes[aKey])
      head += handled.head
      tail = handled.tail + tail
    } else {
      const isString = typeof attributes[aKey] === 'string'
      const debugValue = isString
        ? attributes[aKey]
        : JSON.stringify(attributes[aKey]).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')
      head += `<span data-object-name="${aKey}" data-object-value="${debugValue}">`
      if (isString) {
        head += debugValue
      }
      tail = `</span>${tail}`
    }
  })
  return {
    head: head,
    tail: tail
  }
}

typeHandlers.block = node => {
  if (textHandlers[node.style]) {
    return textHandlers[node.style](node).replace('{text}', getContent(node.content))
  }
  return `<span>${getContent(node.content)}</span>`
}

typeHandlers.span = node => {
  let head = ''
  let tail = ''
  if (node.mark) {
    head += `<${node.mark}>`
    tail = `</${node.mark}>`
  }
  if (node.attributes) {
    const attrHeadAndTail = attributesToHeadAndTail(node.attributes, head, tail)
    head += attrHeadAndTail.head
    tail = attrHeadAndTail.tail + tail
  }
  return `${head}${getContent(node.content)}${tail}`
}

typeHandlers.object = node => {
  const {head, tail} = attributesToHeadAndTail(node.attributes)
  return `${head}${tail}`
}

export default function (customNodeHandlers = {}) {
  Object.assign(objectHandlers, customNodeHandlers.object || {})
  Object.assign(textHandlers, customNodeHandlers.text || {})
  return typeHandlers
}
