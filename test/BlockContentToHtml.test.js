/* eslint-disable id-length */

import {test} from 'tap'
import BlockContentToHtml from '../src/BlockContentToHtml.js'

const blockContentToHtml = new BlockContentToHtml()
const myBlockContentToHtml = new BlockContentToHtml(
  {
    customTypeHandlers: {
      author: node => {
        return `<div>${node.attributes.name}</div>`
      }
    },
    blockTypeHandlers: {
      marks: {
        em: null
      },
      listBlock: {
        number: node => {
          return `<ol class="foo">${node.children}</ol>`
        },
        listItem: node => {
          return `<li class="foo">${node.children}</li>`
        }
      },
      textBlock: {
        normal: node => {
          return `<p class="foo">${node.children}</p>`
        },
        h2: node => {
          return `<div class="big-heading" id="${node.extra}">${node.children}</div>`
        }
      },
      span: node => {
        let result = ''
        if (node.attributes.author) {
          result = `<div>${node.attributes.author.name}</div>`
        }
        if (node.attributes.link) {
          result += `<a class="foo" href="${node.attributes.link.href}">${node.children}</a>`
        }
        if (Object.keys(node.attributes).length === 0) {
          result = node.children
        }
        return result
      }
    }
  }
)

test('handles a plain string block', {todo: false}, t => {
  const input = require('./fixtures/plain-text.json')
  const expected = '<p>Normal string of text.</p>'
  const got = blockContentToHtml.convert(input)
  t.same(got, expected)
  t.end()
})

test('handles a plain string block with custom adapter', {todo: false}, t => {
  const input = require('./fixtures/plain-text.json')
  const expected = '<p class="foo">Normal string of text.</p>'
  const got = myBlockContentToHtml.convert(input)
  t.same(got, expected)
  t.end()
})

test('handles italicized text', {todo: false}, t => {
  const input = require('./fixtures/italicized-text.json')
  const expected = '<p>String with an <em>italicized</em> word.</p>'
  const got = blockContentToHtml.convert(input)
  t.same(got, expected)
  t.end()
})

test('handles italicized text with custom adapter and removes the em mark if mapped to null', {todo: false}, t => {
  const input = require('./fixtures/italicized-text.json')
  const expected = '<p class="foo">String with an italicized word.</p>'
  const got = myBlockContentToHtml.convert(input)
  t.same(got, expected)
  t.end()
})


test('handles underline text', {todo: false}, t => {
  const input = require('./fixtures/underlined-text.json')
  const expected = '<p>String with an <underline>underlined</underline> word.</p>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('handles bold-underline text', {todo: false}, t => {
  const input = require('./fixtures/bold-underline-text.json')
  const expected = '<p>Plain<strong>only-bold<underline>bold-and-underline</underline></strong><underline>only-underline</underline>plain</p>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('does not care about span marks order', {todo: false}, t => {
  const orderedInput = require('./fixtures/marks-ordered-text.json')
  const reorderedInput = require('./fixtures/marks-reordered-text.json')
  const expected = '<p>Plain<strong>strong<underline>strong and underline<em>strong and underline and emphasis</em></underline></strong>'
    + '<em><underline>underline and emphasis</underline></em>plain again</p>'
  t.same(blockContentToHtml.convert(orderedInput), expected)
  t.same(blockContentToHtml.convert(reorderedInput), expected)
  t.end()
})


test('handles a messy text', {todo: false}, t => {
  const input = require('./fixtures/messy-text.json')
  const expected = '<p>Hacking <code>teh codez</code> is <strong>all <underline>fun</underline>'
    + ' and <em>games</em> until</strong> someone gets p0wn3d.</p>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('handles simple link text', {todo: false}, t => {
  const input = require('./fixtures/link-simple-text.json')
  const expected = '<p>String before link <a href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('handles simple link text with custom adapter', {todo: false}, t => {
  const input = require('./fixtures/link-simple-text.json')
  const expected = '<p class="foo">String before link <a class="foo" href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p>'
  t.same(myBlockContentToHtml.convert(input), expected)
  t.end()
})

