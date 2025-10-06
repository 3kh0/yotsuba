import crypto from 'crypto';

const SALT = process.env.ANON_SALT;

export function genHash(userId, threadTs) {
  const input = `${userId}${threadTs}${SALT}`;
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function genShort(hash) {
  return hash.slice(0, 8);
}
