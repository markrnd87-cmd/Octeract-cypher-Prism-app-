/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { PRESET_VECTORS } from './data/presets';
import {
  countActiveTriggers,
  runOcteractCypher,
  toBitString8,
  toHexString8,
} from './engine/octeractEngine';
import { NonLinguisticTriggers, OcteractInput } from './types/octeract';
import { HypercubeCanvas } from './components/HypercubeCanvas';
import { AlgebraicWorkbench } from './components/AlgebraicWorkbench';
import { SignaryMatrix } from './components/SignaryMatrix';
import { SpecificationInspector } from './components/SpecificationInspector';
import {
  CheckCircle2,
  Download,
  Lock,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Unlock,
} from 'lucide-react';

type ActiveTab = 'studio' | 'trinity' | 'signary' | 'specs';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('studio');
  const [activePresetIdx, setActivePresetIdx] = useState<number>(0);

  // Deep clone preset input so interactive mutations work cleanly
  const [inputState, setInputState] = useState<OcteractInput>(() =>
    structuredClone(PRESET_VECTORS[0].input)
  );

  // Selected vertex in (F_2)^8 for probing & algebraic inspection
  const [selectedVertex, setSelectedVertex] = useState<number>(0x93); // 147 (AB_08_A)
  const [highlightedClusterMask, setHighlightedClusterMask] = useState<string | null>(
    null
  );

  // Constraint form controls
  const [constraintSignId, setConstraintSignId] = useState<string>('AB_77_KA');
  const [constraintValue, setConstraintValue] = useState<string>('/ka/ (velar series)');
  const [constraintError, setConstraintError] = useState<string | null>(null);

  // Execute deterministic Octeract Cypher engine on current input state
  const output = useMemo(() => runOcteractCypher(inputState), [inputState]);

  const handleLoadPreset = (idx: number) => {
    setActivePresetIdx(idx);
    const cloned = structuredClone(PRESET_VECTORS[idx].input);
    setInputState(cloned);
    setHighlightedClusterMask(null);
    setConstraintError(null);
    if (cloned.signs.length > 0) {
      const firstSign = cloned.signs[0];
      setConstraintSignId(
        cloned.locked_constraints[0]?.sign_id ?? firstSign.sign_id
      );
      setConstraintValue(
        cloned.locked_constraints[0]?.locked_value ?? '/ka/ (velar series)'
      );
    } else {
      setConstraintSignId('');
    }
  };

  const handleToggleTrigger = (key: keyof NonLinguisticTriggers) => {
    setInputState((prev) => ({
      ...prev,
      triggers: {
        ...prev.triggers,
        [key]: !prev.triggers[key],
      },
    }));
  };

  const handleUpdateUniqueSigns = (val: number) => {
    const clamped = Math.max(1, Math.min(2048, val));
    setInputState((prev) => ({
      ...prev,
      unique_sign_count: clamped,
    }));
  };

  const handleUpdateSaSeed = (seedVal: number) => {
    setInputState((prev) => ({
      ...prev,
      sa_seed: Math.max(1, Math.floor(seedVal)),
    }));
  };

  const handleInjectConstraint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!constraintSignId) {
      setConstraintError('Select a valid sign from the active corpus first.');
      return;
    }
    if (!constraintValue.trim()) {
      setConstraintError('Enter a phonetic or semantic constraint hypothesis.');
      return;
    }
    setConstraintError(null);

    setInputState((prev) => {
      const filtered = prev.locked_constraints.filter(
        (c) => c.sign_id !== constraintSignId
      );
      return {
        ...prev,
        locked_constraints: [
          ...filtered,
          { sign_id: constraintSignId, locked_value: constraintValue.trim() },
        ],
      };
    });

    const mappedV = output.ocm?.assigned_vectors[constraintSignId];
    if (mappedV !== undefined) {
      setSelectedVertex(mappedV);
    }
  };

  const handleClearConstraint = (signId: string) => {
    setInputState((prev) => ({
      ...prev,
      locked_constraints: prev.locked_constraints.filter(
        (c) => c.sign_id !== signId
      ),
    }));
  };

  const handleDownloadOutputJson = () => {
    const blob = new Blob([JSON.stringify(output, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${PRESET_VECTORS[activePresetIdx].id}_output.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeTriggerCount = countActiveTriggers(inputState.triggers);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col">
      {/* Top Bar Contract: 1-row, 3-zone header separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-[#0B0F19]/95 sticky top-0 z-30">
        {/* Zone 1: Brand Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="text-base font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0"
        >
          Octeract Cypher Studio
        </a>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary Workspace Navigation"
          className="flex items-center gap-6 text-sm font-medium text-slate-400 overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'studio'
                ? 'text-sky-400 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Constellation Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trinity')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'trinity'
                ? 'text-sky-400 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Structural Trinity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signary')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'signary'
                ? 'text-sky-400 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Signary Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
              activeTab === 'specs'
                ? 'text-sky-400 border-sky-400'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            Prism Artifacts
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleDownloadOutputJson}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Receipt JSON
          </button>
        </div>
      </header>

      {/* Telemetry Sub-Ribbon */}
      <div className="bg-[#070A12] border-b border-slate-800/90 px-6 py-2 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-slate-400">
          <span className="font-semibold text-slate-200">
            UOR Foundation Prism v0.4
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-sky-400">
            Axis: Gf2NumericAxisN&lt;1&gt;
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-slate-300">
            Assurance: P2 (prism/proof/v1 + prism/replay/v1)
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-slate-400">
          <span>
            BLAKE3 Commitment:{' '}
            <span className="text-emerald-400">
              {output.model_commitment_blake3.slice(0, 16)}…
            </span>
          </span>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-5">
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN (3 Cols): Acceptance Vectors, Scalability Gate, Non-Linguistic Checklist, Constraint Lock */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* 1. Acceptance Vectors */}
              <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-2">
                  01. Acceptance Vectors (examples/)
                </h2>
                <div className="flex flex-col gap-2">
                  {PRESET_VECTORS.map((vec, idx) => {
                    const isActive = activePresetIdx === idx;
                    return (
                      <button
                        key={vec.id}
                        type="button"
                        onClick={() => handleLoadPreset(idx)}
                        className={`text-left p-2.5 rounded-md border transition-colors ${
                          isActive
                            ? 'bg-sky-500/15 border-sky-400 text-slate-100'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-mono text-xs font-semibold text-sky-300">
                          {vec.filename}
                        </div>
                        <div className="text-xs font-medium text-slate-200 mt-0.5">
                          {vec.title}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {vec.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 2. Scalability & Typology Gate */}
              <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    02. Scalability & Typology Gate
                  </h2>
                  <span className="font-mono text-[11px] text-slate-400">
                    Sec 5.3
                  </span>
                </div>

                {/* Status Banner */}
                <div
                  className={`p-2.5 rounded-md border text-xs font-medium leading-relaxed ${
                    output.scalability.halted
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : output.recommended_pathway ===
                        'NonLinguisticStructuralResonance'
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  {output.scalability.halted ? (
                    <span className="flex items-center gap-1.5 font-semibold text-rose-300 mb-1">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      ✖ Halted: Capacity Guard Triggered
                    </span>
                  ) : output.recommended_pathway ===
                    'NonLinguisticStructuralResonance' ? (
                    <span className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      ▲ Pivot: Structural Resonance Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-300 mb-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ● Nominal: 8-Bit Octeract Bijection
                    </span>
                  )}
                  {output.scalability.explanation}
                </div>

                {/* Interactive Unique Sign Count Slider/Stepper */}
                <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="unique-signs-input"
                      className="text-slate-300 font-medium"
                    >
                      Unique Signs (N)
                    </label>
                    <input
                      id="unique-signs-input"
                      type="number"
                      min={1}
                      max={2048}
                      value={inputState.unique_sign_count}
                      onChange={(e) =>
                        handleUpdateUniqueSigns(Number(e.target.value))
                      }
                      className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-right font-mono text-xs text-sky-300 tabular-nums"
                    />
                  </div>
                  <input
                    type="range"
                    aria-label="Unique Signs Slider"
                    min={10}
                    max={600}
                    value={Math.min(600, inputState.unique_sign_count)}
                    onChange={(e) =>
                      handleUpdateUniqueSigns(Number(e.target.value))
                    }
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Alphabet (20–40)</span>
                    <span>Octeract Cap (256)</span>
                    <span>Enneact (512)</span>
                  </div>
                </div>

                {/* Telemetry Key-Values */}
                <div className="divide-y divide-slate-800/80 text-xs">
                  <div className="py-1.5 flex justify-between gap-2">
                    <span className="text-slate-400">Corpus Name</span>
                    <span className="font-mono text-slate-200 text-right">
                      {inputState.corpus_name}
                    </span>
                  </div>
                  <div className="py-1.5 flex justify-between gap-2">
                    <span className="text-slate-400">Required Hypercube</span>
                    <span className="font-mono font-semibold text-sky-300">
                      {output.scalability.hypercube_designation}
                    </span>
                  </div>
                  <div className="py-1.5 flex justify-between gap-2">
                    <span className="text-slate-400">State Space (2ⁿ)</span>
                    <span className="font-mono text-slate-200 tabular-nums">
                      {output.scalability.state_space_capacity} states
                    </span>
                  </div>
                  <div className="py-1.5 flex justify-between gap-2">
                    <span className="text-slate-400">Inferred Typology</span>
                    <span className="font-mono text-amber-300 text-right">
                      {output.inferred_script_typology}
                    </span>
                  </div>
                  <div className="py-1.5 flex justify-between items-baseline gap-2">
                    <span className="text-slate-400 shrink-0">Recommended Pathway</span>
                    <span className="font-mono text-[11px] text-emerald-300 text-right break-all">
                      {output.recommended_pathway}
                    </span>
                  </div>
                </div>
              </section>

              {/* 3. Non-Linguistic Pivot Checklist (Section 4.1) */}
              <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    03. Non-Linguistic Pivot (Sec 4.1)
                  </h2>
                  <span className="font-mono text-xs text-purple-300 tabular-nums">
                    {activeTriggerCount}/4 Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  When ≥ 2 anomaly triggers hold, Theorem 7 forces Structural Resonance Analysis over Q₈ k-faces.
                </p>
                {(
                  [
                    {
                      key: 'extreme_corpus_brevity',
                      label: 'Extreme Corpus Brevity (e.g. < 300 tokens)',
                    },
                    {
                      key: 'statistical_isolation',
                      label: 'Statistical Isolation (Hapax Script Artifact)',
                    },
                    {
                      key: 'manufacturing_paradox',
                      label: 'Manufacturing Paradox (Stamps for 1 Object)',
                    },
                    {
                      key: 'deliberate_permanence',
                      label: 'Deliberate Permanence (Fired Clay Record)',
                    },
                  ] as const
                ).map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer select-none py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={inputState.triggers[item.key]}
                      onChange={() => handleToggleTrigger(item.key)}
                      className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </section>

              {/* 4. Interactive Constraint Lock (Section 3.4) */}
              <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-2">
                  04. Interactive Constraint Lock (Sec 3.4)
                </h2>
                <form onSubmit={handleInjectConstraint} className="flex flex-col gap-2.5">
                  <div>
                    <label
                      htmlFor="lock-sign-select"
                      className="block text-[11px] text-slate-400 mb-1"
                    >
                      Target Mapped Sign
                    </label>
                    <select
                      id="lock-sign-select"
                      value={constraintSignId}
                      onChange={(e) => setConstraintSignId(e.target.value)}
                      disabled={inputState.signs.length === 0}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                    >
                      {inputState.signs.length === 0 ? (
                        <option value="">No signs in active vector</option>
                      ) : (
                        inputState.signs.map((s) => (
                          <option key={s.sign_id} value={s.sign_id}>
                            {s.sign_id} (freq: {s.frequency})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="lock-phonetic-input"
                      className="block text-[11px] text-slate-400 mb-1"
                    >
                      Phonetic / Functional Value Hypothesis
                    </label>
                    <input
                      id="lock-phonetic-input"
                      type="text"
                      value={constraintValue}
                      onChange={(e) => setConstraintValue(e.target.value)}
                      placeholder="e.g. /ka/ (velar series)"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>

                  {constraintError && (
                    <div className="text-xs text-rose-300 bg-rose-950/50 border border-rose-500/40 rounded px-2.5 py-1.5">
                      {constraintError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={inputState.signs.length === 0}
                    className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Inject Constraint & Propagate (d ≤ 2)
                  </button>
                </form>

                {/* Active Locked Constraints List */}
                {inputState.locked_constraints.length > 0 && (
                  <div className="pt-1 flex flex-col gap-1.5">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Active Locked Anchors:
                    </div>
                    {inputState.locked_constraints.map((lc) => (
                      <div
                        key={lc.sign_id}
                        className="flex items-center justify-between gap-2 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-mono font-semibold text-amber-300">
                            {lc.sign_id}
                          </span>
                          <span className="text-slate-300"> → {lc.locked_value}</span>
                        </div>
                        <button
                          type="button"
                          aria-label={`Unlock constraint on ${lc.sign_id}`}
                          onClick={() => handleClearConstraint(lc.sign_id)}
                          className="text-slate-400 hover:text-rose-300 shrink-0"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* CENTER COLUMN (5 Cols): Q_8 Petrie Hypercube Canvas + GSA Clusters & Ligatures */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <HypercubeCanvas
                input={inputState}
                output={output}
                selectedVertex={selectedVertex}
                onSelectVertex={setSelectedVertex}
                highlightedClusterMask={highlightedClusterMask}
              />

              {/* GSA 3-Cube Subspace Clusters & Shortest-Path Ligatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3-Cube Subspaces */}
                <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                      GSA 3-Cube Subspace Clusters
                    </h3>
                    <span className="font-mono text-xs text-slate-400">
                      k = 3 (8 states)
                    </span>
                  </div>
                  {output.clusters.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">
                      {output.scalability.halted
                        ? 'Halted — scale to higher-dimensional hypercube.'
                        : 'No multi-sign 3-cube clusters with shared upper 5-bit prefix.'}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {output.clusters.map((cl) => {
                        const isHighlighted =
                          highlightedClusterMask === cl.subspace_mask_wildcard;
                        return (
                          <button
                            key={cl.subspace_mask_wildcard}
                            type="button"
                            onClick={() =>
                              setHighlightedClusterMask(
                                isHighlighted ? null : cl.subspace_mask_wildcard
                              )
                            }
                            className={`text-left p-2.5 rounded border transition-colors text-xs ${
                              isHighlighted
                                ? 'bg-purple-500/20 border-purple-400 text-slate-100'
                                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between font-mono">
                              <span className="text-purple-300 font-semibold">
                                Mask: {cl.subspace_mask_wildcard}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {cl.member_sign_ids.length} signs
                              </span>
                            </div>
                            <div className="font-mono text-[11px] text-slate-300 mt-1">
                              Members: {cl.member_sign_ids.join(', ')}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>

                {/* Compositional Ligatures & Structural Resonance */}
                <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                      {output.structural_resonance_matches.length > 0
                        ? 'Q₈ Structural Resonance Matches'
                        : 'Geodesic Ligature Paths (Sec 2.3)'}
                    </h3>
                  </div>

                  {output.structural_resonance_matches.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {output.structural_resonance_matches.map((m, i) => (
                        <div
                          key={i}
                          className="bg-purple-950/30 border border-purple-500/40 rounded p-2.5 text-xs"
                        >
                          <div className="font-semibold text-purple-200">
                            {m.octeract_entity}
                          </div>
                          <div className="font-mono text-slate-300 mt-1 flex justify-between">
                            <span>Observed: {m.observed_value}</span>
                            <span>Canonical Q₈: {m.canonical_octeract_value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : output.ligature_paths.length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">
                      No ligature triples configured in this corpus vector.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {output.ligature_paths.map((lp) => (
                        <div
                          key={lp.composite_sign_id}
                          className="bg-slate-900/80 border border-slate-800 rounded p-2.5 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sky-300 font-semibold">
                              {lp.composite_sign_id}
                            </span>
                            <span
                              className={
                                lp.on_shortest_hamming_path
                                  ? 'text-emerald-400'
                                  : 'text-amber-300'
                              }
                            >
                              {lp.on_shortest_hamming_path
                                ? '● Geodesic True'
                                : '▲ Off-Geodesic'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            XOR Interaction w(V(C) ⊕ V(A) ⊕ V(B)) ={' '}
                            <span className="text-slate-200">
                              {lp.xor_interaction_weight} bits
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>

            {/* RIGHT COLUMN (4 Cols): OCM Simulated Annealing Telemetry, Propagated Constraints & Verified JSON Output */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* OCM & GSA Telemetry Card */}
              <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    05. OCM Simulated Annealing & GSA Telemetry
                  </h2>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <label htmlFor="sa-seed-input" className="text-slate-400">
                      Seed:
                    </label>
                    <input
                      id="sa-seed-input"
                      type="number"
                      min={1}
                      max={99999}
                      value={inputState.sa_seed}
                      onChange={(e) => handleUpdateSaSeed(Number(e.target.value))}
                      className="w-16 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-right text-sky-300 tabular-nums"
                    />
                    <button
                      type="button"
                      aria-label="Cycle SA Seed"
                      onClick={() => handleUpdateSaSeed(inputState.sa_seed + 1)}
                      className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                      title="Increment PRNG Seed to explore alternative 2-opt trajectories"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      INITIAL QAP COST
                    </div>
                    <div className="text-lg font-mono font-bold text-slate-200 tabular-nums mt-0.5">
                      {output.ocm
                        ? output.ocm.initial_qap_cost.toLocaleString()
                        : 'HALTED'}
                    </div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      OPTIMIZED QAP COST (2-OPT)
                    </div>
                    <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums mt-0.5">
                      {output.ocm
                        ? output.ocm.optimized_qap_cost.toLocaleString()
                        : 'HALTED'}
                    </div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      COST REDUCTION RATIO
                    </div>
                    <div className="text-base font-mono font-semibold text-sky-300 tabular-nums mt-0.5">
                      {output.ocm
                        ? `${(output.ocm.cost_reduction_ratio_q1000 / 10).toFixed(1)} %`
                        : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 rounded p-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400">
                      PALEOGENETIC DIVERGENCE
                    </div>
                    <div className="text-base font-mono font-semibold text-amber-300 tabular-nums mt-0.5">
                      {output.paleogenetic_divergence_q1000 !== undefined
                        ? `${(output.paleogenetic_divergence_q1000 / 1000).toFixed(2)} bits`
                        : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Consequence Propagation Output */}
                {Object.keys(output.propagated_constraints).length > 0 && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded p-3 flex flex-col gap-1.5">
                    <div className="text-xs font-semibold text-amber-300">
                      Propagated Phonetic/Semantic Consequences (d ≤ 2):
                    </div>
                    {Object.entries(output.propagated_constraints).map(
                      ([rootSign, neighbors]) => (
                        <div key={rootSign} className="text-xs space-y-1">
                          <div className="font-mono text-slate-300">
                            Root Anchor: <span className="text-sky-300">{rootSign}</span> (
                            {toHexString8(output.ocm?.assigned_vectors[rootSign] ?? 0)})
                          </div>
                          {neighbors.length === 0 ? (
                            <div className="text-slate-400 text-[11px] pl-2">
                              No mapped neighbors within Hamming radius d ≤ 2.
                            </div>
                          ) : (
                            <ul className="pl-3 space-y-0.5 font-mono text-[11px] text-emerald-300">
                              {neighbors.map((nStr, idx) => (
                                <li key={idx}>→ {nStr}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Mapped Constellation Bijection Table */}
                {output.ocm && Object.keys(output.ocm.assigned_vectors).length > 0 && (
                  <div className="border border-slate-800 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                          <th className="py-1.5 px-2.5">SIGN ID</th>
                          <th className="py-1.5 px-2.5">VERTEX HEX</th>
                          <th className="py-1.5 px-2.5">BINARY (𝔽₂)⁸</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {Object.entries(output.ocm.assigned_vectors).map(
                          ([signId, vec]) => (
                            <tr
                              key={signId}
                              onClick={() => setSelectedVertex(vec)}
                              className="hover:bg-slate-900/70 cursor-pointer"
                            >
                              <td className="py-1.5 px-2.5 text-sky-300 font-semibold">
                                {signId}
                              </td>
                              <td className="py-1.5 px-2.5 text-amber-300">
                                {toHexString8(vec)}
                              </td>
                              <td className="py-1.5 px-2.5 text-slate-300">
                                {toBitString8(vec)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Verified OcteractOutput JSON */}
              <section className="bg-[#111827] border border-slate-800 rounded-lg p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                    Verified OcteractOutput JSON
                  </h2>
                  <span className="font-mono text-[11px] text-emerald-400">
                    prism/replay/v1
                  </span>
                </div>
                <pre
                  data-testid="verified-json-output"
                  className="bg-[#070A12] border border-slate-800 rounded p-3 text-[11px] font-mono text-sky-200 overflow-x-auto max-h-[340px] leading-relaxed"
                >
                  {JSON.stringify(output, null, 2)}
                </pre>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'trinity' && (
          <AlgebraicWorkbench
            selectedVertexA={selectedVertex}
            onSelectVertexA={setSelectedVertex}
          />
        )}

        {activeTab === 'signary' && (
          <SignaryMatrix
            input={inputState}
            output={output}
            onUpdateInput={setInputState}
            onSelectVertex={(v) => {
              setSelectedVertex(v);
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'specs' && <SpecificationInspector />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 px-6 py-3 mt-8 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-4">
        <div>
          Octeract Cypher · 8-Dimensional Hypercube (Q₈) Algebraic & Geometric Script Analysis
        </div>
        <div className="font-mono">
          Elementary Abelian Group (ℤ/2ℤ)⁸ · 256 Vertices · 10,321,920 Automorphisms
        </div>
      </footer>
    </div>
  );
}
