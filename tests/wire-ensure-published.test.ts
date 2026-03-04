import path from "node:path";

import { describe, expect, it, vi } from "vitest";

import {
  ensurePublishedWireDependency,
  isDirectExecution,
  isLocalSpec,
  normalizePnpmVersionOutput,
  parseCliArgs,
  resolveDependencySpec,
  runCli,
} from "../src/bin/wire-ensure-published.js";

type CommandCall = {
  command: string;
  args: string[];
  cwd: string;
};

type HarnessOptions = {
  packageDir?: string;
  installRoot?: string;
  hasPackageJson?: boolean;
  hasLockfile?: boolean;
  packageJsonText?: string;
  latestVersionOutput?: string;
  isGitRepo?: boolean;
};

function createHarness(options: HarnessOptions = {}) {
  const packageDir = options.packageDir ?? "/repo/pkg";
  const installRoot = options.installRoot ?? packageDir;
  const packageJsonPath = path.join(packageDir, "package.json");
  const lockfilePath = path.join(installRoot, "pnpm-lock.yaml");
  const hasPackageJson = options.hasPackageJson ?? true;
  const hasLockfile = options.hasLockfile ?? true;
  const packageJsonText =
    options.packageJsonText ??
    JSON.stringify({
      dependencies: {
        "@cobuild/wire": "link:../wire",
      },
    });
  const latestVersionOutput = options.latestVersionOutput ?? "\"1.2.3\"\n";
  const isGitRepo = options.isGitRepo ?? true;

  const calls: CommandCall[] = [];
  const log = vi.fn<(message: string) => void>();

  const runCommand = vi.fn<(command: string, args: string[], cwd: string) => string>(
    (command, args, cwd) => {
      calls.push({ command, args, cwd });

      if (command === "pnpm" && args[0] === "view") {
        return latestVersionOutput;
      }

      if (command === "git" && args[0] === "rev-parse") {
        if (!isGitRepo) {
          throw new Error("not a git repo");
        }
        return "true\n";
      }

      return "";
    }
  );

  const existsSync = vi.fn<(filePath: string) => boolean>((filePath) => {
    if (filePath === packageJsonPath) {
      return hasPackageJson;
    }
    if (filePath === lockfilePath) {
      return hasLockfile;
    }
    return false;
  });

  const readFileSync = vi.fn<(filePath: string, encoding: "utf8") => string>((filePath, encoding) => {
    if (encoding !== "utf8" || filePath !== packageJsonPath) {
      throw new Error("unexpected read");
    }
    return packageJsonText;
  });

  return {
    packageDir,
    installRoot,
    packageJsonPath,
    lockfilePath,
    calls,
    runCommand,
    existsSync,
    readFileSync,
    log,
  };
}

