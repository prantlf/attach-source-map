#!/usr/bin/env node

import { rollup } from 'rollup'
import { minify } from 'terser'
import { attachSourceMap, minifyWithSourceMap, getErrorMessage } from '../lib/index.js'

const usage = `Attaches an inline source map to a script.

Usage: attach-source-map [option...] <path> < input.js > output.js

Options:
  -m|--minify   minify the script too
  -V|--version  print version number
  -h|--help     print usage instructions

Prints the script from stdin on stdout and appends an inline source map
for the same script. Optionally the script can be minified. The path
(absolute or relative) of the script will be written to the source map.

Examples:
  attach-source-map /myscript/script.js < input.js > output.js
  attach-source-map -m script.js < input.js > output.js`

function print(message) {
  process.stdout.write(`${message}\n`)
  process.exit(0)
}

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

const { argv } = process
let minifyScript
let scriptPath

for (let i = 2, l = argv.length; i < l; ++i) {
  const arg = argv[i]
  const match = /^(?:-|--)(no-)?([a-zA-Z][-a-z]*)$/.exec(arg)
  if (match) {
    const flag = match[1] !== 'no-'
    switch (match[2]) {
      case 'm': case 'minify':
        minifyScript = flag
        continue
      case 'V': case 'version':
        {
          const { default: pkg } = await import('../package.json', { with: { type: 'json' } })
          print(pkg.version)
        }
        break
      case 'h': case 'help':
        print(usage)
    }
    fail(`Unknown argument: "${arg}"`)
  } else if (scriptPath) {
    fail(`Too many script paths: "${arg}"`)
  }
  scriptPath = arg
}

if (!scriptPath) {
  fail(`Missing script path.

${usage}`)
}

let source = ''
const stdin = process.openStdin()
stdin.setEncoding('utf8')
stdin.on('data', chunk => {
  source += chunk.toString('utf8')
})
stdin.on('end', processScript)

async function processScript() {
  try {
    const { code } = minifyScript
      ? await minifyWithSourceMap(minify, scriptPath, source)
      : await attachSourceMap(rollup, scriptPath, source)
    process.stdout.setEncoding('utf8')
    print(code)
  } catch (error) {
    const message = getErrorMessage(error, scriptPath)
    fail(message)
  }
}
