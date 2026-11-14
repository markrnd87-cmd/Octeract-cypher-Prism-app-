import React, { useState } from 'react';
import { FEATURE_BIT_LABELS } from '../data/presets';
import { encodeFeatures, hammingWeight, toBitString8, toHexString8 } from '../engine/octeractEngine';
import { FeatureSchema8, OcteractInput, OcteractOutput, SignRecord } from '../types/octeract';
import { Plus, Sliders, Trash2 } from 'lucide-react';

interface SignaryMatrixProps {
  input: OcteractInput;
  output: OcteractOutput;
  onUpdateInput: (updated: OcteractInput) => void;
  onSelectVertex: (v: number) => void;
}

export const SignaryMatrix: React.FC<SignaryMatrixProps> = ({
  input,
  output,
  onUpdateInput,
  onSelectVertex,
}) => {
  const [newSignId, setNewSignId] = useState<string>('');
  const [newSignFreq, setNewSignFreq] = useState<string>('65');
  const [formError, setFormError] = useState<string | null>(null);

  const handleToggleFeatureBit = (
    signIndex: number,
    featureKey: keyof FeatureSchema8
  ) => {
    const updatedSigns = input.signs.map((s, idx) => {
      if (idx !== signIndex) return s;
      return {
        ...s,
        features: {
          ...s.features,
          [featureKey]: !s.features[featureKey],
        },
      };
    });
    onUpdateInput({
      ...input,
      signs: updatedSigns,
    });
  };

  const handleAddSign = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSignId.trim().toUpperCase().replace(/\s+/g, '_');
    const freqNum = parseInt(newSignFreq, 10);

    if (!trimmed) {
      setFormError('Sign ID is required (e.g., AB_24_NE).');
      return;
    }
    if (input.signs.some((s) => s.sign_id === trimmed)) {
      setFormError(`Sign '${trimmed}' already exists in this corpus.`);
      return;
    }
    if (Number.isNaN(freqNum) || freqNum <= 0) {
      setFormError('Frequency must be a positive integer.');
      return;
    }

    setFormError(null);
    const newRecord: SignRecord = {
      sign_id: trimmed,
      frequency: freqNum,
      features: {
        bit0_high_frequency: freqNum >= 100,
        bit1_pos_initial: false,
        bit2_pos_final: true,
        bit3_func_class_primary: false,
        bit4_func_class_secondary: true,
        bit5_paleo_complex: true,
        bit6_paleo_curved: false,
        bit7_structural_role: false,
      },
    };

    const nextSigns = [...input.signs, newRecord];
    // Expand symmetric similarity matrix with default 600 similarity to existing signs
    const nOld = input.similarity_matrix_q1000.length;
    const nextMatrix = input.similarity_matrix_q1000.map((row) => [...row, 640]);
    const newRow = new Array(nOld).fill(640);
    newRow.push(1000);
    nextMatrix.push(newRow);

    onUpdateInput({
      ...input,
      signs: nextSigns,
      similarity_matrix_q1000: nextMatrix,
    });
    setNewSignId('');
  };

  const handleRemoveSign = (signId: string, idx: number) => {
    const nextSigns = input.signs.filter((_, i) => i !== idx);
    const nextMatrix = input.similarity_matrix_q1000
      .filter((_, r) => r !== idx)
      .map((row) => row.filter((_, c) => c !== idx));
    const nextLocks = input.locked_constraints.filter((c) => c.sign_id !== signId);

    onUpdateInput({
      ...input,
      signs: nextSigns,
      similarity_matrix_q1000: nextMatrix,
      locked_constraints: nextLocks,
    });
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Table 2.1: 8-Bit Feature Vector Schema & Signary Encoder
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle any binary feature bit (b0..b7) to recompute its initial (𝔽₂)⁸ coordinate and re-run Simulated Annealing OCM
          </p>
        </div>

        {/* Add New Sign Form */}
        <form onSubmit={handleAddSign} className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            aria-label="New Sign ID"
            placeholder="Sign ID (e.g. AB_24_NE)"
            value={newSignId}
            onChange={(e) => setNewSignId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono w-44"
          />
          <input
            type="number"
            aria-label="New Sign Frequency"
            placeholder="Freq"
            value={newSignFreq}
            onChange={(e) => setNewSignFreq(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono w-20"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Sign Vector
          </button>
        </form>
      </div>

      {formError && (
        <div role="alert" className="bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs px-3 py-2 rounded">
          {formError}
        </div>
      )}

      {input.signs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-md p-6 text-center text-xs text-slate-400">
          No individual sign records loaded for <span className="text-slate-200 font-medium">{input.corpus_name}</span>. Use the form above to add a sign vector or switch to the Linear A or Phaistos Disk preset.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 rounded-md">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">SIGN ID</th>
                <th className="py-2.5 px-2.5 text-right">FREQ</th>
                {FEATURE_BIT_LABELS.map((f) => (
                  <th key={f.key} className="py-2.5 px-2 text-center" title={f.fullTitle}>
                    {f.shortLabel}
                  </th>
                ))}
                <th className="py-2.5 px-3">ENCODED (𝔽₂)⁸</th>
                <th className="py-2.5 px-3">OCM VERTEX</th>
                <th className="py-2.5 px-2 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono tabular-nums">
              {input.signs.map((sign, idx) => {
                const rawVec = encodeFeatures(sign.features);
                const ocmVec = output.ocm?.assigned_vectors[sign.sign_id] ?? rawVec;
                return (
                  <tr key={sign.sign_id} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 font-semibold text-sky-300">
                      <button
                        type="button"
                        onClick={() => onSelectVertex(ocmVec)}
                        className="hover:underline text-left"
                      >
                        {sign.sign_id}
                      </button>
                    </td>
                    <td className="py-2.5 px-2.5 text-right text-slate-300">
                      {sign.frequency}
                    </td>
                    {FEATURE_BIT_LABELS.map((f) => {
                      const active = sign.features[f.key];
                      return (
                        <td key={f.key} className="py-2 px-1.5 text-center">
                          <button
                            type="button"
                            aria-label={`${sign.sign_id} toggle ${f.shortLabel}`}
                            onClick={() => handleToggleFeatureBit(idx, f.key)}
                            className={`w-8 py-1 rounded border text-xs font-semibold transition-colors ${
                              active
                                ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {active ? '1' : '0'}
                          </button>
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-slate-300">
                      {toBitString8(rawVec)} ({toHexString8(rawVec)})
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 font-semibold">
                      {toHexString8(ocmVec)} · w={hammingWeight(ocmVec)}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button
                        type="button"
                        aria-label={`Remove sign ${sign.sign_id}`}
                        onClick={() => handleRemoveSign(sign.sign_id, idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Axis Reference Key */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {FEATURE_BIT_LABELS.map((f) => (
          <div
            key={f.key}
            className="bg-slate-900/70 border border-slate-800/90 rounded p-2.5 text-xs"
          >
            <div className="font-mono font-semibold text-sky-300">{f.fullTitle}</div>
            <div className="text-slate-400 mt-0.5 leading-snug">{f.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
