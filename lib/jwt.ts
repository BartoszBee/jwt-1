
import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload} from "jose";


const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

// Czasy życia tokenów
export const ACCESS_TOKEN_EXPIRES_IN = "15m";   // mały bilet – krótki czas
export const REFRESH_TOKEN_EXPIRES_IN = "7d";   // duży bilet – działa długo



export async function createAccessToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .sign(SECRET);
}


export async function createRefreshToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRES_IN)
    .sign(SECRET);
}


export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload; // zwracamy dane użytkownika
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null; // bilet nieważny → odsyłamy na login
  }
}


export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
}
