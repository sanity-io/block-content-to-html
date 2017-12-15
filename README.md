# block-content-to-html

Render an array of [block text](https://www.sanity.io/docs/schema-types/block-type) from Sanity to HTML.

## Installing

```
npm install --save @sanity/block-content-to-html
```

## Usage

```js
const blocksToHtml = require('@sanity/block-content-to-html')
const client = require('@sanity/client')({
  projectId: '<your project id>',
  dataset: '<some dataset>',
  useCdn: true
})

// `h` is a way to build HTML known as hyperscript
// See https://github.com/hyperhype/hyperscript for more info
const h = blocksToHtml.h

const serializers = {
  types: {
    code: props => (
      h('pre', {className: props.node.language},
        h('code', props.node.code)
      )
    )
  }
}

client.fetch('*[_type == "article"][0]').then(article => {
  const el = blocksToHtml({
    blocks: article.body,
    serializers: serializers
  })

  document.getElementById('root').appendChild(el)
})
```

## Options

- `className` - When more than one block is given, a container node has to be created. Passing a `className` will pass it on to the container. Note that if only a single block is given as input, the container node will be skipped.
- `serializers` - Specifies the functions to use for rendering content. Merged with default serializers.
- `serializers.types` - Serializers for block types, see example above
- `serializers.marks` - Serializers for marks - data that annotates a text child of a block. See example usage below.
- `serializers.list` - Function to use when rendering a list node
- `serializers.listItem` - Function to use when rendering a list item node
- `serializers.hardBreak` - Function to use when transforming newline characters to a hard break (`<br/>` by default, pass `false` to render newline character)
- `imageOptions` - When encountering image blocks, this defines which query parameters to apply in order to control size/crop mode etc.

In addition, in order to render images without materializing the asset documents, you should also specify:

- `projectId` - The ID of your Sanity project.
- `dataset` - Name of the Sanity dataset containing the document that is being rendered.

## Examples

### Rendering custom marks

```js
const input = [{
  _type: 'block',
  children: [{
    _key: 'a1ph4',
    _type: 'span',
    marks: ['s0m3k3y'],
    text: 'Sanity'
  }],
  markDefs: [{
    _key: 's0m3k3y',
    _type: 'highlight',
    color: '#E4FC5B'
  }]
}]

const highlight = props => (
  h('span', {style: {backgroundColor: props.mark.color}}, props.children)
)

const content = blocksToHtml({
  blocks: input,
  serializers: {marks: {highlight}}
})
```

### Specifying image options

```js
blocksToHtml({
  blocks: input,
  imageOptions: {w: 320, h: 240, fit: 'max'},
  projectId: 'myprojectid',
  dataset: 'mydataset',
})
```

### Customizing default serializer for `block`-type

```js
const BlockRenderer = props => {
  const style = props.node.style || 'normal'

  if (/^h\d/.test(style)) {
    const level = style.replace(/[^\d]/g, '')
    return h('h2', {className: `my-heading level-${level}`}, props.children)
  }

  return style === 'blockquote'
    ? h('blockquote', {className: 'my-block-quote'}, props.children)
    : h('p', {className: 'my-paragraph'}, props.children)
}

blocksToHtml({
  blocks: input,
  serializers: {types: {block: BlockRenderer}}
})
```

## License

MIT-licensed. See LICENSE.
