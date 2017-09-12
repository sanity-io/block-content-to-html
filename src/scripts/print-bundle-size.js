/* eslint-disable no-console, array-element-newline */
const fs = require('fs')
const path = require('path')
const boxen = require('boxen')
const chalk = require('chalk')
const gzipSize = require('gzip-size')
const prettyBytes = require('pretty-bytes')

const umdPath = path.join(__dirname, '..', '..', 'umd')
const bundlePath = path.join(umdPath, 'index.js')
const minPath = path.join(umdPath, 'index.min.js')

fs.readFile(bundlePath, (bundleErr, bundle) => {
  throwOnError(bundleErr)

  fs.readFile(minPath, (minErr, minBundle) => {
    throwOnError(minErr)

    gzipSize(bundle, (gzipErr, gzipedSize) => {
      throwOnError(gzipErr)

      const output = [
        'UMD bundle size:',
        '────────────────',
        `Minified: ${size(bundle.length)}`,
        `Minified + gzip: ${size(gzipedSize)}`
      ].join('\n')

      console.log(boxen(output, {
        padding: 1,
        borderColor: 'yellow',
        align: 'right'
      }))
    })
  })
})

function throwOnError(err) {
  if (err && err.code === 'ENOENT') {
    throw new Error('File not found, did you run `npm run build` first?')
  } else if (err) {
    throw err
  }
}

function size(bytes) {
  const color = bytes > 1024 * 50 ? 'red' : 'green'
  return chalk[color](prettyBytes(bytes))
}
