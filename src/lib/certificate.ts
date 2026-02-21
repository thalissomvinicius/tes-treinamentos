import jsPDF from 'jspdf'
import QRCode from 'qrcode'

export interface CertificateProps {
    userName: string
    courseName: string
    issuedBy: string
    code: string
    date: string
    verifyUrl?: string
}

export async function generateCertificatePDF(props: CertificateProps): Promise<ArrayBuffer> {
    const { userName, courseName, issuedBy, code, date, verifyUrl } = props

    // Landscape A4: 297 x 210 mm
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const w = 297
    const h = 210

    // ──────────────────────────────────────
    //  COLORS
    // ──────────────────────────────────────
    const Navy = { r: 15, g: 23, b: 42 } // slate-900 / Deep Navy
    const Gold = { r: 29, g: 78, b: 216 }
    const LightGold = { r: 59, g: 130, b: 246 }
    const SoftGray = { r: 248, g: 250, b: 252 } // slate-50

    // ──────────────────────────────────────
    //  BACKGROUND
    // ──────────────────────────────────────
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, w, h, 'F')

    // Subtle geometric watermark pattern (triangles in corners)
    doc.setFillColor(SoftGray.r, SoftGray.g, SoftGray.b)
    doc.triangle(0, 0, 80, 0, 0, 80, 'F')
    doc.triangle(w, h, w - 80, h, w, h - 80, 'F')

    // ──────────────────────────────────────
    //  MODERN MINIMALIST BORDER
    // ──────────────────────────────────────
    // Thick Navy Sidebar decoration
    doc.setFillColor(Navy.r, Navy.g, Navy.b)
    doc.rect(0, 0, 15, h, 'F')

    // Thin inner gold border
    doc.setDrawColor(Gold.r, Gold.g, Gold.b)
    doc.setLineWidth(0.5)
    doc.rect(20, 10, w - 30, h - 20)

    // ──────────────────────────────────────
    //  LOGO / ISSUER
    // ──────────────────────────────────────
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(Navy.r, Navy.g, Navy.b)
    doc.text('T', 35, 25)
    doc.setTextColor(Gold.r, Gold.g, Gold.b)
    doc.text('&', 39, 25)
    doc.setTextColor(Navy.r, Navy.g, Navy.b)
    doc.text('S', 43, 25)
    doc.setFontSize(10)
    doc.text('CURSOS', 49, 25)

    // ──────────────────────────────────────
    //  TOP ACCENT
    // ──────────────────────────────────────
    doc.setDrawColor(Gold.r, Gold.g, Gold.b)
    doc.setLineWidth(1)
    doc.line(35, 30, 80, 30)

    // ──────────────────────────────────────
    //  MAIN TITLE
    // ──────────────────────────────────────
    doc.setFont('times', 'bold')
    doc.setFontSize(48)
    doc.setTextColor(Navy.r, Navy.g, Navy.b)
    doc.text('CERTIFICADO', w / 2 + 7.5, 60, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(14)
    doc.setTextColor(Gold.r, Gold.g, Gold.b)
    doc.text('DE CONCLUSÃO DE CURSO PROFISSIONALIZANTE', w / 2 + 7.5, 70, { align: 'center', charSpace: 1 })

    // ──────────────────────────────────────
    //  BODY
    // ──────────────────────────────────────
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text('Certificamos para os devidos fins que', w / 2 + 7.5, 90, { align: 'center' })

    // Student Name
    doc.setFont('times', 'bold')
    doc.setFontSize(36)
    doc.setTextColor(Navy.r, Navy.g, Navy.b)
    doc.text(userName.toUpperCase(), w / 2 + 7.5, 110, { align: 'center' })

    // Text content
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text('concluiu com aproveitamento e dedicação o curso livre de especialização', w / 2 + 7.5, 125, { align: 'center' })

    // Course Name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(Navy.r, Navy.g, Navy.b)
    doc.text(courseName, w / 2 + 7.5, 140, { align: 'center' })

    // Details/Footer body
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(120, 120, 120)
    doc.text('Carga horária total de 40 horas — Certificado emitido em conformidade com as normas vigentes.', w / 2 + 7.5, 148, { align: 'center' })

    // ──────────────────────────────────────
    //  DIGITAL SEAL / BADGE (Circular Gold Seal)
    // ──────────────────────────────────────
    // Moved lower and more to the right to avoid overlap
    const sealX = w - 85
    const sealY = 172
    const sealR = 16

    // Outer Glow
    doc.setDrawColor(LightGold.r, LightGold.g, LightGold.b)
    doc.setLineWidth(0.1)
    doc.circle(sealX, sealY, sealR + 1.5, 'D')

    // Main Circle
    doc.setFillColor(Gold.r, Gold.g, Gold.b)
    doc.circle(sealX, sealY, sealR, 'F')

    // Inner Line
    doc.setDrawColor(255, 255, 255)
    doc.setLineWidth(0.4)
    doc.circle(sealX, sealY, sealR - 2.5, 'D')

    // Seal Text - Adjusted vertical spacing
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.text('QUALIDADE', sealX, sealY - 3, { align: 'center' })
    doc.setFontSize(8)
    doc.text('GARANTIDA', sealX, sealY + 1.5, { align: 'center' })
    doc.setFontSize(6)
    doc.text('T&S CURSOS', sealX, sealY + 5.5, { align: 'center' })

    // Ribbon below seal
    doc.setFillColor(Gold.r, Gold.g, Gold.b)
    doc.triangle(sealX - 4, sealY + 12, sealX - 10, sealY + 24, sealX + 2, sealY + 24, 'F')
    doc.triangle(sealX + 4, sealY + 12, sealX + 10, sealY + 24, sealX - 2, sealY + 24, 'F')

    // ──────────────────────────────────────
    //  DATE & BOTTOM INFO
    // ──────────────────────────────────────
    doc.setTextColor(Navy.r, Navy.g, Navy.b)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(date, 40, 175)

    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Emitido por ${issuedBy}`, 40, 182)
    doc.text('CNPJ: 42.255.656/0001-03', 40, 186)

    // ──────────────────────────────────────
    //  VALIDATION CODE (Minimalist Footer)
    // ──────────────────────────────────────
    doc.setDrawColor(SoftGray.r, SoftGray.g, SoftGray.b)
    doc.setLineWidth(10)
    doc.line(20, h - 8, w - 10, h - 8)

    doc.setTextColor(180, 180, 180)
    doc.setFont('courier', 'normal')
    doc.setFontSize(7)
    doc.text(`CÓDIGO DE AUTENTICIDADE: ${code}`, w / 2 + 7.5, h - 10, { align: 'center' })
    doc.text('Documento digital autêntico.', w / 2 + 7.5, h - 6, { align: 'center' })

    if (verifyUrl) {
        const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
            width: 280,
            margin: 0,
            color: {
                dark: '#1d4ed8',
                light: '#ffffff',
            },
        })
        const qrSize = 28
        const qrX = w - 45
        const qrY = h - 45
        doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(Gold.r, Gold.g, Gold.b)
        doc.text('VALIDAR QR CODE', qrX + qrSize / 2, qrY - 2, { align: 'center' })
    }

    return doc.output('arraybuffer')
}
