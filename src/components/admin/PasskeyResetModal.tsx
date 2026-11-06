'use client';

import React from 'react';
import { KeyRound, X } from 'lucide-react';

interface PasskeyResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPortal?: 'admin' | 'owner';
}

// Passkeys are verified on the server and stored only in Vercel environment variables.
// They can't be reset from the browser: any check done in page JavaScript (like the old
// "registered mobile number" check) is visible to everyone and can be bypassed.
export default function PasskeyResetModal({ isOpen, onClose, defaultPortal = 'admin' }: PasskeyResetModalProps) {
  if (!isOpen) return null;
  const envVar = defaultPortal === 'owner' ? 'OWNER_PASSKEY' : 'ADMIN_PASSKEY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="passkey-help-title"
        className="relative w-full max-w-md rounded-2xl bg-neutral-900 border border-white/15 p-6 text-white shadow-2xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#B8860B]/15 border border-[#B8860B]/40 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <h2 id="passkey-help-title" className="text-lg font-bold">
            Change the {defaultPortal === 'owner' ? 'owner' : 'admin'} passkey
          </h2>
        </div>
        <ol className="space-y-2 text-sm text-neutral-300 list-decimal pl-5">
          <li>Open the project in Vercel, then Settings → Environment Variables.</li>
          <li>
            Edit <code className="text-[#D4AF37]">{envVar}</code> and save the new passkey.
          </li>
          <li>Redeploy the site. The new passkey works right after the deploy finishes.</li>
        </ol>
        <p className="mt-4 text-xs text-neutral-500">
          Forgot the passkey? Ask the person who manages the Vercel project. Passkeys can no longer be reset from this
          page.
        </p>
      </div>
    </div>
  );
}
