'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaShieldAlt, FaSpinner, FaCheckCircle, FaExclamationCircle, FaArrowLeft, FaUserShield } from 'react-icons/fa';

const ADMIN_PHONES = ['03458340668', '03458340669'];

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPhone, setSelectedPhone] = useState(ADMIN_PHONES[0]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/admin/verify-session');
        if (res.ok) router.push('/admin');
      } catch {}
    };
    init();
  }, [router]);

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: selectedPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage('OTP sent via WhatsApp');
      setStep('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: code, phone: selectedPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#B80000] to-red-600 p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FaLock className="text-2xl text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70 text-sm mt-1">Secure Admin Access</p>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <FaShieldAlt className="text-3xl text-[#B80000] mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Only authorized admins can access this panel</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Admin Phone</label>
                    <div className="space-y-2">
                      {ADMIN_PHONES.map(phone => (
                        <button
                          key={phone}
                          onClick={() => setSelectedPhone(phone)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition-all ${
                            selectedPhone === phone
                              ? 'bg-[#B80000]/5 border-[#B80000] text-[#B80000]'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <FaUserShield className={selectedPhone === phone ? 'text-[#B80000]' : 'text-gray-400'} />
                          <span className="font-semibold text-sm">{phone}</span>
                          {selectedPhone === phone && <FaCheckCircle className="ml-auto text-[#B80000] text-xs" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                      <FaExclamationCircle />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <><FaSpinner className="animate-spin" /> Sending OTP...</> : <>Send OTP to WhatsApp</>}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {message && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
                      <FaCheckCircle />
                      <span>{message}</span>
                    </div>
                  )}

                  <div className="text-center mb-2">
                    <p className="text-gray-600 text-sm">Enter the 6-digit code sent to</p>
                    <p className="font-semibold text-gray-900">{selectedPhone}</p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => { otpRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                        onKeyDown={e => handleOtpKeyDown(index, e)}
                        autoComplete="one-time-code"
                        className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                      <FaExclamationCircle />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleVerify}
                    disabled={loading || otp.some(d => !d)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <><FaSpinner className="animate-spin" /> Verifying...</> : <>Verify & Login</>}
                  </button>

                  <button
                    onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); setError(''); }}
                    className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FaArrowLeft className="text-xs" /> Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          &copy; {new Date().getFullYear()} Peerzada Store — Admin Panel
        </p>
      </motion.div>
    </div>
  );
}
