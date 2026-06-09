import { Resend } from "resend";
import { StoredBooking } from "@/lib/booking/store";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

interface SendConfirmationParams {
  booking: StoredBooking;
  outboundSailing: {
    operatorName: string;
    departurePort: { code: string; name: string };
    arrivalPort: { code: string; name: string };
    departureAt: string;
    arrivalAt: string;
    durationMinutes: number;
  };
  inboundSailing?: {
    operatorName: string;
    departurePort: { code: string; name: string };
    arrivalPort: { code: string; name: string };
    departureAt: string;
    arrivalAt: string;
    durationMinutes: number;
  };
  ticketUrl: string;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildEmailHtml({
  booking,
  outboundSailing,
  inboundSailing,
  ticketUrl,
}: SendConfirmationParams): string {
  const leadPassenger = booking.passengers[0];
  const passengerName = `${leadPassenger.firstName} ${leadPassenger.lastName}`;

  const legHtml = (label: string, s: typeof outboundSailing) => `
    <tr>
      <td colspan="2" style="padding:8px 0 4px;font-weight:600;color:#1e3a5f;">${label}</td>
    </tr>
    <tr>
      <td style="color:#666;padding:2px 0">Compagnie</td>
      <td style="font-weight:500">${s.operatorName}</td>
    </tr>
    <tr>
      <td style="color:#666;padding:2px 0">Liaison</td>
      <td style="font-weight:500">${s.departurePort.name} → ${s.arrivalPort.name}</td>
    </tr>
    <tr>
      <td style="color:#666;padding:2px 0">Départ</td>
      <td>${formatDateTime(s.departureAt)}</td>
    </tr>
    <tr>
      <td style="color:#666;padding:2px 0">Arrivée</td>
      <td>${formatDateTime(s.arrivalAt)}</td>
    </tr>
  `;

  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Confirmation de réservation</title></head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1d4ed8;padding:24px 32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:22px;">⚓ FerryCompare</h1>
              <p style="color:#bfdbfe;margin:4px 0 0;">Confirmation de réservation</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;">Bonjour <strong>${passengerName}</strong>,</p>
              <p style="margin:0 0 24px;color:#444;">
                Votre réservation <strong>${booking.id}</strong> est confirmée.
                Montant débité : <strong style="color:#1d4ed8;">${booking.totalEur} €</strong>.
              </p>

              <!-- Trip details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr><td style="background:#f8fafc;padding:12px 16px;font-weight:600;font-size:14px;border-bottom:1px solid #e5e7eb;">Détails du voyage</td></tr>
                <tr>
                  <td style="padding:16px;">
                    <table width="100%" cellpadding="0" cellspacing="4" style="font-size:14px;">
                      ${legHtml("Aller", outboundSailing)}
                      ${inboundSailing ? legHtml("Retour", inboundSailing) : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Passengers -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr><td style="background:#f8fafc;padding:12px 16px;font-weight:600;font-size:14px;border-bottom:1px solid #e5e7eb;">Passagers (${booking.passengers.length})</td></tr>
                <tr>
                  <td style="padding:16px;font-size:14px;">
                    ${booking.passengers
                      .map(
                        (p) =>
                          `<div style="margin-bottom:4px;">${p.firstName} ${p.lastName} — ${p.type === "adult" ? "Adulte" : p.type === "child" ? "Enfant" : "Bébé"}</div>`
                      )
                      .join("")}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${ticketUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">
                      📄 Voir mon billet électronique
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#888;font-size:13px;text-align:center;margin:0;">
                Présentez ce billet (QR code) à l&apos;embarquement.<br>
                Arrivez au port au moins 90 minutes avant le départ.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#888;font-size:12px;">
                FerryCompare · Données simulées (mode test MVP)<br>
                Cet e-mail a été généré automatiquement.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendConfirmationEmail(
  params: SendConfirmationParams
): Promise<void> {
  if (!isEmailConfigured()) {
    console.log("[email stub] Confirmation email would be sent to:", params.booking.contact.email);
    return;
  }

  const resend = getResend();
  const from = process.env.EMAIL_FROM ?? "FerryCompare <noreply@ferrycompare.com>";

  await resend.emails.send({
    from,
    to: params.booking.contact.email,
    subject: `✅ Confirmation — ${params.booking.id} — FerryCompare`,
    html: buildEmailHtml(params),
  });
}
