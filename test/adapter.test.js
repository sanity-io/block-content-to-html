/* eslint-disable id-length */

import {test} from 'tap'
import Adapter from '../src/Adapter.js'

const adapter = new Adapter()
const customAdapter = new Adapter(
  {
    typeHandlers: {
      author: node => {
        return `<div>${node.attributes.name}</div>`
      }
    },
    contentHandlers: {
      list: {
        number: node => {
          return '<ol class="foo">{content}</ol>'
        },
        listItem: node => {
          return '<li class="foo">{content}</li>'
        }
      },
      block: {
        normal: node => {
          return '<p class="foo">{content}</p>'
        }
      },
      attributes: {
        link: attributes => {
          return `<div data-foo="${attributes.href}">Lalala</div>{content}`
        }
      }
    }
  }
)

test('handles a plain string block', {todo: false}, t => {
  const input = require('./fixtures/plain-text.json')
  const expected = '<p>Normal string of text.</p>'
  const got = adapter.parse(input)
  t.same(got, expected)
  t.end()
})

test('handles a plain string block with custom contentHandler', {todo: false}, t => {
  const input = require('./fixtures/plain-text.json')
  const expected = '<p class="foo">Normal string of text.</p>'
  const got = customAdapter.parse(input)
  t.same(got, expected)
  t.end()
})

test('handles italicized text', {todo: false}, t => {
  const input = require('./fixtures/italicized-text.json')
  const expected = '<p>String with an <em>italicized</em> word.</p>'
  const got = adapter.parse(input)
  t.same(got, expected)
  t.end()
})

test('handles underline text', {todo: false}, t => {
  const input = require('./fixtures/underlined-text.json')
  const expected = '<p>String with an <underline>underlined</underline> word.</p>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('handles bold-underline text', {todo: false}, t => {
  const input = require('./fixtures/bold-underline-text.json')
  const expected = '<p>Plain<strong>only-bold<underline>bold-and-underline</underline></strong><underline>only-underline</underline>plain</p>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('does not care about span marks order', {todo: false}, t => {
  const orderedInput = require('./fixtures/marks-ordered-text.json')
  const reorderedInput = require('./fixtures/marks-reordered-text.json')
  const expected = '<p>Plain<strong>strong<underline>strong and underline<em>strong and underline and emphasis</em></underline></strong>'
    + '<em><underline>underline and emphasis</underline></em>plain again</p>'
  t.same(adapter.parse(orderedInput), expected)
  t.same(adapter.parse(reorderedInput), expected)
  t.end()
})


test('handles a messy text', {todo: false}, t => {
  const input = require('./fixtures/messy-text.json')
  const expected = '<p>Hacking <code>teh codez</code> is <strong>all <underline>fun</underline>'
    + ' and <em>games</em> until</strong> someone gets p0wn3d.</p>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('handles simple link text', {todo: false}, t => {
  const input = require('./fixtures/link-simple-text.json')
  const expected = '<p>String before link <a href="http://icanhas.cheezburger.com/">actual link text</a> the rest</p>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('handles messy link text', {todo: false}, t => {
  const input = require('./fixtures/link-messy-text.json')
  const expected = '<p>String with link to <a href="http://icanhas.cheezburger.com/">internet </a>'
    + '<em><strong><a href="http://icanhas.cheezburger.com/">is very strong and emphasis</a></strong>'
    + '<a href="http://icanhas.cheezburger.com/"> and just emphasis</a></em>.</p>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('handles a numbered list', {todo: false}, t => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected = '<ol><li><p>One</p></li><li><p>Two has <strong>bold</strong> word</p></li><li><p>Three</p></li></ol>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('handles a numbered list with custom content handler', {todo: false}, t => {
  const input = require('./fixtures/list-numbered-blocks.json')
  const expected = '<ol class="foo"><li class="foo"><p class="foo">One</p></li>'
    + '<li class="foo"><p class="foo">Two has <strong>bold</strong> word</p></li>'
    + '<li class="foo"><p class="foo">Three</p></li></ol>'
  t.same(customAdapter.parse(input), expected)
  t.end()
})


test('handles a bulleted list', {todo: false}, t => {
  const input = require('./fixtures/list-bulleted-blocks.json')
  const expected = '<ul><li><p>I am the most</p></li><li><p>expressive<strong>programmer</strong>you know.</p>'
    + '</li><li><p>SAD!</p></li></ul>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('handles multiple lists', {todo: false}, t => {
  const input = require('./fixtures/list-both-types-blocks.json')
  const expected = '<ul><li><p>A single bulleted item</p></li></ul>\n'
    + '<ol><li><p>First numbered</p></li><li><p>Second numbered</p></li></ol>\n'
    + '<ul><li><p>A bullet with<strong>something strong</strong></p></li></ul>'
  t.same(adapter.parse(input), expected)
  t.end()
})

test('handles a plain h2 block', {todo: false}, t => {
  const input = require('./fixtures/h2-text.json')
  const expected = '<h2>Such h2 header, much amaze</h2>'
  t.same(adapter.parse(input), expected)
  t.end()
})


test('handles a custom block type without a registered handler', {todo: false}, t => {
  const input = require('./fixtures/custom-block.json')
  const expected = '<span data-unhandled-attribute-name="name" data-unhandled-attribute-value="Test Person" />'
  const got = adapter.parse(input)
  t.same(got, expected)
  t.end()
})

test('handles a custom block type with a custom registered handler', {todo: false}, t => {
  const input = require('./fixtures/custom-block.json')
  const expected = '<div>Test Person</div>'
  const got = customAdapter.parse(input)
  t.same(got, expected)
  t.end()
})

/* eslint-enable id-length */
