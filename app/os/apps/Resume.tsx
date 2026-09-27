'use client';

import { Download, ExternalLink, FileText } from 'lucide-react';
import { profile } from '@/data/portfolio';
import { useIsMobile } from '../hooks';

export default function Resume() {
  const isMobile = useIsMobile();
  const actions = (
    <div className="flex gap-2">
      <a href={profile.links.resume} download="Dhwanil_Panchani_Resume.pdf" className="btn-primary">
        <Download className="h-4 w-4" /> Download
      </a>
      <a href={profile.links.resume} target="_blank" rel="noreferrer" className="btn">
        <ExternalLink className="h-4 w-4" /> Open
      </a>
    </div>
  );

  // Mobile browsers render inline PDFs poorly; offer the file instead.
  if (isMobile) {
    return (
      <div className="grid h-full place-items-center p-8 text-center">
        <div>
          <FileText className="mx-auto h-12 w-12 text-fg-dim" />
          <p className="mt-3 font-serif text-2xl italic text-fg">resume.pdf</p>
          <div className="mt-5 flex justify-center">{actions}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <span className="font-mono text-[11px] text-fg-faint">/documents/resume.pdf</span>
        {actions}
      </div>
      <iframe src={`${profile.links.resume}#view=FitH&toolbar=0`} title="Résumé" className="min-h-0 flex-1 bg-white" />
    </div>
  );
}
