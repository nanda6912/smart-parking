import { calculateBilling, formatCurrency, formatDuration } from './billing';

// Thermal Printer Receipt Generator
export const generateThermalReceipt = (ticket, exitTime = null) => {
  const isExit = exitTime !== null;
  const billing = isExit ? calculateBilling(ticket.entryTime, exitTime) : null;
  
  const receipt = {
    header: {
      title: '🅿️ SMARTPARK',
      subtitle: 'Parking Management System',
      address: 'Bangalore, Karnataka',
      phone: '+91 98765 43210',
      gst: 'GSTIN: 29ABCDE1234F1Z5'
    },
    
    ticket: {
      id: ticket.ticketId,
      vehicleNumber: ticket.vehicleNumber,
      phone: ticket.phone,
      slotId: ticket.slotId,
      entryTime: new Date(ticket.entryTime),
      exitTime: exitTime ? new Date(exitTime) : null,
      status: isExit ? 'COMPLETED' : ticket.status
    },
    
    billing: billing,
    
    footer: {
      thankYou: 'Thank you for parking with us!',
      visitAgain: 'Visit Again Soon',
      website: 'www.smartpark.in',
      support: 'For support: +91 98765 43210'
    }
  };

  return receipt;
};

// Format receipt for thermal printer (32 character width)
export const formatThermalReceipt = (receipt) => {
  const lines = [];
  const width = 32;
  
  // Helper function to center text
  const center = (text) => {
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(Math.max(0, padding)) + text;
  };
  
  // Helper function to create separator line
  const separator = () => '='.repeat(width);
  
  // Header
  lines.push(center(receipt.header.title));
  lines.push(center(receipt.header.subtitle));
  lines.push(center(receipt.header.address));
  lines.push(center(receipt.header.phone));
  lines.push(center(receipt.header.gst));
  lines.push(separator());
  
  // Ticket Information
  lines.push('TICKET DETAILS');
  lines.push(separator());
  
  lines.push(`Ticket ID: ${receipt.ticket.id}`);
  lines.push(`Vehicle: ${receipt.ticket.vehicleNumber}`);
  lines.push(`Phone: ${receipt.ticket.phone}`);
  lines.push(`Slot: ${receipt.ticket.slotId}`);
  lines.push(`Floor: ${receipt.ticket.slotId.includes('G') ? 'Ground' : 'First'}`);
  
  lines.push('');
  lines.push('TIMING DETAILS');
  lines.push(separator());
  
  lines.push(`Entry: ${receipt.ticket.entryTime.toLocaleString('en-IN', {
    date: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })}`);
  
  if (receipt.ticket.exitTime) {
    lines.push(`Exit: ${receipt.ticket.exitTime.toLocaleString('en-IN', {
      date: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}`);
    
    const duration = (receipt.ticket.exitTime - receipt.ticket.entryTime) / (1000 * 60);
    lines.push(`Duration: ${formatDuration(duration)}`);
  } else {
    const currentDuration = (new Date() - receipt.ticket.entryTime) / (1000 * 60);
    lines.push(`Current: ${formatDuration(currentDuration)}`);
    lines.push('Status: ACTIVE');
  }
  
  // Billing Section (only for exit receipts)
  if (receipt.billing) {
    lines.push('');
    lines.push('BILLING DETAILS');
    lines.push(separator());
    
    lines.push(`Rate: ₹20 per hour`);
    lines.push(`Hours: ${receipt.billing.hours}`);
    lines.push(`Minutes: ${receipt.billing.minutes}`);
    lines.push('');
    
    // Amount calculation
    lines.push('Amount Breakup:');
    lines.push(`Parking Fee: ${formatCurrency(receipt.billing.amountDue)}`);
    
    if (receipt.billing.roundedAmount !== receipt.billing.amountDue) {
      lines.push(`Rounded: ${formatCurrency(receipt.billing.roundedAmount)}`);
    }
    
    lines.push(separator());
    lines.push(`TOTAL AMOUNT: ${formatCurrency(receipt.billing.roundedAmount)}`);
    lines.push(separator());
    
    // Payment method placeholder
    lines.push('Payment: CASH');
    lines.push(`Paid: ${formatCurrency(receipt.billing.roundedAmount)}`);
    lines.push(`Balance: ₹0.00`);
  } else {
    lines.push('');
    lines.push('STATUS: ACTIVE PARKING');
    lines.push('Please keep this ticket safe');
    lines.push('Present at exit for billing');
  }
  
  lines.push(separator());
  
  // Footer
  lines.push(center(receipt.footer.thankYou));
  lines.push(center(receipt.footer.visitAgain));
  lines.push('');
  lines.push(center(receipt.footer.website));
  lines.push(center(receipt.footer.support));
  lines.push('');
  lines.push(separator());
  lines.push(center('*** END OF RECEIPT ***'));
  
  return lines.join('\n');
};

