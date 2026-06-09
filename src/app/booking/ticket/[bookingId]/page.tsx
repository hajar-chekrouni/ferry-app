export const dynamic = "force-dynamic";

import { getBooking } from "@/lib/booking/store";
import { getSailingById } from "@/lib/operators/get-sailing";
import { formatDuration } from "@/lib/utils";
import { generateQRDataURL } from "@/lib/ticket/qr";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function TicketPage({ params }: PageProps) {
  const { bookingId } = await params;

  const booking = getBooking(bookingId);
  if (!booking) notFound();

  const passengers = {
    adults: booking.passengers.filter((p) => p.type === "adult").length,
    children: booking.passengers.filter((p) => p.type === "child").length,
    infants: booking.passengers.filter((p) => p.type === "infant").length,
  };
  const vehicleQuery = booking.vehicle
    ? { category: booking.vehicle.category, lengthCm: booking.vehicle.lengthCm }
    : undefined;

  const [outbound, inbound] = await Promise.all([
    getSailingById(booking.outboundId, passengers, vehicleQuery),
    booking.inboundId
      ? getSailingById(booking.inboundId, passengers, vehicleQuery)
      : Promise.resolve(null),
  ]);

  const leadPassenger = booking.passengers[0];
  const qrDataUrl = await generateQRDataURL({
    bookingId,
    passengerName: `${leadPassenger.firstName} ${leadPassenger.lastName}`,
    outboundId: booking.outboundId,
    inboundId: booking.inboundId,
    totalEur: booking.totalEur,
    issuedAt: booking.paidAt ?? booking.createdAt,
  });

  const legs = [
    outbound ? { sailing: outbound, label: "ALLER" } : null,
    inbound ? { sailing: inbound, label: "RETOUR" } : null,
  ].filter(Boolean) as { sailing: typeof outbound & {}; label: string }[];

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <title>Billet — {bookingId}</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Inter', Arial, sans-serif; background: #f4f7fb; color: #111; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page { max-width: 680px; margin: 24px auto; padding: 16px; }
          .ticket { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
          .ticket-header { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: #fff; padding: 24px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
          .ticket-header h1 { font-size: 14px; font-weight: 600; color: #bfdbfe; margin-bottom: 4px; }
          .ticket-header h2 { font-size: 24px; font-weight: 800; }
          .ticket-header p { font-size: 13px; color: #bfdbfe; margin-top: 4px; }
          .qr-box { background: #fff; padding: 8px; border-radius: 10px; }
          .ticket-body { padding: 24px; }
          .leg { margin-bottom: 20px; }
          .leg-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; margin-bottom: 10px; }
          .leg-times { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
          .time { text-align: center; }
          .time .hm { font-size: 30px; font-weight: 800; letter-spacing: -1px; }
          .time .code { font-size: 13px; color: #6b7280; margin-top: 2px; }
          .leg-line { flex: 1; display: flex; flex-direction: column; align-items: center; }
          .leg-line .dur { font-size: 12px; color: #6b7280; margin-bottom: 3px; }
          .leg-line .bar { width: 100%; height: 1px; background: #e5e7eb; }
          .leg-meta { font-size: 13px; color: #6b7280; }
          .divider { height: 1px; background: #f3f4f6; margin: 16px 0; }
          .pax-table { width: 100%; font-size: 13px; border-collapse: collapse; }
          .pax-table td { padding: 3px 0; }
          .pax-table td:last-child { text-align: right; color: #6b7280; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; margin-bottom: 8px; }
          .footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
          .footer p { font-size: 12px; color: #9ca3af; }
          .ref { font-family: monospace; font-weight: 700; color: #1d4ed8; }
          .print-btn { position: fixed; top: 16px; right: 16px; background: #1d4ed8; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
          @media print {
            body { background: #fff; }
            .page { margin: 0; padding: 0; }
            .print-btn { display: none; }
          }
        `}</style>
      </head>
      <body>
        <button className="print-btn" onClick={() => window.print()}>🖨️ Imprimer / PDF</button>
        <div className="page">
          <div className="ticket">
            {/* Header */}
            <div className="ticket-header">
              <div>
                <h1>⚓ FerryCompare — Billet électronique</h1>
                <h2>{leadPassenger.firstName} {leadPassenger.lastName}</h2>
                <p>
                  {booking.passengers.length} passager{booking.passengers.length > 1 ? "s" : ""}
                  {booking.vehicle && ` · Véhicule ${booking.vehicle.plate}`}
                </p>
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                  Réf. <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{bookingId}</span>
                  {booking.paidAt && (
                    <> · {new Date(booking.paidAt).toLocaleDateString("fr-FR")}</>
                  )}
                </p>
              </div>
              <div className="qr-box">
                <Image src={qrDataUrl} alt="QR code" width={108} height={108} style={{ display: "block" }} />
              </div>
            </div>

            {/* Legs */}
            <div className="ticket-body">
              {legs.map(({ sailing, label }, i) => (
                <div key={i}>
                  {i > 0 && <div className="divider" />}
                  <div className="leg">
                    <div className="leg-label">{label}</div>
                    <div className="leg-times">
                      <div className="time">
                        <div className="hm">{sailing.departureAt.substring(11, 16)}</div>
                        <div className="code">{sailing.departurePort.code}</div>
                        <div className="code">{sailing.departurePort.name}</div>
                      </div>
                      <div className="leg-line">
                        <div className="dur">⏱ {formatDuration(sailing.durationMinutes)}</div>
                        <div className="bar" />
                        <div className="dur" style={{ marginTop: "3px" }}>{sailing.shipType}</div>
                      </div>
                      <div className="time">
                        <div className="hm">{sailing.arrivalAt.substring(11, 16)}</div>
                        <div className="code">{sailing.arrivalPort.code}</div>
                        <div className="code">{sailing.arrivalPort.name}</div>
                      </div>
                    </div>
                    <div className="leg-meta">
                      {new Date(sailing.departureAt).toLocaleDateString("fr-FR", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })} · {sailing.operatorName}
                    </div>
                  </div>
                </div>
              ))}

              <div className="divider" />

              {/* Passengers */}
              <div>
                <div className="section-title">Passagers</div>
                <table className="pax-table">
                  <tbody>
                    {booking.passengers.map((p, i) => (
                      <tr key={i}>
                        <td>{p.firstName} {p.lastName}</td>
                        <td>
                          {p.type === "adult" ? "Adulte" : p.type === "child" ? "Enfant" : "Bébé"} ·{" "}
                          {p.documentType === "passport" ? "Passeport" : "CNI"} {p.documentNumber}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {booking.vehicle && (
                <>
                  <div className="divider" />
                  <div>
                    <div className="section-title">Véhicule</div>
                    <p style={{ fontSize: "13px" }}>
                      <span className="ref">{booking.vehicle.plate}</span> ·{" "}
                      {booking.vehicle.brand} {booking.vehicle.model} ·{" "}
                      {booking.vehicle.lengthCm} cm
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="footer">
              <p>Présentez ce QR code à l&apos;embarquement · Arrivez 90 min à l&apos;avance</p>
              <p className="ref">{booking.totalEur} €</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
