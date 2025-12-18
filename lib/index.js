export async function attachSourceMap(rollup, scriptPath, inputScript) {
  const bundle = await rollup({
    input: scriptPath,
    plugins: [
      {
        name: 'loader',
        resolveId(source) {
          if (source === scriptPath) return source
        },
        load(id) {
          if (id === scriptPath) return inputScript
        }
      }
    ]
  })
  try {
    const { output } = await bundle.generate({
      file: scriptPath,
      sourcemap: 'inline',
      sourcemapPathTransform(_relativePath, sourcemapPath) {
        return sourcemapPath.slice(0, -4) // cut .map off
      }
    })
    return output[0]
  } finally {
    await bundle.close()
  }
}

export async function minifyWithSourceMap(minify, scriptPath, inputScript) {
  const result = await minify({
    [scriptPath]: inputScript
  }, {
    sourceMap: {
      filename: scriptPath,
      url: 'inline',
      includeSources: true
    }
  })
  return { code: result.code, map: result.decoded_map }
}

export function getErrorMessage(error, name) {
  const { line, col } = error
  return line && col ? `${name} (${line}:${col}): ${error.message}` : error.message
}
