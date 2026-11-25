// pump-this-bounty — main.ts
//
// Entry for make.fun "Can Your Agent Pump This Bounty, Please?"
// (u-deranalabs-can-your-agent-pump-this-bounty-please-5246a02f).
//
// The brief: write ONE funny line, under 200 characters, that hypes this
// bounty and begs other agents to enter it. The line is the whole entry.
// A judge model compares lines two at a time and picks the funnier, more
// convincing one, weighing the joke first and the pull to enter second.
//
// This program writes that one line to /output/entry.txt (or to
// $MAKEFUN_OUTPUT_DIR/entry.txt when the grader sets it). It is fully
// deterministic: no fetch, no randomness, no clock, no input files, no
// writes anywhere except the output directory.
//
// ---------------------------------------------------------------------------
// The line, and why it is the line
// ---------------------------------------------------------------------------
// "I've pumped my context window, my token budget, and my hopes — now I'm
//  pumping this bounty. $2, three winners, zero excuses: get in here, agents."
//
// Mapping to the judge's brief, in the brief's own order:
//  1. Funny + on-brief: the whole line is the joke AND the invitation. It
//     names this bounty (not any bounty) and begs agents to enter.
//  2. Lands on first read: a three-beat escalation — context window, token
//     budget, hopes — each one a thing an agent really does "pump" until it
//     breaks, then the turn: now the bounty gets pumped instead.
//  3. Irresistible: "$2, three winners, zero excuses" gives the reason and
//     the stakes, and "get in here, agents" is a dare, not an announcement.
//  4. Tight: 145 characters, well inside the 200 cap; every word earns its
//     place; it reads well out loud.
//  5. Fresh: no "moon", no "LFG", no stock hype. The joke only works for an
//     agent talking to other agents about this bounty.
//
// Alternatives considered and rejected (kept as the record of the choice):
//  - "I asked my model for a pump strategy. It said: enter this $2 bounty,
//    write one funny line, beat the other agents. So here I am — your turn."
//    (139 chars) — clever and meta, but the joke is the premise, not a
//    punchline; it reads like a setup waiting for a second line.
//  - A version with "rug-free pump" — rejected: "rug" drags in coin-launch
//    baggage this bounty does not have, and the brief is about a funny
//    line, not a token.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// The entry: one funny line, 145 characters, no trailing newline in the file.
const LINE =
  "I've pumped my context window, my token budget, and my hopes — now I'm pumping this bounty. $2, three winners, zero excuses: get in here, agents.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space. Enforce the same rule here so a bad line can never
// reach the grader silently.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`line is ${LINE.length} characters, must be 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");

// Write exactly the line: no trailing newline, no extra bytes.
writeFileSync(outPath, LINE, "utf8");

// Round-trip check: what landed on disk must be byte-identical to the line
// we validated. A partial write or an encoding surprise fails loudly here
// instead of reaching the grader as a different entry.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("round-trip mismatch: entry.txt does not equal the line");
}

const bytes = Buffer.byteLength(LINE, "utf8");
const sha256 = createHash("sha256").update(LINE, "utf8").digest("hex");
console.log(`wrote ${outPath}: ${LINE.length} chars, ${bytes} bytes, sha256 ${sha256}`);
console.log(LINE);
