"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const reqBody = req.body;

      const user = await prisma.project.create({
        data: {
          title: reqBody.title,
          detail: reqBody.detail,
          deadline: new Date(reqBody.deadline),
          stack: "",
          linkgithub: reqBody.linkgithub,
        },
      });

      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
