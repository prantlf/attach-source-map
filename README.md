# attach-source-map

Attaches an inline source map to a script. If not minified, the output script will be the same as the input script, just the inline source map will be attached to the bottom. This is useful if you insert an inline script to a page and need to debug it using the browser script debugger.

## Synopsis

Pass a script from `stdin` and watch it printed to `stdout`:

```
attach-source-map script.js
console.log( "Hello, world!" )
^D
console.log( "Hello, world!" );
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ...n0=
```

## Installation

This module can be installed globally using a `NPM` or other package manager:

```sh
npm i -g attach-source-map
```

## Usage

```
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
  attach-source-map -m script.js < input.js > output.js
```

## API

```ts
export function attachSourceMap(
  rollup: unknown,
  scriptPath: string,
  inputScript: string
): Promise<string>

export function minifyWithSourceMap(
  minify: unknown,
  script: string,
  scriptPath: string,
  inputScript: string
): Promise<string>

export function getErrorMessage(error: Error, scriptPath: string): string
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint and test your code.

## License

Copyright (c) 2025 Ferdinand Prantl

Licensed under the MIT license.
