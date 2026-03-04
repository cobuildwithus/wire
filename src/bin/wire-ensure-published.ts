import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_WIRE_PACKAGE_NAME = "@cobuild/wire";

type DependencySection = "dependencies" | "devDependencies";

type PackageJsonShape = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type DependencySpec = {
  section: DependencySection;
  currentSpec: string;
};

type RunCommand = (command: string, args: string[], cwd: string) => string;

export type EnsurePublishedDeps = {
  existsSync?: (filePath: string) => boolean;
  readFileSync?: (filePath: string, encoding: "utf8") => string;
  runCommand?: RunCommand;
  log?: (message: string) => void;
};

export type EnsurePublishedOptions = {
  packageDir: string;
  installRoot: string;
  packageName?: string;
};

export type EnsurePublishedResult =
  | { changed: false; reason: "missing-package-json" | "missing-dependency" | "up-to-date" }
  | { changed: true; reason: "updated"; message: string };

export type CliArgs = {
  packageDir: string;
  installRoot: string;
  packageName: string;
};

export function parseCliArgs(argv: string[]): CliArgs {
  let packageDir = process.cwd();
  let installRoot: string | undefined;
  let packageName = DEFAULT_WIRE_PACKAGE_NAME;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === undefined) {
      continue;
    }

    if (token === "--package-dir") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --package-dir");
      }
      packageDir = value;
      index += 1;
      continue;
    }

    if (token.startsWith("--package-dir=")) {
      packageDir = token.slice("--package-dir=".length);
      continue;
    }

    if (token === "--install-root") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --install-root");
      }
      installRoot = value;
      index += 1;
      continue;
    }

    if (token.startsWith("--install-root=")) {
      installRoot = token.slice("--install-root=".length);
      continue;
    }

    if (token === "--package-name") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("Missing value for --package-name");
      }
      packageName = value;
      index += 1;
      continue;
    }

    if (token.startsWith("--package-name=")) {
      packageName = token.slice("--package-name=".length);
      continue;
    }

    throw new Error(`Unknown argument: ${token}`);
  }

  const resolvedPackageDir = path.resolve(packageDir);
  const resolvedInstallRoot = path.resolve(installRoot ?? resolvedPackageDir);
  return {
    packageDir: resolvedPackageDir,
    installRoot: resolvedInstallRoot,
    packageName,
  };
}

export function normalizePnpmVersionOutput(raw: string): string {
  return raw.trim().replace(/^"+/, "").replace(/"+$/, "");
}

export function resolveDependencySpec(
  packageJson: PackageJsonShape,
  packageName: string
): DependencySpec | null {
  const dependencies = packageJson.dependencies ?? {};
  if (Object.prototype.hasOwnProperty.call(dependencies, packageName)) {
    return { section: "dependencies", currentSpec: dependencies[packageName] as string };
  }

  const devDependencies = packageJson.devDependencies ?? {};
  if (Object.prototype.hasOwnProperty.call(devDependencies, packageName)) {
    return {
      section: "devDependencies",
      currentSpec: devDependencies[packageName] as string,
    };
  }

  return null;
}

export function isLocalSpec(spec: string): boolean {
  return (
    spec.startsWith("link:") ||
    spec.startsWith("file:") ||
    spec.startsWith("workspace:") ||
    spec.includes("../wire")
  );
}

function parsePackageJson(raw: string): PackageJsonShape {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object") {
    throw new Error("package.json must contain an object");
  }
  return parsed as PackageJsonShape;
}

function defaultRunCommand(command: string, args: string[], cwd: string): string {
  return execFileSync(command, args, { cwd, encoding: "utf8" });
}

function isInsideGitRepo(runCommand: RunCommand, installRoot: string): boolean {
  try {
    runCommand("git", ["rev-parse", "--is-inside-work-tree"], installRoot);
    return true;
  } catch {
    return false;
  }
}

export function ensurePublishedWireDependency(
  options: EnsurePublishedOptions,
  deps: EnsurePublishedDeps = {}
): EnsurePublishedResult {
  const packageName = options.packageName ?? DEFAULT_WIRE_PACKAGE_NAME;
  const packageDir = path.resolve(options.packageDir);
  const installRoot = path.resolve(options.installRoot);
  const packageJsonPath = path.join(packageDir, "package.json");
  const lockfilePath = path.join(installRoot, "pnpm-lock.yaml");

  const fileExists = deps.existsSync ?? existsSync;
  const readFile = deps.readFileSync ?? readFileSync;
  const runCommand = deps.runCommand ?? defaultRunCommand;
  const log = deps.log ?? console.log;

  if (!fileExists(packageJsonPath)) {
    return { changed: false, reason: "missing-package-json" };
  }

  const packageJson = parsePackageJson(readFile(packageJsonPath, "utf8"));
  const dependency = resolveDependencySpec(packageJson, packageName);
  if (!dependency) {
    return { changed: false, reason: "missing-dependency" };
  }

  const latestVersion = normalizePnpmVersionOutput(
    runCommand("pnpm", ["view", packageName, "version", "--json"], installRoot)
  );

  if (!latestVersion) {
    throw new Error(`Failed to resolve latest published version for ${packageName}.`);
  }

  const targetSpec = `^${latestVersion}`;
  if (dependency.currentSpec === targetSpec) {
    return { changed: false, reason: "up-to-date" };
  }

  runCommand("pnpm", ["pkg", "set", `${dependency.section}.${packageName}=${targetSpec}`], packageDir);
  runCommand("pnpm", ["install", "--lockfile-only"], installRoot);

  if (isInsideGitRepo(runCommand, installRoot)) {
    runCommand("git", ["add", packageJsonPath], installRoot);
    if (fileExists(lockfilePath)) {
      runCommand("git", ["add", lockfilePath], installRoot);
    }
  }

  const message = isLocalSpec(dependency.currentSpec)
    ? `Replaced local ${packageName} spec (${dependency.currentSpec}) with ${targetSpec}.`
    : `Updated ${packageName} from ${dependency.currentSpec} to ${targetSpec}.`;
  log(message);
  return { changed: true, reason: "updated", message };
}

export function runCli(argv: string[] = process.argv.slice(2), deps: EnsurePublishedDeps = {}): number {
  const parsedArgs = parseCliArgs(argv);
  ensurePublishedWireDependency(
    {
      packageDir: parsedArgs.packageDir,
      installRoot: parsedArgs.installRoot,
      packageName: parsedArgs.packageName,
    },
    deps
  );
  return 0;
}

export function isDirectExecution(importMetaUrl: string, argvEntry: string | undefined): boolean {
  if (!argvEntry) {
    return false;
  }
  return fileURLToPath(importMetaUrl) === path.resolve(argvEntry);
}

if (isDirectExecution(import.meta.url, process.argv[1])) {
  try {
    runCli();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exitCode = 1;
  }
}
