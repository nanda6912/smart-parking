import { calculateBilling, formatCurrency } from './billing';

// CSV Export Utility
export const exportToCSV = (data, filename, headers) => {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in values
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );
  
  const csvContent = [csvHeaders, ...csvRows].join('\n');
  downloadFile(csvContent, filename, 'text/csv');
};

// Export parking data for different time periods
export const exportParkingData = (tickets, period = 'today') => {
  const now = new Date();
  let startDate, endDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
      endDate = now;
  }

  const filteredTickets = tickets.filter(ticket => {
    const entryTime = new Date(ticket.entryTime);
    return entryTime >= startDate && entryTime <= endDate;
  });

  const exportData = filteredTickets.map(ticket => {
    const exitTime = ticket.exitTime ? new Date(ticket.exitTime) : null;
    const duration = exitTime ? (exitTime - new Date(ticket.entryTime)) / (1000 * 60) : 0;
    const billing = exitTime ? calculateBilling(ticket.entryTime, ticket.exitTime) : { amountDue: 0, duration: 0 };
    
    return {
      'Ticket ID': ticket.ticketId,
      'Vehicle Number': ticket.vehicleNumber,
      'Phone': ticket.phone,
      'Slot ID': ticket.slotId,
      'Entry Time': new Date(ticket.entryTime).toLocaleString('en-IN'),
      'Exit Time': exitTime ? exitTime.toLocaleString('en-IN') : 'Active',
      'Duration (minutes)': Math.round(duration),
      'Amount Due': billing.amountDue || 0,
      'Status': ticket.status,
      'Floor': ticket.slotId.includes('G') ? 'Ground' : 'First'
    };
  });

  const filename = `parking-data-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
  const headers = ['Ticket ID', 'Vehicle Number', 'Phone', 'Slot ID', 'Entry Time', 'Exit Time', 'Duration (minutes)', 'Amount Due', 'Status', 'Floor'];
  
  exportToCSV(exportData, filename, headers);
};

// Export revenue report
export const exportRevenueReport = (tickets, period = 'today') => {
  const now = new Date();
  let startDate, endDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      endDate = now;
  }

  const completedTickets = tickets.filter(ticket => {
    const exitTime = ticket.exitTime ? new Date(ticket.exitTime) : null;
    const entryTime = new Date(ticket.entryTime);
    return ticket.status === 'COMPLETED' && 
           exitTime && 
           entryTime >= startDate && 
           exitTime <= endDate;
  });

  // Group by date
  const revenueByDate = {};
  completedTickets.forEach(ticket => {
    const date = new Date(ticket.exitTime).toLocaleDateString('en-IN');
    const billing = calculateBilling(ticket.entryTime, ticket.exitTime);
    
    if (!revenueByDate[date]) {
      revenueByDate[date] = {
        date,
        vehicles: 0,
        revenue: 0,
        averageDuration: 0,
        totalDuration: 0
      };
    }
    
    revenueByDate[date].vehicles++;
    revenueByDate[date].revenue += billing.amountDue || 0;
    revenueByDate[date].totalDuration += billing.duration || 0;
  });

  // Calculate averages
  Object.values(revenueByDate).forEach(day => {
    day.averageDuration = day.vehicles > 0 ? day.totalDuration / day.vehicles : 0;
  });

  const exportData = Object.values(revenueByDate).map(day => ({
    'Date': day.date,
    'Vehicles': day.vehicles,
    'Revenue': formatCurrency(day.revenue).replace('₹', ''),
    'Average Duration': Math.round(day.averageDuration),
    'Average Revenue per Vehicle': day.vehicles > 0 ? (day.revenue / day.vehicles).toFixed(2) : 0
  }));

  // Add totals row
  const totals = exportData.reduce((acc, row) => ({
    vehicles: acc.vehicles + parseInt(row.Vehicles),
    revenue: acc.revenue + parseFloat(row.Revenue),
    duration: acc.duration + parseInt(row['Average Duration'])
  }), { vehicles: 0, revenue: 0, duration: 0 });

  exportData.push({
    'Date': 'TOTAL',
    'Vehicles': totals.vehicles,
    'Revenue': totals.revenue.toFixed(2),
    'Average Duration': totals.vehicles > 0 ? Math.round(totals.duration / exportData.length) : 0,
    'Average Revenue per Vehicle': totals.vehicles > 0 ? (totals.revenue / totals.vehicles).toFixed(2) : 0
  });

  const filename = `revenue-report-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
  const headers = ['Date', 'Vehicles', 'Revenue', 'Average Duration', 'Average Revenue per Vehicle'];
  
  exportToCSV(exportData, filename, headers);
};