test('handles simple link text with several attributes with custom adapter', {todo: false}, t => {
  const input = require('./fixtures/link-author-text.json')
  const expected = '<p class="foo">String before link <div>Test Testesen</div>'
    + '<a class="foo" href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p>'
  t.same(myBlockContentToHtml.convert(input), expected)
  t.end()
})


test('handles messy link text', {todo: false}, t => {
  const input = require('./fixtures/link-messy-text.json')
  const expected = '<p>String with link to <a href="http://icanhas.cheezburger.com/">internet </a>'
    + '<em><strong><a href="http://icanhas.cheezburger.com/">is very strong and emphasis</a></strong>'
    + '<a href="http://icanhas.cheezburger.com/"> and just emphasis</a></em>.</p>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('handles a numbered list', {todo: false}, t => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected = '<ol><li><p>One</p></li><li><p>Two has <strong>bold</strong> word</p></li><li><p>Three</p></li></ol>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('handles a numbered list with custom content adapter', {todo: false}, t => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected = '<ol class="foo"><li class="foo"><p class="foo">One</p></li>'
    + '<li class="foo"><p class="foo">Two has <strong>bold</strong> word</p></li>'
    + '<li class="foo"><p class="foo">Three</p></li></ol>'
  t.same(myBlockContentToHtml.convert(input), expected)
  t.end()
})


test('handles a bulleted list', {todo: false}, t => {
  const input = require('./fixtures/list-bulleted-blocks.json')
  const expected = '<ul><li><p>I am the most</p></li><li><p>expressive<strong>programmer</strong>you know.</p>'
    + '</li><li><p>SAD!</p></li></ul>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('handles multiple lists', {todo: false}, t => {
  const input = require('./fixtures/list-both-types-blocks.json')
  const expected = '<ul><li><p>A single bulleted item</p></li></ul>\n'
    + '<ol><li><p>First numbered</p></li><li><p>Second numbered</p></li></ol>\n'
    + '<ul><li><p>A bullet with<strong>something strong</strong></p></li></ul>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})

test('handles a plain h2 block', {todo: false}, t => {
  const input = require('./fixtures/h2-text.json')
  const expected = '<h2>Such h2 header, much amaze</h2>'
  t.same(blockContentToHtml.convert(input), expected)
  t.end()
})


test('handles a plain h2 block with custom adapter', {todo: false}, t => {
  const input = require('./fixtures/h2-text.json')
  const expected = '<div class="big-heading" id="header_1234">Such h2 header, much amaze</div>'
  t.same(myBlockContentToHtml.convert(input), expected)
  t.end()
})


test('throws an error on custom block type without a registered handler', {todo: false}, t => {
  const input = require('./fixtures/custom-block.json')
  t.throws(() => {
    blockContentToHtml.convert(input)
  }, {message: "Don't know how to handle type 'author'"}, {})
  t.end()
})

test('handles a custom block type with a custom registered handler', {todo: false}, t => {
  const input = require('./fixtures/custom-block.json')
  const expected = '<div>Test Person</div>'
  const got = myBlockContentToHtml.convert(input)
  t.same(got, expected)
  t.end()
})


test('handles dangerous text', {todo: false}, t => {
  const input = require('./fixtures/dangerous-text.json')
  const expected = '<p>I am 1337 &lt;script&gt;alert(&#039;&#x2F;&#x2F;haxxor&#039;);&lt;&#x2F;script&gt;</p>'
  const got = blockContentToHtml.convert(input)
  t.same(got, expected)
  t.end()
})

test('exposes the escapeHtml utility function', {todo: false}, t => {
  const input = '<foo>'
  const expected = '&lt;foo&gt;'
  const got = BlockContentToHtml.escapeHtml(input)
  t.same(got, expected)
  t.end()
})


/* eslint-enable id-length */
