import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, "..");
const syncScript = join(repoRoot, "scripts", "sync-dependent-repos.sh");

describe("sync-dependent-repos", () => {
  it("updates configured direct consumer repos including nested package paths", () => {
    const root = mkdtempSync(join(tmpdir(), "wire-sync-test-"));

    try {
      const fakeBin = join(root, "bin");
      mkdirSync(fakeBin, { recursive: true });
      const pnpmLog = join(root, "pnpm.log");
      const fakePnpm = join(fakeBin, "pnpm");

      writeFileSync(
        fakePnpm,
        `#!/usr/bin/env bash
set -euo pipefail
printf '%s\\n' "$PWD :: $*" >> "${pnpmLog}"
exit 0
`
      );
      spawnSync("chmod", ["+x", fakePnpm], { stdio: "ignore" });

      const cliRepo = join(root, "cli");
      mkdirSync(cliRepo, { recursive: true });
      writeFileSync(
        join(cliRepo, "package.json"),
        JSON.stringify(
          {
            name: "tmp-cli",
            dependencies: {
              "@cobuild/wire": "^0.1.5",
            },
          },
          null,
          2
        )
      );

      const webRepo = join(root, "interface", "apps", "web");
      mkdirSync(webRepo, { recursive: true });
      writeFileSync(
        join(webRepo, "package.json"),
        JSON.stringify(
          {
            name: "tmp-web",
            dependencies: {
              "@cobuild/wire": "^0.1.4",
            },
          },
          null,
          2
        )
      );

      const result = spawnSync(
        "bash",
        [syncScript, "--version", "0.2.0", "--root", root, "--dry-run"],
        {
          cwd: repoRoot,
          encoding: "utf8",
          env: {
            ...process.env,
            PATH: `${fakeBin}:${process.env.PATH}`,
          },
        }
      );

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Repo set: cli chat-api indexer interface/apps/web");
      expect(result.stdout).toContain(`Would update cli: (cd ${cliRepo} && pnpm up @cobuild/wire@0.2.0)`);
      expect(result.stdout).toContain(
        `Would update interface/apps/web: (cd ${webRepo} && pnpm up @cobuild/wire@0.2.0)`
      );
      expect(existsSync(pnpmLog)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
