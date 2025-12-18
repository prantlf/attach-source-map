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
