import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

// Cache git lookups to avoid spawning `git` once per page during build.
const cache = new Map<string, Date | null>();

/**
 * Return the last commit time of a file (author-date, ISO 8601), or `null`
 * if git is unavailable / the file is untracked / the path does not exist.
 *
 * Falls back to filesystem mtime when git has no record (e.g., a newly added
 * file that hasn't been committed yet on a local dev machine).
 */
export function getGitMtime(absolutePath: string | undefined): Date | null {
  if (!absolutePath) return null;
  if (cache.has(absolutePath)) return cache.get(absolutePath) ?? null;

  let result: Date | null = null;

  if (existsSync(absolutePath)) {
    try {
      const out = execFileSync(
        'git',
        ['log', '-1', '--format=%cI', '--', absolutePath],
        {
          stdio: ['ignore', 'pipe', 'ignore'],
          cwd: path.dirname(absolutePath),
          encoding: 'utf-8',
        },
      ).trim();

      if (out) {
        const d = new Date(out);
        if (!Number.isNaN(d.getTime())) result = d;
      }
    } catch {
      // git not installed, not a repo, or shallow clone missing history — ignore
    }

    if (!result) {
      try {
        result = statSync(absolutePath).mtime;
      } catch {
        // ignore
      }
    }
  }

  cache.set(absolutePath, result);
  return result;
}

/**
 * Pick the latest of multiple candidate dates, ignoring falsy/invalid values.
 */
export function latestDate(
  ...candidates: Array<Date | string | undefined | null>
): Date | undefined {
  let latest: Date | undefined;
  for (const c of candidates) {
    if (!c) continue;
    const d = c instanceof Date ? c : new Date(c);
    if (Number.isNaN(d.getTime())) continue;
    if (!latest || d > latest) latest = d;
  }
  return latest;
}
