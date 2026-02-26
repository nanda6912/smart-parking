import jsPDF from 'jspdf';

export const generateTicketPDF = (ticketData) => {
  const { ticketId, vehicleNumber, phone, slotId, entryTime } = ticketData;
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set up colors and styles
  const primaryColor = [34, 197, 94]; // Green color
  const textColor = [0, 0, 0];
  const grayColor = [107, 114, 128];
  
  // Add custom font for better appearance (using built-in fonts)
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text('SmartPark', 105, 30, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(...grayColor);
  doc.text('Parking Management System', 105, 40, { align: 'center' });
  
  // Add divider line
  doc.setDrawColor(...grayColor);
  doc.setLineWidth(0.5);
  doc.line(20, 50, 190, 50);
  
  // Add ticket title
  doc.setFontSize(18);
  doc.setTextColor(...textColor);
  doc.text('Parking Ticket', 105, 65, { align: 'center' });
  
  // Add ticket details
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  
  const details = [
    ['Ticket ID:', ticketId],
    ['Vehicle Number:', vehicleNumber],
    ['Phone Number:', phone],
    ['Slot Number:', `${slotId} — ${slotId.startsWith('G') ? 'Ground Floor' : 'First Floor'}`],
    ['Entry Date & Time:', new Date(entryTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })],
    ['Hourly Rate:', '₹20/hour (minimum ₹20)'],
  ];
  
  let yPosition = 85;
  details.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold');
    doc.text(label, 30, yPosition);
    doc.setFont(undefined, 'normal');
    doc.text(value, 70, yPosition);
    yPosition += 12;
  });
  
  // Add status badge
  doc.setFillColor(...primaryColor);
  doc.rect(70, yPosition + 5, 60, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('ACTIVE', 100, yPosition + 18, { align: 'center' });
  
  // Add footer divider
  doc.setTextColor(...grayColor);
  doc.setDrawColor(...grayColor);
  doc.line(20, yPosition + 35, 190, yPosition + 35);
  
  // Add footer text
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('Present this ticket at exit. Keep it safe.', 105, yPosition + 45, { align: 'center' });
  
  // Add timestamp at bottom
  doc.setFontSize(8);
  doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, 105, 280, { align: 'center' });
  
  // Save the PDF
  doc.save(`parking-ticket-${ticketId}.pdf`);
};
