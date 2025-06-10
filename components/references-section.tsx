'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { memo } from 'react';

interface ReferenceItem {
  id: string;
  ref: string;
}

interface ReferencesSectionProps {
  references: string[] | ReferenceItem[];
  className?: string;
}

function ReferencesSectionComponent({ references, className }: ReferencesSectionProps) {
  if (!references?.length) return null;

  // Handle both string[] and ReferenceItem[] formats for backward compatibility
  const normalizedRefs = references.map((ref, index) => {
    if (typeof ref === 'string') {
      return {
        id: `ref-${index + 1}`,
        ref
      };
    }
    return ref;
  });

  return (
    <div className={cn('mt-12 pt-6 border-t border-gray-200 dark:border-gray-800', className)}>
      <h2 id="references" className="text-2xl font-bold mb-4">References</h2>
      <ol className="list-decimal pl-5 space-y-3">
        {normalizedRefs.map((item, index) => {
          // Extract reference number from ID or use index as fallback
          const refNumber = item.id ? item.id.replace('ref-', '') : index + 1;
          return (
            <li 
              key={item.id || index}
              id={item.id || `ref-${index + 1}`}
              className="text-sm text-gray-700 dark:text-gray-300 relative pl-6"
            >
              <Link 
                href={`#ref-link-${refNumber}`}
                className="absolute -left-1 -top-0.5 text-blue-600 dark:text-blue-400 hover:underline text-xs font-mono"
                aria-label="Back to citation in text"
                title="Back to citation in text"
                scroll={false}
              >
                ↩
              </Link>
              <span className="inline-block ml-1">{item.ref}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export const ReferencesSection = memo(ReferencesSectionComponent);
