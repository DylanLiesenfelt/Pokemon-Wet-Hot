import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface DevLogProps {
  src: string;
}

function DevLog({ src }: DevLogProps) {
  const [open, setOpen] = useState(false);
  const [md, setMd] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.text();
      })
      .then((text) => { if (!cancelled) { setMd(text); setError(null); } })
      .catch((e) => { if (!cancelled) setError(String(e?.message ?? e)); });
    return () => { cancelled = true; };
  }, [src]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded bg-neutral-800 px-3 py-1 text-sm text-neutral-100 transition-colors hover:bg-neutral-700"
      >
        Dev Log {open ? '\u25B2' : '\u25BC'}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 max-h-[calc(100vh-5rem)] w-[70vw] max-w-[70vw]
                        overflow-x-hidden overflow-y-auto
                        rounded-lg border border-neutral-700 bg-neutral-900 p-4 shadow-xl">
          {error ? (
            <p className="text-sm text-red-400">Failed to load {src}: {error}</p>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none break-words
                            [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-hidden
                            [&_code]:break-words [&_code]:whitespace-pre-wrap">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{md}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DevLog;