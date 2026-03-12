'use client';

import { motion } from 'framer-motion';

const nodes = [
  { id: 'gateway', label: 'GW', coordinates: '(0,0)' },
  { id: 'about', label: 'AB', coordinates: '(2,1)' },
  { id: 'projects', label: 'PR', coordinates: '(5,3)' },
  { id: 'playground', label: 'LAB', coordinates: '(7,4)' },
  { id: 'contact', label: 'CT', coordinates: '(9,6)' }
];

export function DynamicCompass() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bento-card fixed bottom-6 right-6 z-50 hidden w-44 rounded-2xl p-3 md:block"
    >
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">Compass</p>
      <ul className="space-y-2">
        {nodes.map((node) => (
          <li key={node.id}>
            <a
              href={`#${node.id}`}
              className="flex items-center justify-between rounded-md px-2 py-1 text-xs text-[color:var(--text-muted)] transition hover:bg-white/5 hover:text-[color:var(--text)]"
            >
              <span className="font-mono">{node.label}</span>
              <span className="font-mono text-[10px]">{node.coordinates}</span>
            </a>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
