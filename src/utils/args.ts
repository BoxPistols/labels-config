/**
 * Argument Parsing Utilities
 * Safe and robust command-line argument parsing
 */

export interface ParsedArgs {
  command?: string
  flags: Set<string>
  options: Map<string, string>
  positional: string[]
}

/**
 * Safely parse command-line arguments
 * Prevents bugs from missing flags
 */
export function parseArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {
    command: undefined,
    flags: new Set(),
    options: new Map(),
    positional: []
  }

  let i = 0

  // First non-flag argument is the command
  if (i < argv.length && !argv[i].startsWith('-')) {
    result.command = argv[i]
    i++
  }

  // Parse remaining arguments
  while (i < argv.length) {
    const arg = argv[i]

    if (arg.startsWith('--')) {
      // Long option
      const parts = arg.split('=', 2);
      if (parts.length === 2) {
        // Handles --key=value
        result.options.set(parts[0], parts[1]);
        i++;
      } else {
        const nextArg = argv[i + 1];
        if (!nextArg || nextArg.startsWith('-')) {
          // It's a flag (e.g., --verbose)
          result.flags.add(arg);
          i++;
        } else {
          // It's an option with a separate value (e.g., --file labels.json)
          result.options.set(arg, nextArg);
          i += 2;
        }
      }

    } else if (arg.startsWith('-')) {
      // Short flag
      result.flags.add(arg)
      i++
    } else {
      // Positional argument
      result.positional.push(arg)
      i++
    }
  }

  return result
}

/**
 * Get option value with validation
 */
export function getRequiredOption(
  args: ParsedArgs,
  name: string,
  errorMessage?: string
): string {
  const value = args.options.get(name)

  if (!value) {
    throw new Error(errorMessage || `Missing required option: ${name}`)
  }

  return value
}

/**
 * Get optional option value
 */
export function getOption(args: ParsedArgs, name: string, defaultValue?: string): string | undefined {
  return args.options.get(name) || defaultValue
}

/**
 * Check if flag is present
 */
export function hasFlag(args: ParsedArgs, ...names: string[]): boolean {
  return names.some(name => args.flags.has(name))
}

/**
 * Get positional argument at index
 */
export function getPositional(args: ParsedArgs, index: number): string | undefined {
  return args.positional[index]
}