// Export occupancy report
export const exportOccupancyReport = (slots, tickets, period = 'today') => {
  const now = new Date();
  let startDate, endDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      endDate = now;
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      endDate = now;
  }

  // Calculate hourly occupancy
  const hourlyData = {};
  for (let hour = 0; hour < 24; hour++) {
    hourlyData[hour] = {
      hour: `${hour.toString().padStart(2, '0')}:00`,
      occupied: 0,
      available: 0,
      occupancyRate: 0
    };
  }

  // Sample current occupancy (simplified - in real app, you'd track historical data)
  const currentOccupied = slots.filter(slot => slot.status === 'occupied').length;
  const currentAvailable = slots.length - currentOccupied;
  const currentHour = now.getHours();

  hourlyData[currentHour].occupied = currentOccupied;
  hourlyData[currentHour].available = currentAvailable;
  hourlyData[currentHour].occupancyRate = Math.round((currentOccupied / slots.length) * 100);

  const exportData = Object.values(hourlyData).map(data => ({
    'Hour': data.hour,
    'Occupied Slots': data.occupied,
    'Available Slots': data.available,
    'Occupancy Rate (%)': data.occupancyRate,
    'Total Slots': slots.length
  }));

  const filename = `occupancy-report-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
  const headers = ['Hour', 'Occupied Slots', 'Available Slots', 'Occupancy Rate (%)', 'Total Slots'];
  
  exportToCSV(exportData, filename, headers);
};

// Generic file download utility
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Export all reports in a ZIP-like format (multiple files)
export const exportAllReports = (tickets, slots, period = 'today') => {
  // Export all three reports
  exportParkingData(tickets, period);
  exportRevenueReport(tickets, period);
  exportOccupancyReport(slots, tickets, period);
  
  // Show success message
  const message = `✅ Exported all reports for ${period}:\n• Parking Data\n• Revenue Report\n• Occupancy Report\n\nCheck your downloads folder.`;
  alert(message);
};

// Export active vehicles (for emergency/management purposes)
export const exportActiveVehicles = (tickets) => {
  const activeTickets = tickets.filter(ticket => ticket.status === 'ACTIVE');
  
  const exportData = activeTickets.map(ticket => {
    const duration = (new Date() - new Date(ticket.entryTime)) / (1000 * 60);
    const billing = calculateBilling(ticket.entryTime, new Date());
    
    return {
      'Ticket ID': ticket.ticketId,
      'Vehicle Number': ticket.vehicleNumber,
      'Phone': ticket.phone,
      'Slot ID': ticket.slotId,
      'Entry Time': new Date(ticket.entryTime).toLocaleString('en-IN'),
      'Current Duration (minutes)': Math.round(duration),
      'Current Amount Due': billing.amountDue || 0,
      'Floor': ticket.slotId.includes('G') ? 'Ground' : 'First'
    };
  });

  const filename = `active-vehicles-${new Date().toISOString().slice(0, 10)}.csv`;
  const headers = ['Ticket ID', 'Vehicle Number', 'Phone', 'Slot ID', 'Entry Time', 'Current Duration (minutes)', 'Current Amount Due', 'Floor'];
  
  exportToCSV(exportData, filename, headers);
};
