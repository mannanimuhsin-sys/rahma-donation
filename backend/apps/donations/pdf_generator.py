import os
import io
import qrcode
from django.conf import settings
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_receipt(donation):
    """Generates a professional PDF receipt for a verified donation using ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    story = []
    styles = getSampleStyleSheet()

    # Custom Color Palette
    EMERALD_GREEN = colors.HexColor('#064e3b')
    LIGHT_GREEN = colors.HexColor('#ecfdf5')
    GOLD_ACCENT = colors.HexColor('#d97706')
    DARK_TEXT = colors.HexColor('#1f2937')
    MUTED_TEXT = colors.HexColor('#6b7280')

    # Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=EMERALD_GREEN,
        alignment=0
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=14,
        textColor=MUTED_TEXT,
        alignment=0
    )
    badge_style = ParagraphStyle(
        'Badge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#047857'),
        alignment=2
    )

    # Header Table
    org_name = donation.organization.name if donation.organization else "RAHMA Foundation & Charity Trust"
    header_data = [
        [
            Paragraph(f"<b>{org_name}</b><br/><font size=10 color='#047857'>OFFICIAL DONATION RECEIPT</font>", title_style),
            Paragraph(f"<b>RECEIPT #:</b><br/><font color='#d97706'>{donation.receipt_number}</font>", badge_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 180])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD_GREEN, spaceBefore=5, spaceAfter=20))

    # Donor & Payment Details Table
    details_style_label = ParagraphStyle('Label', fontName='Helvetica-Bold', fontSize=10, textColor=MUTED_TEXT)
    details_style_val = ParagraphStyle('Val', fontName='Helvetica', fontSize=10, textColor=DARK_TEXT)
    details_style_val_bold = ParagraphStyle('ValBold', fontName='Helvetica-Bold', fontSize=11, textColor=EMERALD_GREEN)

    date_str = donation.created_at.strftime('%B %d, %Y - %I:%M %p')
    campaign_name = donation.campaign.title if donation.campaign else "General Donation"

    details_data = [
        [Paragraph("Date & Time:", details_style_label), Paragraph(date_str, details_style_val)],
        [Paragraph("Donor Name:", details_style_label), Paragraph(donation.donor_name, details_style_val_bold)],
        [Paragraph("Email Address:", details_style_label), Paragraph(donation.donor_email, details_style_val)],
        [Paragraph("Phone Number:", details_style_label), Paragraph(donation.donor_phone or 'N/A', details_style_val)],
        [Paragraph("Campaign Cause:", details_style_label), Paragraph(campaign_name, details_style_val)],
        [Paragraph("Payment Method:", details_style_label), Paragraph(donation.get_payment_method_display(), details_style_val)],
        [Paragraph("Payment ID / Ref:", details_style_label), Paragraph(donation.razorpay_payment_id or donation.donation_number, details_style_val)],
        [Paragraph("Status:", details_style_label), Paragraph("<font color='#047857'><b>VERIFIED & COMPLETED</b></font>", details_style_val)],
    ]

    details_table = Table(details_data, colWidths=[150, 370])
    details_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_GREEN),
        ('PADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#a7f3d0')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(details_table)
    story.append(Spacer(1, 20))

    # Amount Card Table
    amount_label_style = ParagraphStyle('AmtLabel', fontName='Helvetica-Bold', fontSize=12, textColor=EMERALD_GREEN, alignment=1)
    amount_val_style = ParagraphStyle('AmtVal', fontName='Helvetica-Bold', fontSize=26, textColor=GOLD_ACCENT, alignment=1)

    amount_data = [
        [Paragraph("TOTAL DONATION AMOUNT", amount_label_style)],
        [Paragraph(f"₹ {donation.amount:,.2f}", amount_val_style)]
    ]
    amount_table = Table(amount_data, colWidths=[520])
    amount_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fffbeb')),
        ('BOX', (0,0), (-1,-1), 1.5, GOLD_ACCENT),
        ('PADDING', (0,0), (-1,-1), 12),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(amount_table)
    story.append(Spacer(1, 25))

    # QR Code & Verification Section
    qr_data_str = f"RAHMA Receipt Verification\nReceipt: {donation.receipt_number}\nAmount: INR {donation.amount}\nDonor: {donation.donor_name}\nDate: {date_str}"
    qr_img = qrcode.make(qr_data_str)
    qr_buffer = io.BytesIO()
    qr_img.save(qr_buffer, format='PNG')
    qr_buffer.seek(0)
    rl_qr_image = RLImage(qr_buffer, width=90, height=90)

    footer_text = Paragraph(
        "<b>Thank you for your generous contribution!</b><br/>"
        "<font size=9 color='#6b7280'>"
        "May Allah reward your kindness and bless your wealth. This document is an automatically computer-generated official receipt requiring no manual signature.<br/>"
        "Scan the QR code to verify receipt authenticity."
        "</font>",
        ParagraphStyle('FooterText', fontName='Helvetica', fontSize=10, leading=14, textColor=DARK_TEXT)
    )

    qr_table_data = [[footer_text, rl_qr_image]]
    qr_table = Table(qr_table_data, colWidths=[410, 110])
    qr_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(qr_table)

    doc.build(story)
    pdf_value = buffer.getvalue()
    buffer.close()

    # Save to media directory
    media_receipt_dir = os.path.join(settings.MEDIA_ROOT, 'receipts')
    os.makedirs(media_receipt_dir, exist_ok=True)
    filename = f"{donation.receipt_number}.pdf"
    filepath = os.path.join(media_receipt_dir, filename)
    with open(filepath, 'wb') as f:
        f.write(pdf_value)

    donation.receipt_pdf = f"receipts/{filename}"
    donation.save(update_fields=['receipt_pdf'])
    return donation.receipt_pdf.url