// Print receipt using browser print functionality
export const printThermalReceipt = (ticket, exitTime = null) => {
  const receipt = generateThermalReceipt(ticket, exitTime);
  const formattedReceipt = formatThermalReceipt(receipt);
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to print receipts');
    return;
  }
  
  // Thermal printer styling
  const thermalStyles = `
    <style>
      @media print {
        body {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          line-height: 1.2;
          margin: 0;
          padding: 10px;
          width: 300px;
          white-space: pre-wrap;
        }
        @page {
          size: 300px auto;
          margin: 5mm;
        }
      }
      body {
        font-family: 'Courier New', monospace;
        font-size: 10px;
        line-height: 1.2;
        margin: 0;
        padding: 10px;
        width: 300px;
        white-space: pre-wrap;
      }
    </style>
  `;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Parking Receipt - ${ticket.ticketId}</title>
        ${thermalStyles}
      </head>
      <body>
        <pre>${formattedReceipt}</pre>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

// Generate receipt as text (for copy/save)
export const getReceiptAsText = (ticket, exitTime = null) => {
  const receipt = generateThermalReceipt(ticket, exitTime);
  return formatThermalReceipt(receipt);
};

// Generate receipt as PDF (alternative to thermal print)
export const generateReceiptPDF = (ticket, exitTime = null) => {
  const receipt = generateThermalReceipt(ticket, exitTime);
  const formattedReceipt = formatThermalReceipt(receipt);
  
  // Create a temporary element for PDF generation
  const element = document.createElement('div');
  element.style.cssText = `
    font-family: 'Courier New', monospace;
    font-size: 10px;
    line-height: 1.2;
    white-space: pre-wrap;
    padding: 20px;
    background: white;
    color: black;
    width: 300px;
  `;
  element.textContent = formattedReceipt;
  
  document.body.appendChild(element);
  
  // Use html2canvas or similar library for PDF generation
  // For now, we'll use the existing PDF generator as fallback
  try {
    // Import and use existing PDF generator
    import('./pdfGenerator.js').then(({ generateParkingReceiptPDF }) => {
      generateParkingReceiptPDF(ticket, exitTime);
      document.body.removeChild(element);
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
    document.body.removeChild(element);
    alert('PDF generation failed. Please try thermal print instead.');
  }
};

// Print multiple receipts (for batch operations)
export const printBatchReceipts = (tickets, exitTimes = null) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to print receipts');
    return;
  }
  
  let allReceipts = '';
  
  tickets.forEach((ticket, index) => {
    const exitTime = exitTimes ? exitTimes[index] : null;
    const receipt = generateThermalReceipt(ticket, exitTime);
    const formattedReceipt = formatThermalReceipt(receipt);
    
    allReceipts += formattedReceipt + '\n\n' + '='.repeat(32) + '\n\n';
  });
  
  const thermalStyles = `
    <style>
      @media print {
        body {
          font-family: 'Courier New', monospace;
          font-size: 10px;
          line-height: 1.2;
          margin: 0;
          padding: 10px;
          white-space: pre-wrap;
        }
        @page {
          size: auto;
          margin: 5mm;
        }
      }
      body {
        font-family: 'Courier New', monospace;
        font-size: 10px;
        line-height: 1.2;
        margin: 0;
        padding: 10px;
        white-space: pre-wrap;
      }
    </style>
  `;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Batch Parking Receipts</title>
        ${thermalStyles}
      </head>
      <body>
        <pre>${allReceipts}</pre>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

// Quick print function for entry tickets
export const printEntryTicket = (ticket) => {
  printThermalReceipt(ticket);
};

// Quick print function for exit receipts
export const printExitReceipt = (ticket, exitTime) => {
  printThermalReceipt(ticket, exitTime);
};