describe("wire ensure published bin", () => {
  it("parses CLI args with defaults and explicit values", () => {
    const explicit = parseCliArgs([
      "--package-dir",
      "./apps/web",
      "--install-root=../..",
      "--package-name",
      "@acme/wire",
    ]);
    expect(explicit.packageDir).toBe(path.resolve("./apps/web"));
    expect(explicit.installRoot).toBe(path.resolve("../.."));
    expect(explicit.packageName).toBe("@acme/wire");

    const defaults = parseCliArgs([]);
    expect(defaults.packageDir).toBe(path.resolve(process.cwd()));
    expect(defaults.installRoot).toBe(path.resolve(process.cwd()));
    expect(defaults.packageName).toBe("@cobuild/wire");
  });

  it("rejects unsupported CLI args", () => {
    expect(() => parseCliArgs(["--wat"])).toThrow("Unknown argument: --wat");
    expect(() => parseCliArgs(["--package-dir"])).toThrow("Missing value for --package-dir");
    expect(() => parseCliArgs(["--install-root"])).toThrow("Missing value for --install-root");
    expect(() => parseCliArgs(["--package-name"])).toThrow("Missing value for --package-name");
  });

  it("normalizes pnpm version output and local specs", () => {
    expect(normalizePnpmVersionOutput("\"1.2.3\"\n")).toBe("1.2.3");
    expect(normalizePnpmVersionOutput("1.2.3")).toBe("1.2.3");
    expect(isLocalSpec("link:../wire")).toBe(true);
    expect(isLocalSpec("workspace:*")).toBe(true);
    expect(isLocalSpec("^1.2.3")).toBe(false);
  });

  it("resolves dependency specs from dependencies and devDependencies", () => {
    const fromDeps = resolveDependencySpec(
      { dependencies: { "@cobuild/wire": "file:../wire" } },
      "@cobuild/wire"
    );
    expect(fromDeps).toEqual({ section: "dependencies", currentSpec: "file:../wire" });

    const fromDevDeps = resolveDependencySpec(
      { devDependencies: { "@cobuild/wire": "^0.1.0" } },
      "@cobuild/wire"
    );
    expect(fromDevDeps).toEqual({ section: "devDependencies", currentSpec: "^0.1.0" });

    expect(resolveDependencySpec({}, "@cobuild/wire")).toBeNull();
  });

  it("exits when package.json is missing", () => {
    const harness = createHarness({ hasPackageJson: false });

    const result = ensurePublishedWireDependency(
      { packageDir: harness.packageDir, installRoot: harness.installRoot },
      {
        existsSync: harness.existsSync,
        readFileSync: harness.readFileSync,
        runCommand: harness.runCommand,
        log: harness.log,
      }
    );

    expect(result).toEqual({ changed: false, reason: "missing-package-json" });
    expect(harness.calls).toHaveLength(0);
    expect(harness.log).not.toHaveBeenCalled();
  });

  it("exits when wire dependency is missing", () => {
    const harness = createHarness({
      packageJsonText: JSON.stringify({ dependencies: { react: "^19.0.0" } }),
    });

    const result = ensurePublishedWireDependency(
      { packageDir: harness.packageDir, installRoot: harness.installRoot },
      {
        existsSync: harness.existsSync,
        readFileSync: harness.readFileSync,
        runCommand: harness.runCommand,
        log: harness.log,
      }
    );

    expect(result).toEqual({ changed: false, reason: "missing-dependency" });
    expect(harness.calls).toHaveLength(0);
    expect(harness.log).not.toHaveBeenCalled();
  });

  it("no-ops when dependency already targets latest published version", () => {
    const harness = createHarness({
      packageJsonText: JSON.stringify({
        dependencies: { "@cobuild/wire": "^1.2.3" },
      }),
      latestVersionOutput: "\"1.2.3\"",
    });

    const result = ensurePublishedWireDependency(
      { packageDir: harness.packageDir, installRoot: harness.installRoot },
      {
        existsSync: harness.existsSync,
        readFileSync: harness.readFileSync,
        runCommand: harness.runCommand,
        log: harness.log,
      }
    );

    expect(result).toEqual({ changed: false, reason: "up-to-date" });
    expect(harness.calls).toEqual([
      {
        command: "pnpm",
        args: ["view", "@cobuild/wire", "version", "--json"],
        cwd: harness.installRoot,
      },
    ]);
    expect(harness.log).not.toHaveBeenCalled();
  });

  it("updates dependency and stages package.json and lockfile in git repos", () => {
    const harness = createHarness({
      packageDir: "/repo/apps/web",
      installRoot: "/repo",
      packageJsonText: JSON.stringify({
        dependencies: { "@cobuild/wire": "link:../../../wire" },
      }),
      latestVersionOutput: "\"2.0.0\"\n",
      hasLockfile: true,
      isGitRepo: true,
    });

    const result = ensurePublishedWireDependency(
      { packageDir: harness.packageDir, installRoot: harness.installRoot },
      {
        existsSync: harness.existsSync,
        readFileSync: harness.readFileSync,
        runCommand: harness.runCommand,
        log: harness.log,
      }
    );

    expect(result).toEqual({
      changed: true,
      reason: "updated",
      message: "Replaced local @cobuild/wire spec (link:../../../wire) with ^2.0.0.",
    });
    expect(harness.calls).toEqual([
      {
        command: "pnpm",
        args: ["view", "@cobuild/wire", "version", "--json"],
        cwd: harness.installRoot,
      },
      {
        command: "pnpm",
        args: ["pkg", "set", "dependencies.@cobuild/wire=^2.0.0"],
        cwd: harness.packageDir,
      },
      {
        command: "pnpm",
        args: ["install", "--lockfile-only"],
        cwd: harness.installRoot,
      },
      {
        command: "git",
        args: ["rev-parse", "--is-inside-work-tree"],
        cwd: harness.installRoot,
      },
      {
        command: "git",
        args: ["add", harness.packageJsonPath],
        cwd: harness.installRoot,
      },
      {
        command: "git",
        args: ["add", harness.lockfilePath],
        cwd: harness.installRoot,
      },
    ]);
    expect(harness.log).toHaveBeenCalledWith(
      "Replaced local @cobuild/wire spec (link:../../../wire) with ^2.0.0."
    );
  });

  it("updates dependency without git staging outside git repos", () => {
    const harness = createHarness({
      packageJsonText: JSON.stringify({
        devDependencies: { "@cobuild/wire": "~1.0.0" },
      }),
      latestVersionOutput: "\"1.4.0\"",
      isGitRepo: false,
    });

    const result = ensurePublishedWireDependency(
      { packageDir: harness.packageDir, installRoot: harness.installRoot },
      {
        existsSync: harness.existsSync,
        readFileSync: harness.readFileSync,
        runCommand: harness.runCommand,
        log: harness.log,
      }
    );

    expect(result).toEqual({
      changed: true,
      reason: "updated",
      message: "Updated @cobuild/wire from ~1.0.0 to ^1.4.0.",
    });
    expect(harness.calls).toEqual([
      {
        command: "pnpm",
        args: ["view", "@cobuild/wire", "version", "--json"],
        cwd: harness.installRoot,
      },
      {
        command: "pnpm",
        args: ["pkg", "set", "devDependencies.@cobuild/wire=^1.4.0"],
        cwd: harness.packageDir,
      },
      {
        command: "pnpm",
        args: ["install", "--lockfile-only"],
        cwd: harness.installRoot,
      },
      {
        command: "git",
        args: ["rev-parse", "--is-inside-work-tree"],
        cwd: harness.installRoot,
      },
    ]);
    expect(harness.log).toHaveBeenCalledWith("Updated @cobuild/wire from ~1.0.0 to ^1.4.0.");
  });

  it("throws when latest published version cannot be resolved", () => {
    const harness = createHarness({
      latestVersionOutput: " \n",
    });

    expect(() =>
      ensurePublishedWireDependency(
        { packageDir: harness.packageDir, installRoot: harness.installRoot },
        {
          existsSync: harness.existsSync,
          readFileSync: harness.readFileSync,
          runCommand: harness.runCommand,
          log: harness.log,
        }
      )
    ).toThrow("Failed to resolve latest published version for @cobuild/wire.");
  });

  it("identifies direct execution via import meta url", () => {
    const scriptPath = "/repo/dist/bin/wire-ensure-published.js";
    const scriptUrl = `file://${scriptPath}`;
    expect(isDirectExecution(scriptUrl, scriptPath)).toBe(true);
    expect(isDirectExecution(scriptUrl, "/repo/other.js")).toBe(false);
    expect(isDirectExecution(scriptUrl, undefined)).toBe(false);
  });

  it("runs CLI flow with parsed args", () => {
    const harness = createHarness({
      packageDir: "/repo/apps/web",
      installRoot: "/repo",
    });

    const exitCode = runCli(
      ["--package-dir", harness.packageDir, "--install-root", harness.installRoot],
      {
        existsSync: harness.existsSync,
        readFileSync: harness.readFileSync,
        runCommand: harness.runCommand,
        log: harness.log,
      }
    );

    expect(exitCode).toBe(0);
    expect(harness.calls).toEqual([
      {
        command: "pnpm",
        args: ["view", "@cobuild/wire", "version", "--json"],
        cwd: harness.installRoot,
      },
      {
        command: "pnpm",
        args: ["pkg", "set", "dependencies.@cobuild/wire=^1.2.3"],
        cwd: harness.packageDir,
      },
      {
        command: "pnpm",
        args: ["install", "--lockfile-only"],
        cwd: harness.installRoot,
      },
      {
        command: "git",
        args: ["rev-parse", "--is-inside-work-tree"],
        cwd: harness.installRoot,
      },
      {
        command: "git",
        args: ["add", harness.packageJsonPath],
        cwd: harness.installRoot,
      },
      {
        command: "git",
        args: ["add", harness.lockfilePath],
        cwd: harness.installRoot,
      },
    ]);
  });
});
