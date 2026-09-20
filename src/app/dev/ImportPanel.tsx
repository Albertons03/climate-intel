'use client';

import { useState } from 'react';

type ImportSuccess = {
  ok: true;
  preparedCount: number;
  savedCount: number;
  sourceErrors: unknown[];
};

type ImportState =
  | { status: 'idle' }
  | { status: 'loading' }
  | {
      status: 'success';
      preparedCount: number;
      savedCount: number;
      sourceErrorCount: number;
    }
  | { status: 'error' };

export default function ImportPanel() {
  const [state, setState] = useState<ImportState>({ status: 'idle' });  

  async function handleImport() {
    setState({ status: 'loading' });

    try {
      const response = await fetch('/api/dev/import-rss', { method: 'POST' });

      if (!response.ok) {
        setState({ status: 'error' });
        return;
      }

      const result: unknown = await response.json();

      if (!isImportSuccess(result)) {
        setState({ status: 'error' });
        return;
      }

      setState({
        status: 'success',
        preparedCount: result.preparedCount,
        savedCount: result.savedCount,
        sourceErrorCount: result.sourceErrors.length,
      });
    } catch {
      setState({ status: 'error' });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
        <h1 className="text-2xl font-semibold tracking-tight">RSS import</h1>
        <button
          className="mt-6 rounded-lg bg-zinc-950 px-4 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={state.status === 'loading'}
          onClick={handleImport}
          type="button"
        >
          RSS import indítása
        </button>

        {state.status === 'loading' && <p className="mt-6 text-zinc-600">Import folyamatban...</p>}

        {state.status === 'success' && (
          <div className="mt-6 space-y-2 text-zinc-700">
            <p>Előkészített cikkek: {state.preparedCount}</p>
            <p>Újonnan mentett cikkek: {state.savedCount}</p>
            <p>Forráshibák: {state.sourceErrorCount}</p>
            {state.savedCount === 0 && <p>Nem került új cikk mentésre.</p>}
          </div>
        )}

        {state.status === 'error' && <p className="mt-6 text-red-700">Az RSS import nem sikerült.</p>}
      </section>
    </main>
  );
}

function isImportSuccess(value: unknown): value is ImportSuccess {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const result = value as Record<string, unknown>;

  return (
    result.ok === true &&
    typeof result.preparedCount === 'number' &&
    typeof result.savedCount === 'number' &&
    Array.isArray(result.sourceErrors)
  );
}
