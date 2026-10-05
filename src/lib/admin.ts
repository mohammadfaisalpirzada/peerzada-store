import crypto from 'crypto';

const DEFAULT_ADMIN_PHONES = ['03458340668', '03458340669'];
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecretKey(): string {
  return (
    process.env.ADMIN_JWT_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'peerzada-secure-admin-store-key-99a81e'
  );
}

export function getAdminPhones(): string[] {
  if (process.env.ADMIN_PHONES) {
    const parsed = process.env.ADMIN_PHONES.split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    if (parsed.length > 0) return parsed;
  }
  return DEFAULT_ADMIN_PHONES;
}

export function isAdminPhone(phone: string): boolean {
  if (!phone) return false;
  const normalized = phone.replace(/[^0-9]/g, '');
  return getAdminPhones().some((adminPhone) => {
    const adminNorm = adminPhone.replace(/[^0-9]/g, '');
    return normalized === adminNorm || normalized.endsWith(adminNorm) || adminNorm.endsWith(normalized);
  });
}

/**
 * Generate cryptographically secure 6-digit OTP
 */
export function generateOTP(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Creates a signed stateless challenge token for an OTP
 */
export function createOTPChallenge(phone: string, otp: string): string {
  const expiresAt = Date.now() + OTP_EXPIRY_MS;
  const secret = getSecretKey();
  const hash = crypto.createHmac('sha256', secret).update(`${phone}:${otp}:${expiresAt}`).digest('hex');
  const payload = Buffer.from(JSON.stringify({ phone, expiresAt, hash })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

/**
 * Verifies a signed OTP challenge token against user input
 */
export function verifyOTPChallenge(challengeToken: string, phone: string, inputOtp: string): boolean {
  try {
    if (!challengeToken || !challengeToken.includes('.')) return false;
    const [payloadB64, sig] = challengeToken.split('.');
    const secret = getSecretKey();

    const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.phone || !payload.expiresAt || !payload.hash) return false;

    if (Date.now() > payload.expiresAt) return false;

    // Check phone match
    if (!isAdminPhone(payload.phone) || !isAdminPhone(phone)) return false;

    const expectedHash = crypto.createHmac('sha256', secret).update(`${payload.phone}:${inputOtp}:${payload.expiresAt}`).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(payload.hash), Buffer.from(expectedHash));
  } catch {
    return false;
  }
}

// In-memory fallback for local dev / single instance
interface OTPStore {
  otp: string;
  expiresAt: number;
}
const otpFallbackMap = new Map<string, OTPStore>();

export function storeOTP(phone: string): { otp: string; challengeToken: string } {
  if (!isAdminPhone(phone)) return { otp: '', challengeToken: '' };
  const otp = generateOTP();
  const challengeToken = createOTPChallenge(phone, otp);
  otpFallbackMap.set(phone, { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });
  return { otp, challengeToken };
}

export function verifyOTP(phone: string, otp: string, challengeToken?: string): boolean {
  if (challengeToken && verifyOTPChallenge(challengeToken, phone, otp)) {
    otpFallbackMap.delete(phone);
    return true;
  }

  // Fallback to in-memory map
  const stored = otpFallbackMap.get(phone);
  if (!stored) return false;
  if (Date.now() > stored.expiresAt) {
    otpFallbackMap.delete(phone);
    return false;
  }
  if (stored.otp !== otp) return false;
  otpFallbackMap.delete(phone);
  return true;
}

/**
 * Creates a cryptographically signed stateless session token (Serverless ready)
 */
export function createSession(phone: string): string {
  const secret = getSecretKey();
  const now = Date.now();
  const payload = {
    phone,
    createdAt: now,
    expiresAt: now + SESSION_EXPIRY_MS,
    nonce: crypto.randomUUID(),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Validates a cryptographically signed stateless session token
 */
export function validateSession(token: string): { valid: boolean; phone?: string } {
  try {
    if (!token || !token.includes('.')) return { valid: false };
    const [payloadB64, signature] = token.split('.');
    const secret = getSecretKey();

    const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
    if (signature.length !== expectedSig.length) return { valid: false };

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.phone || !payload.expiresAt) return { valid: false };

    if (Date.now() > payload.expiresAt) {
      return { valid: false };
    }

    if (!isAdminPhone(payload.phone)) {
      return { valid: false };
    }

    return { valid: true, phone: payload.phone };
  } catch {
    return { valid: false };
  }
}

export function destroySession(token?: string): void {
  // Stateless tokens are destroyed by client/cookie removal
  void token;
}
