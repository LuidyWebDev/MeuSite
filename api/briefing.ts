import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PROFILE } from "../src/data/profile";

const ALLOWED_SERVICES = new Set([
  "Landing Page",
  "Site Institucional / Portfólio",
  "Aplicação Web / Dashboard (SaaS)",
  "E-Commerce de Luxo",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length > 0 && text.length <= maxLength ? text : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body: unknown = req.body;
  if (!isRecord(body)) {
    return res.status(400).json({ error: "Invalid briefing data." });
  }

  const name = readText(body.name, 120);
  const email = readText(body.email, 254);
  const service = readText(body.service, 100);
  const details = readText(body.details, 5000);

  if (
    !name ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !service ||
    !ALLOWED_SERVICES.has(service) ||
    !details
  ) {
    return res.status(400).json({ error: "Check the briefing fields and try again." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BRIEFING_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("Briefing email is not configured: missing Resend environment variables.");
    return res.status(503).json({ error: "Briefing email is temporarily unavailable." });
  }

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [PROFILE.email],
        reply_to: email,
        subject: "Novo briefing pelo portfólio",
        text: [
          `Nome / empresa: ${name}`,
          `E-mail para retorno: ${email}`,
          `Escopo: ${service}`,
          "",
          "Detalhes:",
          details,
        ].join("\n"),
      }),
    });

    if (!resendResponse.ok) {
      console.error(`Resend rejected briefing email with status ${resendResponse.status}.`);
      return res.status(502).json({ error: "Briefing email could not be sent." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Resend request failed while sending a briefing email.", error);
    return res.status(502).json({ error: "Briefing email could not be sent." });
  }
}
