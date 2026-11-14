import React, { useState } from 'react';
import { SPEC_ARTIFACTS } from '../data/presets';
import { Check, Copy, FileCode, Terminal } from 'lucide-react';

export const SpecificationInspector: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string>(SPEC_ARTIFACTS[0].path);
  const [copied, setCopied] = useState<boolean>(false);

  const activeArtifact =
    SPEC_ARTIFACTS.find((a) => a.path === selectedPath) ?? SPEC_ARTIFACTS[0];

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeArtifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-sky-400" />
            UOR Prism Package Artifacts & LexLean Formal Proofs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect the complete octeract-cypher repository files, prism.toml capability policy, intent.md invariants, and Rust Layer-3 crate
          </p>
        </div>
        <div className="font-mono text-xs text-emerald-400 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          Assurance Level: P2 (prism/proof/v1 + prism/replay/v1)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left File Tree Selector */}
        <div className="lg:col-span-4 flex flex-col gap-1.5">
          {SPEC_ARTIFACTS.map((item) => {
            const isSelected = item.path === activeArtifact.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => setSelectedPath(item.path)}
                className={`text-left p-3 rounded-md border transition-colors ${
                  isSelected
                    ? 'bg-sky-500/15 border-sky-500/50 text-slate-100'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-sky-300">
                    {item.path}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.category}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {item.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 flex flex-col bg-[#070A12] border border-slate-800 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
            <div>
              <span className="font-mono text-xs font-semibold text-slate-200">
                octeract-cypher/{activeArtifact.path}
              </span>
              <span className="text-xs text-slate-400 ml-3">
                · {activeArtifact.description}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Artifact
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-sky-200 overflow-x-auto leading-relaxed max-h-[520px]">
            {activeArtifact.content}
          </pre>
        </div>
      </div>
    </div>
  );
};
