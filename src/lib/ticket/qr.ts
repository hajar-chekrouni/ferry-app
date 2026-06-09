import QRCode from "qrcode";

export interface QRPayload {
  bookingId: string;
  passengerName: string;
  outboundId: string;
  inboundId?: string;
  totalEur: number;
  issuedAt: string;
}

export async function generateQRDataURL(payload: QRPayload): Promise<string> {
  const data = JSON.stringify(payload);
  return QRCode.toDataURL(data, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 256,
    color: { dark: "#1e3a5f", light: "#ffffff" },
  });
}

export async function generateQRSVGString(payload: QRPayload): Promise<string> {
  const data = JSON.stringify(payload);
  return QRCode.toString(data, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
  });
}
