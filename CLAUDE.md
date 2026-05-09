# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`pkout` is a simple CLI tool for quickly viewing YAML data fields (accounts, passwords, etc.). It stores data in a YAML file and allows querying specific paths using dot notation or bracket notation.

## Development Commands

```bash
# Run tests
npm test
# or directly: coffee test.coffee

# Compile CoffeeScript to JavaScript
coffee -cb coffee

# Publish to npm (compiles first, then publishes)
npm run publish-coffee

# View config.json location
pkout file

# Edit data file in VS Code
pkout edit data
```

## Architecture

The project is written in CoffeeScript and compiled to JavaScript for distribution:

- **`coffee/index.coffee`** - CLI command definitions using `commander.js`. Defines all subcommands (`data`, `file`, `keys`, `config`, `edit`).
- **`coffee/helper.coffee`** - Core utilities module:
  - `getConf()` - Loads or prompts for config, returns Promise
  - `saveConf(data)` - Persists config to `config.json`
  - `getData(keyPath)` - Loads YAML and retrieves data by key path (e.g., `site.url` or `sites[0].url`)
  - `get(data, keyPath)` - Internal utility like `_.get`, supports dot and bracket notation
  - `editFile(type)` - Opens config/data/code files in VS Code
  - `log(data)` - Pretty-prints objects with `util.inspect`
- **`index.js`** - Main entry point (built from `coffee/index.coffee`), installed as `pkout` CLI command
- **`config.json`** - Stores the path to the user's YAML data file (created after first run via prompt)
- **`test.coffee`** - Test file with various CoffeeScript patterns

## Build & Publish Workflow

1. Source code lives in `coffee/` directory
2. `coffee -cb coffee` compiles all `.coffee` files to `.js`
3. `npm run publish-coffee` runs compilation then `npm publish`
4. The `prepublishOnly` script runs config reset, git commit, and version bump

## Dependencies

- `commander` - CLI argument parsing
- `js-yaml` - YAML parsing and loading
- `prompt` - Interactive prompts for initial setup
