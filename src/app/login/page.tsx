'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { 
  FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, 
  FaGoogle, FaStore, FaArrowLeft, FaCheckCircle,
  FaSpinner, FaPhone, FaExclamationCircle, FaRocket
} from 'react-icons/fa';
import type { Variants } from 'framer-motion';

type AuthMode = 'login' | 'signup';
type Step = 'form' | 'otp' | 'success';

const easeOutCustom = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutCustom } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOutCustom } },
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [mode, setMode] = useState<AuthMode>('login');
  const [step, setStep] = useState<Step>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [agreed, setAgreed] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  // Handle OAuth errors from URL params
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      const errorMessages: Record<string, string> = {
        OAuthAccountNotLinked: 'This email is already linked to another account. Please sign in using the original method.',
        OAuthSignin: 'Could not sign in with Google. Please try again.',
        OAuthCallback: 'Google sign in failed. Please try again.',
        OAuthCreateAccount: 'Could not create account with Google.',
        AccessDenied: 'You denied access to your Google account.',
        Configuration: 'Server configuration error. Please contact support.',
        CredentialsSignin: 'Invalid email or password. Please try again.',
        default: 'An error occurred during sign in. Please try again.',
      };
      setError(errorMessages[oauthError] || errorMessages.default);
      // Clean the URL - remove error param
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      newUrl.searchParams.delete('callbackUrl');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  if (status === 'authenticated') {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');

    if (name === 'password') {
      calculateStrength(value);
    }
  };

  const calculateStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 6) score += 25;
    if (pw.length >= 10) score += 15;
    if (/[A-Z]/.test(pw)) score += 20;
    if (/[0-9]/.test(pw)) score += 20;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    setPasswordStrength(score);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    setLoading(true);
    setError('');
    try {
      await signIn(provider, { callbackUrl });
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'login') {
      try {
        const result = await signIn('credentials', {
          email: form.email,
          password: form.password,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          setError('Invalid email or password. Please try again.');
          setLoading(false);
          return;
        }

        if (result?.ok) {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch {
        setError('Connection error. Please check your network.');
        setLoading(false);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      setStep('otp');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('success');
  };

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
    setOtp(['', '', '', '', '', '']);
    setStep('form');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setAgreed(false);
    setError('');
    setPasswordStrength(0);
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const strengthColor = passwordStrength < 30 ? 'bg-red-500' : passwordStrength < 60 ? 'bg-amber-500' : passwordStrength < 80 ? 'bg-yellow-500' : 'bg-green-500';
  const strengthText = passwordStrength < 30 ? 'Weak' : passwordStrength < 60 ? 'Fair' : passwordStrength < 80 ? 'Good' : 'Strong';

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* ======== LEFT - VISUAL PANEL ======== */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black p-12 items-center justify-center overflow-hidden"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#B80000]/30 to-transparent blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-600/20 to-transparent blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-br from-purple-500/15 to-transparent blur-3xl"
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Image
              src="/images/logo.svg"
              alt="Peerzada Store"
              width={80}
              height={80}
              className="mb-6 brightness-0 invert opacity-90"
              priority
            />
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Peerzada Store
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Premium quality products crafted for your everyday needs. 
              Experience excellence in every purchase.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 space-y-4 w-full"
          >
            {[
              { icon: '🚚', text: 'Free shipping across Pakistan' },
              { icon: '⭐', text: '100% authentic products' },
              { icon: '🛡️', text: 'Secure & encrypted checkout' },
              { icon: '💬', text: '24/7 WhatsApp support' },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-gray-300 text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-0 right-0 text-center"
          >
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} Peerzada Store — Premium Since 2018
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ======== RIGHT - FORM PANEL ======== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-8 px-4 sm:px-8 lg:px-12 relative">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-6 left-6 sm:top-8 sm:left-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#B80000] text-sm font-medium transition-colors group"
          >
            <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </motion.div>

        {/* Logo on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden absolute top-6 right-6"
        >
          <Image
            src="/images/logo.svg"
            alt="Peerzada Store"
            width={36}
            height={36}
            priority
          />
        </motion.div>

        <div className="w-full max-w-[420px]">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {mode === 'login' ? (
                <>Welcome back</>
              ) : (
                <>Create account</>
              )}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-500 mt-2 text-sm">
              {mode === 'login' 
                ? 'Sign in to access your orders and saved items'
                : 'Join Peerzada Store for a premium shopping experience'
              }
            </motion.p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {step === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Mode Tabs */}
                  <div className="flex bg-gray-100 rounded-xl p-1 mb-6 relative">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                        mode === 'login' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                        mode === 'signup' ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Sign Up
                    </button>
                    <motion.div
                      layout
                      layoutId="auth-tab-modern"
                      className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-[#B80000] to-red-600 shadow-md"
                      style={{
                        left: mode === 'login' ? '0.25rem' : '50%',
                        width: 'calc(50% - 0.25rem)',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium overflow-hidden"
                      >
                        <FaExclamationCircle className="text-red-400 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Google Sign In - Prominent */}
                  <motion.button
                    type="button"
                    onClick={() => handleSocialSignIn('google')}
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    <FaGoogle className="text-lg" />
                    <span>Continue with Google</span>
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name - Signup */}
                    <AnimatePresence>
                      {mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                          <div className="relative">
                            <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                              type="text"
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                              placeholder="Muhammad Faisal"
                              required={mode === 'signup'}
                              className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all duration-200"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Phone - Signup */}
                    <AnimatePresence>
                      {mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                          <div className="relative">
                            <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                              type="tel"
                              name="phone"
                              value={form.phone}
                              onChange={handleChange}
                              placeholder="03XX-XXXXXXX"
                              className="w-full pl-10 pr-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all duration-200"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                        {mode === 'login' && (
                          <Link href="#" className="text-xs font-medium text-[#B80000] hover:text-red-700 transition-colors">
                            Forgot?
                          </Link>
                        )}
                      </div>
                      <div className="relative">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
                          required
                          minLength={6}
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                        </button>
                      </div>
                      {/* Password strength - Signup */}
                      {mode === 'signup' && form.password && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2"
                        >
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  passwordStrength >= i * 25 ? strengthColor : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-xs mt-1 font-medium ${strengthColor.replace('bg-', 'text-')}`}>
                            {strengthText}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Confirm Password - Signup */}
                    <AnimatePresence>
                      {mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                          <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              name="confirmPassword"
                              value={form.confirmPassword}
                              onChange={handleChange}
                              placeholder="Re-enter password"
                              required={mode === 'signup'}
                              minLength={6}
                              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all duration-200"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
                            </button>
                          </div>
                          {form.confirmPassword && form.password !== form.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1.5 font-medium">Passwords do not match</p>
                          )}
                          {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
                            <p className="text-green-600 text-xs mt-1.5 font-medium flex items-center gap-1">
                              <FaCheckCircle className="text-xs" /> Passwords match
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Terms - Signup */}
                    <AnimatePresence>
                      {mode === 'signup' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex items-start gap-2.5"
                        >
                          <input
                            type="checkbox"
                            id="terms"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            required
                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#B80000] focus:ring-[#B80000] accent-[#B80000] cursor-pointer"
                          />
                          <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed cursor-pointer select-none">
                            I agree to the{' '}
                            <Link href="#" className="text-[#B80000] hover:text-red-700 font-medium">Terms</Link>
                            {' '}and{' '}
                            <Link href="#" className="text-[#B80000] hover:text-red-700 font-medium">Privacy Policy</Link>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={
                        loading || 
                        (mode === 'signup' && !agreed) || 
                        (mode === 'signup' && form.password !== form.confirmPassword && form.confirmPassword !== '')
                      }
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><FaSpinner className="animate-spin" /> Processing...</>
                      ) : (
                        <><FaRocket className="text-sm" /> {mode === 'login' ? 'Sign In' : 'Create Account'}</>
                      )}
                    </motion.button>
                  </form>

                  {/* Switch mode */}
                  <p className="text-center text-sm text-gray-500 mt-5">
                    {mode === 'login' ? (
                      <>New here?{' '}
                        <button type="button" onClick={() => switchMode('signup')} className="text-[#B80000] hover:text-red-700 font-semibold transition-colors">
                          Create an account
                        </button>
                      </>
                    ) : (
                      <>Already have an account?{' '}
                        <button type="button" onClick={() => switchMode('login')} className="text-[#B80000] hover:text-red-700 font-semibold transition-colors">
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </motion.div>
              )}

              {/* OTP STEP */}
              {step === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                      className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#B80000]/10 to-red-500/10 rounded-2xl flex items-center justify-center"
                    >
                      <FaEnvelope className="text-xl text-[#B80000]" />
                    </motion.div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Check your email</h2>
                    <p className="text-gray-500 text-sm">
                      We sent a 6-digit code to{' '}
                      <span className="font-semibold text-gray-700">{form.email || 'your email'}</span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.06 }}
                        >
                          <input
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ''))}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="w-10 h-12 sm:w-12 sm:h-13 text-center text-lg font-bold bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-[#B80000] focus:ring-1 focus:ring-[#B80000]/20 focus:bg-white transition-all duration-200"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            required
                          />
                        </motion.div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Didn&apos;t receive? <span className="text-[#B80000] font-semibold hover:text-red-700">Resend</span>
                    </button>

                    <motion.button
                      type="submit"
                      disabled={loading || otp.some(d => !d)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-3 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? <><FaSpinner className="animate-spin" /> Verifying...</> : <><FaCheckCircle /> Verify Email</>}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => setStep('form')}
                      className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <FaArrowLeft className="text-xs" /> Back
                    </button>
                  </form>
                </motion.div>
              )}

              {/* SUCCESS STEP */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 12, delay: 0.1 }}
                    className="w-16 h-16 mx-auto mb-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20"
                  >
                    <FaCheckCircle className="text-2xl text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
                      {mode === 'login' ? 'Welcome back!' : 'Account created!'}
                    </h2>
                    <p className="text-gray-500 text-sm mb-7">
                      {mode === 'login' 
                        ? 'You have been signed in successfully.'
                        : 'Your account is ready. Start shopping!'
                      }
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="space-y-3"
                  >
                    <Link
                      href="/"
                      className="block w-full py-3 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/products"
                      className="block w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      Browse Products
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex items-center justify-center gap-5 mt-8 text-xs text-gray-400"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Secure
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No SPAM
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
