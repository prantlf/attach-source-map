import { strictEqual } from 'node:assert'
import tehanu from 'tehanu'
import { rollup } from 'rollup'
import { minify } from 'terser'
import { attachSourceMap, minifyWithSourceMap, getErrorMessage } from '../lib/index.js'

const test = tehanu(import.meta.filename)

test('attaches source map', async () => {
  const input = 'console.log( "Hello, world!" )'
  const expected = `console.log( "Hello, world!" );
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlcyI6WyIvVXNlcnMvZmVyZGlwci9Tb3VyY2VzL2dpdGh1Yi9hdHRhY2gtc291cmNlLW1hcC9zY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc29sZS5sb2coIFwiSGVsbG8sIHdvcmxkIVwiICkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLEdBQUcsRUFBRSxlQUFlIn0=`
  const { code } = await attachSourceMap(rollup, 'script.js', input)
  strictEqual(code.trim(), expected.trim())
})

test('minifies with source map', async () => {
  const input = 'console.log( "Hello, world!" )'
  const expected = `console.log("Hello, world!");
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibmFtZXMiOlsiY29uc29sZSIsImxvZyJdLCJzb3VyY2VzIjpbInNjcmlwdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZyggXCJIZWxsbywgd29ybGQhXCIgKSJdLCJtYXBwaW5ncyI6IkFBQUFBLFFBQVFDLElBQUsiLCJpZ25vcmVMaXN0IjpbXX0=`
  const { code } = await minifyWithSourceMap(minify, 'script.js', input)
  strictEqual(code.trim(), expected.trim())
})

test('propagates error message', () => {
  const message = 'script.js (1:13): Unterminated string constant'
  const error = new Error(message)
  const actual = getErrorMessage(error, 'script.js')
  strictEqual(actual, message)
})

test('improves error message', () => {
  const message = 'Unterminated string constant'
  const error = new Error(message)
  error.line = 1
  error.col = 13
  const actual = getErrorMessage(error, 'script.js')
  const expected = `script.js (1:13): ${message}`
  strictEqual(actual, expected)
})
