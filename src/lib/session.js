import { SignJWT, jwtVerify } from 'jose';

// These keys should be in your .env.local file
const secretKey = process.env.SESSION_SECRET || 'secret-key';
const encodedKey = new TextEncoder().encode(secretKey);

// --- Create the Session Cookie ---
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Session expires in 7 days
    .sign(encodedKey);
}

// --- Verify the Session Cookie ---
export async function decrypt(session) {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Failed to verify session:', error);
    return null;
  }
}
 