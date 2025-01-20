from django.utils import timezone

from users.models import ActivityLog

from datetime import datetime
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def log_user_login(user):
    ActivityLog.objects.create(
        user=user,
        action='LOGIN',
        timestamp=timezone.now(),
        details={'ip': 'user_ip_address'}
    )


def log_file_download(user, file_name):
    ActivityLog.objects.create(
        user=user,
        action='DOWNLOAD',
        timestamp=timezone.now(),
        details={'file_name': file_name}
    )


def generate_user_activity_report(user, login_logs, download_logs):
    current_time = datetime.now().strftime("%m-%d_%H-%M")
    report_name = f"report_{current_time}.pdf"

    # Create PDF buffer
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,  # 1 inch margins
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )

    # Enhanced styles
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#2C3E50')
    ))

    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        spaceBefore=20,
        spaceAfter=12,
        textColor=colors.HexColor('#34495E')
    ))

    styles.add(ParagraphStyle(
        name='UserDetails',
        parent=styles['Normal'],
        fontSize=12,
        spaceBefore=12,
        spaceAfter=12,
        leading=20
    ))

    styles.add(ParagraphStyle(
        name='MetricStyle',
        fontSize=12,
        alignment=1,  # Center alignment
        spaceBefore=15,
        spaceAfter=15,
        textColor=colors.HexColor('#2980B9')
    ))

    # Table styles
    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2980B9')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#BDC3C7')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ])

    elements = []

    # Title with better formatting
    elements.append(Paragraph(f"User Activity Report", styles['CustomTitle']))

    # User Details in a formatted box
    user_info = [
        [Paragraph("User Information", styles['SectionHeader'])],
        [Paragraph(f"<b>Name:</b> {user.name}", styles['UserDetails'])],
        [Paragraph(f"<b>Email:</b> {user.email}", styles['UserDetails'])],
        [Paragraph(f"<b>Role:</b> {user.role}", styles['UserDetails'])]
    ]
    user_info_table = Table(user_info, colWidths=[450])
    user_info_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#ECF0F1')),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ECF0F1')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(user_info_table)
    elements.append(Spacer(1, 20))

    # Activity Metrics in a row
    metrics_data = [
        [
            Paragraph(f"<b>Total Logins</b><br/>{len(login_logs)}", styles['MetricStyle']),
            Paragraph(f"<b>Total Downloads</b><br/>{len(download_logs)}", styles['MetricStyle'])
        ]
    ]
    metrics_table = Table(metrics_data, colWidths=[225, 225])
    metrics_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(metrics_table)
    elements.append(Spacer(1, 20))

    # Login Activity Table
    if login_logs.exists():
        elements.append(Paragraph("Login Activity", styles['SectionHeader']))
        login_table_data = [['Date', 'Time', 'Action']]
        for log in login_logs:
            login_table_data.append([
                log.timestamp.strftime("%Y-%m-%d"),
                log.timestamp.strftime("%H:%M:%S"),
                log.action
            ])
        login_table = Table(login_table_data, colWidths=[150, 150, 150])
        login_table.setStyle(table_style)
        elements.append(login_table)

    # Download Activity Table
    if download_logs.exists():
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("Download Activity", styles['SectionHeader']))
        download_table_data = [['Date', 'Time', 'File Name']]
        for log in download_logs:
            file_name = log.details.get('file_name', 'N/A')
            download_table_data.append([
                log.timestamp.strftime("%Y-%m-%d"),
                log.timestamp.strftime("%H:%M:%S"),
                file_name
            ])
        download_table = Table(download_table_data, colWidths=[150, 150, 150])
        download_table.setStyle(table_style)
        elements.append(download_table)

    # Add footer with timestamp
    elements.append(Spacer(1, 30))
    elements.append(Paragraph(
        f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            textColor=colors.grey,
            fontSize=8,
            alignment=1  # Center alignment
        )
    ))

    # Build and return PDF
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()

    return pdf, report_name
