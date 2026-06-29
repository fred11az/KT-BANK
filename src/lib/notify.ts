import { getSupabaseAdmin } from "@/lib/supabase";

export type NotificationType =
  | "fee_invoice"
  | "business_approved"
  | "business_rejected"
  | "transfer"
  | "generic";

/**
 * Insert an in-app notification for a client. Title/body should already be in
 * the client's language (the caller localizes them). Never throws — a failed
 * notification must not break the surrounding action.
 */
export async function createNotification(
  profileId: string,
  opts: { type: NotificationType; title: string; body?: string; link?: string }
): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    await admin.from("kt_notifications").insert({
      profile_id: profileId,
      type: opts.type,
      title: opts.title,
      body: opts.body ?? null,
      link: opts.link ?? null,
    });
  } catch (e) {
    console.error("[createNotification]", e);
  }
}
