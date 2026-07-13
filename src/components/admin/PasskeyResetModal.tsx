'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ShieldCheck, AlertCircle, CheckCircle2, X, Phone, Lock } from 'lucide-react';

interface PasskeyResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPortal?: 'admin' | 'owner';
}

export default function PasskeyResetModal({
  isOpen,
  onClose,
  defaultPortal = 'admin',
}: PasskeyResetModalProps) {
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedPortal, setSelectedPortal] = useState<'admin' | 'owner'>(defaultPortal);
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone !== '9492522074' && cleanPhone !== '919492522074') {
      setErrorMsg('Authorization Failed: Incorrect registered management mobile number.');
      return;
    }

    if (!newPasskey.trim() || newPasskey.trim().length < 4) {
      setErrorMsg('Passkey must be at least 4 characters long.');
      return;
    }

    if (newPasskey.trim() !== confirmPasskey.trim()) {
      setErrorMsg('New passkey and confirmation passkey do not match.');
      return;
    }

    try {
      if (selectedPortal === 'admin') {
        localStorage.setItem('ps_custom_admin_passkey', newPasskey.trim());
      } else {
        localStorage.setItem('ps_custom_owner_passkey', newPasskey.trim());
      }
      setSuccessMsg(
        `Successfully reset the ${
          selectedPortal === 'admin' ? 'Admin Portal' : 'Owner Financial Portal'
        } passkey! You can now authenticate with your new passkey.`
      );
      setPhoneInput('');
      setNewPasskey('');
      setConfirmPasskey('');
    } catch (err) {
      setErrorMsg('Failed to save passkey to device storage.');
    }
  };

  const handleClose = () => {
    setErrorMsg('');
    setSuccessMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#141414] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg text-black">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#D4AF37]">
                  2FA Mobile Auth
                </span>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Reset Portal Passkey
                </h3>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 mb-6 leading-relaxed">
            Authorized portal password resets require verification with the registered executive management mobile number.
          </p>

          <form onSubmit={handleReset} className="space-y-4">
            {/* Phone Number Input */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Registered Management Mobile Number *</span>
              </label>
              <input
                type="text"
                placeholder="Enter registered mobile number..."
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-sm placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            {/* Portal Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1.5">
                Select Portal to Reset *
              </label>
              <select
                value={selectedPortal}
                onChange={(e) => setSelectedPortal(e.target.value as 'admin' | 'owner')}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="admin">Receptionist Admin Desk (/admin)</option>
                <option value="owner">Executive Owner Portal (/owner-analytics)</option>
              </select>
            </div>

            {/* New Passkey */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>New Security Passkey *</span>
              </label>
              <input
                type="password"
                placeholder="Enter new secure passkey"
                value={newPasskey}
                onChange={(e) => setNewPasskey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-sm placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            {/* Confirm New Passkey */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1.5">
                Confirm New Security Passkey *
              </label>
              <input
                type="password"
                placeholder="Re-enter new passkey"
                value={confirmPasskey}
                onChange={(e) => setConfirmPasskey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-sm placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-90 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#B8860B]/30 transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save Passkey</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
