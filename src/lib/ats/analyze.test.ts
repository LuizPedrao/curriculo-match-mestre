import { describe, expect, it } from "vitest";
import { analyze, computeScore } from "./analyze";
import { EXAMPLE_JOB, EXAMPLE_RESUME } from "@/data/example";
import { reorganizeResume } from "@/lib/resume/reorganize";

describe("ATS analysis", () => {
  it("does not match Java inside JavaScript", () => {
    const r = analyze("Requisitos: Java e SQL", "Experiência com JavaScript e SQL", "tecnologia");
    expect(r.found.map((k) => k.label)).toContain("SQL");
    expect(r.missing.map((k) => k.label)).toContain("Java");
  });
  it("is inconclusive when no terms are found", () => {
    const r = analyze("xyz", "abc", "geral");
    expect(r.inconclusive).toBe(true);
    expect(r.score).toBeNull();
  });
  it("score = found weights / total weights * 100", () => {
    expect(computeScore([{ weight: 3, found: true }, { weight: 1, found: false }])).toBe(75);
  });
  it("example: SIEM, Nmap, Azure missing; Linux, Python found", () => {
    const r = analyze(EXAMPLE_JOB, EXAMPLE_RESUME, "tecnologia");
    const f = r.found.map((k) => k.label);
    const m = r.missing.map((k) => k.label);
    expect(f).toEqual(expect.arrayContaining(["Linux", "Python", "TCP/IP", "Análise de logs"]));
    expect(m).toEqual(expect.arrayContaining(["SIEM", "Nmap", "Azure", "Resposta a incidentes"]));
  });
  it("never adds missing keywords to the generated resume", () => {
    const r = analyze(EXAMPLE_JOB, EXAMPLE_RESUME, "tecnologia");
    const out = reorganizeResume(EXAMPLE_RESUME, r.found.map((k) => k.label)).text;
    for (const term of ["SIEM", "Nmap", "Azure"]) expect(out).not.toContain(term);
  });
});
