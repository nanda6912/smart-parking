// Utility functions for exporting data to CSV format

export const exportToCSV = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  let csvContent = '';

  // Add headers if provided
  if (headers) {
    csvContent += headers.join(',') + '\n';
  }

  // Convert data to CSV rows
  data.forEach(item => {
    const row = Object.values(item).map(value => {
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvContent += row.join(',') + '\n';
  });

  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTicketsToCSV = (tickets, dateRange = 'all') => {
  let filteredTickets = [...tickets];
  
  // Filter by date range
  if (dateRange === 'today') {
    const today = new Date().toDateString();
    filteredTickets = tickets.filter(ticket => 
      new Date(ticket.entryTime).toDateString() === today
    );
  } else if (dateRange === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredTickets = tickets.filter(ticket => 
      new Date(ticket.entryTime) >= weekAgo
    );
  } else if (dateRange === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    filteredTickets = tickets.filter(ticket => 
      new Date(ticket.entryTime) >= monthAgo
    );
  }

  const headers = [
    'Ticket ID',
    'Vehicle Number',
    'Vehicle Type',
    'Phone Number',
    'Slot Number',
    'Floor',
    'Entry Time',
    'Exit Time',
    'Duration (minutes)',
    'Amount (₹)',
    'Status'
  ];

  const data = filteredTickets.map(ticket => {
    const entryTime = new Date(ticket.entryTime);
    const exitTime = ticket.exitTime ? new Date(ticket.exitTime) : null;
    const duration = exitTime ? Math.floor((exitTime - entryTime) / (1000 * 60)) : 0;

    return {
      'Ticket ID': ticket.id || '',
      'Vehicle Number': ticket.vehicle?.number || '',
      'Vehicle Type': ticket.vehicle?.type || '',
      'Phone Number': ticket.vehicle?.phone || '',
      'Slot Number': ticket.slotNumber || '',
      'Floor': ticket.floor || '',
      'Entry Time': entryTime.toLocaleString(),
      'Exit Time': exitTime ? exitTime.toLocaleString() : '',
      'Duration (minutes)': duration,
      'Amount (₹)': ticket.amount || 0,
      'Status': ticket.exitTime ? 'Completed' : 'Active'
    };
  });

  const filename = `parking-tickets-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(data, filename, headers);
};

export const exportSlotsToCSV = (slots) => {
  const headers = [
    'Slot Number',
    'Floor',
    'Status',
    'Vehicle Number',
    'Vehicle Type',
    'Entry Time',
    'Duration (minutes)',
    'Current Amount (₹)'
  ];

  const now = new Date();

  const data = slots.map(slot => {
    let duration = 0;
    let currentAmount = 0;
    
    if (slot.vehicle && slot.entryTime) {
      const entryTime = new Date(slot.entryTime);
      duration = Math.floor((now - entryTime) / (1000 * 60));
      currentAmount = Math.ceil(duration / 60) * 20; // ₹20 per hour
    }

    return {
      'Slot Number': slot.slotNumber || '',
      'Floor': slot.floor || '',
      'Status': slot.status || '',
      'Vehicle Number': slot.vehicle?.number || '',
      'Vehicle Type': slot.vehicle?.type || '',
      'Entry Time': slot.entryTime ? new Date(slot.entryTime).toLocaleString() : '',
      'Duration (minutes)': duration,
      'Current Amount (₹)': currentAmount
    };
  });

  const filename = `parking-slots-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(data, filename, headers);
};

export const exportRevenueReport = (tickets, dateRange = 'month') => {
  let filteredTickets = tickets.filter(ticket => ticket.status === 'completed' && ticket.amount);
  
  // Filter by date range
  const now = new Date();
  let startDate = new Date();
  
  if (dateRange === 'today') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (dateRange === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else if (dateRange === 'month') {
    startDate.setMonth(now.getMonth() - 1);
  } else if (dateRange === 'year') {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  filteredTickets = filteredTickets.filter(ticket => 
    new Date(ticket.exitTime) >= startDate
  );

  // Group by date
  const revenueByDate = {};
  filteredTickets.forEach(ticket => {
    const date = new Date(ticket.exitTime).toDateString();
    if (!revenueByDate[date]) {
      revenueByDate[date] = {
        date: date,
        revenue: 0,
        tickets: 0,
        averageAmount: 0
      };
    }
    revenueByDate[date].revenue += ticket.amount;
    revenueByDate[date].tickets += 1;
  });

  // Calculate averages
  Object.values(revenueByDate).forEach(day => {
    day.averageAmount = day.tickets > 0 ? day.revenue / day.tickets : 0;
  });

  const headers = [
    'Date',
    'Total Revenue (₹)',
    'Number of Tickets',
    'Average Amount (₹)',
    'Peak Hour'
  ];

  const data = Object.values(revenueByDate).map(day => ({
    'Date': new Date(day.date).toLocaleDateString(),
    'Total Revenue (₹)': day.revenue.toFixed(2),
    'Number of Tickets': day.tickets,
    'Average Amount (₹)': day.averageAmount.toFixed(2),
    'Peak Hour': 'N/A' // This would need additional analysis
  }));

  const filename = `revenue-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(data, filename, headers);
};

export const generateDailyReport = (slots, tickets) => {
  const today = new Date().toDateString();
  const todayTickets = tickets.filter(ticket => 
    new Date(ticket.entryTime).toDateString() === today
  );

  const completedToday = todayTickets.filter(ticket => ticket.exitTime);
  const activeToday = todayTickets.filter(ticket => !ticket.exitTime);
  
  const totalRevenue = completedToday.reduce((sum, ticket) => sum + (ticket.amount || 0), 0);
  const totalVehicles = todayTickets.length;

  const report = {
    date: new Date().toLocaleDateString(),
    totalSlots: slots.length,
    availableSlots: slots.filter(slot => slot.status === 'available').length,
    occupiedSlots: slots.filter(slot => slot.status === 'occupied').length,
    totalVehicles,
    activeVehicles: activeToday.length,
    completedVehicles: completedToday.length,
    totalRevenue,
    averageRevenuePerVehicle: totalVehicles > 0 ? totalRevenue / totalVehicles : 0,
    occupancyRate: ((slots.filter(slot => slot.status === 'occupied').length / slots.length) * 100).toFixed(2)
  };

  const headers = ['Metric', 'Value'];
  const data = Object.entries(report).map(([key, value]) => ({
    'Metric': key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    'Value': typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value
  }));

  const filename = `daily-report-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(data, filename, headers);

  return report;
};
