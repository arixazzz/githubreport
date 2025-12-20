import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface AccessTokenPayload {
  sub: number;
  roles: string[];
  permissions: string[];
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = verifyJwt(token);

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "sub" in decoded &&
      "roles" in decoded &&
      "permissions" in decoded
    ) {
      return decoded as unknown as AccessTokenPayload;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Standardized session verification for API routes.
 * Returns the payload if valid and authorized, otherwise returns a NextResponse.
 */
export async function verifySession(
  requiredRole?: string
): Promise<{ payload: AccessTokenPayload } | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  if (requiredRole && !payload.roles.includes(requiredRole)) {
    return NextResponse.json(
      { error: `Forbidden: ${requiredRole} access required` },
      { status: 403 }
    );
  }

  return { payload };
}
