"use client";

import { z } from "zod";

export const SignIn = z.object({
  username: z.string().min(2).max(50),
});
