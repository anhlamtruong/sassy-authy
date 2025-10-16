import { commandConfigs } from "../config/index.js";
import minimist from "minimist";

/**
 * Parses command-line arguments and normalizes flags/aliases.
 * @param argv - The process.argv array from Node.js
 * @returns An object containing the parsed command, name, and flags
 */
export function parseArgs(argv: string[]) {
  // Initial parse to extract command and name
  const parsed = minimist(argv.slice(2));
  const [commandRaw, name] = parsed._;
  type CommandKey = keyof typeof commandConfigs;
  const command = commandRaw as CommandKey;

  // Validate that the command exists in the configuration
  if (!Object.prototype.hasOwnProperty.call(commandConfigs, command)) {
    console.error(`❌ Unknown command: ${commandRaw}`);
    process.exit(1);
  }
  const config = commandConfigs[command];

  // Re-parse arguments with correct alias and boolean flag settings
  const parsedWithConfig = minimist(argv.slice(2), {
    alias: config.alias,
    boolean: config.flags,
  });

  // Normalize flag values so both long and short forms are recognized
  config.flags.forEach((flag) => {
    const aliasKey = Object.entries(config.alias).find(
      ([, long]) => long === flag
    )?.[0];
    if (aliasKey) {
      parsedWithConfig[flag] =
        parsedWithConfig[flag] || parsedWithConfig[aliasKey];
    }
  });

  // Return the parsed command, name, and normalized flags
  return {
    command,
    name,
    flags: parsedWithConfig,
  };
}
