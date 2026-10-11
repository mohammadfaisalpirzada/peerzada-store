export const DEFAULT_ADMIN_EMAIL = 'muhammadfaisalpeerzada@gmail.com';

export function getAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
    : [];

  const emails = [DEFAULT_ADMIN_EMAIL.toLowerCase(), ...envEmails];
  return Array.from(new Set(emails));
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAdminEmails().includes(normalized);
}

export function isAdminUser(user?: { email?: string | null; role?: string } | null): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return isAdminEmail(user.email);
}
