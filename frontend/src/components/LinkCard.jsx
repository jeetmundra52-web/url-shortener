import React from 'react';

export default function LinkCard({ link }) {
  const short = `http://localhost:5173/r/${link.alias}`;
  async function copy() {
    await navigator.clipboard.writeText(short);
    alert('Copied');
  }
  return (
    <div className="bg-white p-3 rounded shadow flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{link.customTitle || link.alias}</div>
        <div className="text-xs text-gray-500">{short}</div>
      </div>
      <div className="space-x-2">
        <a className="px-3 py-1 border rounded" href={short} target="_blank">Open</a>
        <button onClick={copy} className="px-3 py-1 border rounded">Copy</button>
      </div>
    </div>
  );
}
