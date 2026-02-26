// Billing calculation utility
export const calculateBilling = (entryTime, exitTime) => {
  console.log('Calculating billing:', { entryTime, exitTime });
  
  if (!entryTime || !exitTime) {
    console.error('Missing entryTime or exitTime');
    return { durationMs: 0, durationMinutes: 0, hoursCharged: 0, amountDue: 0 };
  }
  
  const durationMs = exitTime - entryTime;
  const durationMinutes = durationMs / (1000 * 60);
  const hoursCharged = Math.ceil(durationMinutes / 60);
  const amountDue = Math.max(1, hoursCharged) * 20;
  
  console.log('Billing result:', { durationMs, durationMinutes, hoursCharged, amountDue });
  
  return {
    durationMs,
    durationMinutes,
    hoursCharged,
    amountDue,
  };
};

// Format duration for display
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${Math.floor(minutes)} minutes`;
  } else if (minutes < 120) {
    return `${Math.floor(minutes / 60)} hour ${Math.floor(minutes % 60)} minutes`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours} hours ${mins} minutes`;
  }
};

// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount}`;
};
