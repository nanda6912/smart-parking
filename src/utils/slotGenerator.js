// Generate 300 slots for each floor (600 total)
export const generateSlots = () => {
  const slots = [];
  
  // Generate Ground Floor slots (G1-G300)
  for (let i = 1; i <= 300; i++) {
    slots.push({
      slotId: `G${i}`,
      label: `G${i}`,
      floor: 'ground',
      status: 'empty',
      ticketId: null,
      vehicleNumber: null,
      phone: null,
      entryTime: null,
    });
  }
  
  // Generate First Floor slots (F1-F300)
  for (let i = 1; i <= 300; i++) {
    slots.push({
      slotId: `F${i}`,
      label: `F${i}`,
      floor: 'first',
      status: 'empty',
      ticketId: null,
      vehicleNumber: null,
      phone: null,
      entryTime: null,
    });
  }
  
  return slots;
};

export const getSlotsByFloor = (floor) => {
  const allSlots = generateSlots();
  return allSlots.filter(slot => slot.floor === floor);
};

export const getSlotStats = () => {
  const allSlots = generateSlots();
  const groundSlots = allSlots.filter(s => s.floor === 'ground');
  const firstSlots = allSlots.filter(s => s.floor === 'first');
  
  return {
    total: allSlots.length,
    ground: groundSlots.length,
    first: firstSlots.length,
  };
};
