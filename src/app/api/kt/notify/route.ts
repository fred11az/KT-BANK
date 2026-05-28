import { NextRequest, NextResponse } from "next/server";
import { sendTransactionNotification, sendBankMessage, sendSecurityAlert } from "@/lib/email/send";

// Internal route — called by server-side logic (transactions, admin messages, etc.)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, email, lang, ...data } = body;

  if (!email || !type) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  switch (type) {
    case "transaction":
      await sendTransactionNotification(email, { ...data, lang });
      break;
    case "message":
      await sendBankMessage(email, data.prenom, data.messagePreview, lang);
      break;
    case "security":
      await sendSecurityAlert(email, data.prenom, data.reason, lang);
      break;
    default:
      return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
