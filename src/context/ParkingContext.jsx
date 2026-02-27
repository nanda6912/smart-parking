import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateSlots } from '../utils/slotGenerator';

const initialSlots = generateSlots();

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem('parkingState');
    if (!raw) return { slots: initialSlots, tickets: [] };
    const parsed = JSON.parse(raw);
    return {
      slots: parsed.slots || initialSlots,
      tickets: (parsed.tickets || []).map(t => ({
        ...t,
        entryTime: t.entryTime ? new Date(t.entryTime) : null,
        exitTime: t.exitTime ? new Date(t.exitTime) : null,
      })),
    };
  } catch {
    return { slots: initialSlots, tickets: [] };
  }
};

const reducer = (state, action) => {
  switch (action.type) {

    case 'BOOK_SLOT': {
      const { slotId, ticketId, vehicleNumber, phone, entryTime } = action.payload;
      return {
        ...state,
        slots: state.slots.map(s =>
          s.slotId === slotId
            ? { ...s, status: 'occupied', ticketId, vehicleNumber, phone, entryTime }
            : s
        ),
        tickets: [
          ...state.tickets,
          { ticketId, slotId, vehicleNumber, phone, entryTime, status: 'ACTIVE' }
        ],
      };
    }

    case 'RELEASE_SLOT': {
      const { ticketId, exitTime } = action.payload;
      const ticket = state.tickets.find(t => t.ticketId === ticketId);
      return {
        ...state,
        slots: state.slots.map(s =>
          s.slotId === ticket?.slotId
            ? { ...s, status: 'empty', ticketId: null, vehicleNumber: null, phone: null, entryTime: null }
            : s
        ),
        tickets: state.tickets.map(t =>
          t.ticketId === ticketId
            ? { ...t, status: 'COMPLETED', exitTime }
            : t
        ),
      };
    }

    default:
      return state;
  }
};

const ParkingContext = createContext();

export const ParkingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage);

  // Persist every state change to localStorage
  useEffect(() => {
    localStorage.setItem('parkingState', JSON.stringify(state));
  }, [state]);

  const generateTicketId = () => {
    const d = new Date();
    const date = d.toISOString().slice(0,10).replace(/-/g,'');
    const rand = Math.floor(Math.random() * 10000).toString().padStart(4,'0');
    return `TKT-${date}-${rand}`;
  };

  const bookSlot = (slotId, vehicleNumber, phone) => {
    const ticketId = generateTicketId();
    const entryTime = new Date();
    dispatch({ type: 'BOOK_SLOT', payload: { slotId, ticketId, vehicleNumber, phone, entryTime } });
    return { ticketId, entryTime };
  };

  const releaseSlot = (ticketId) => {
    const ticket = state.tickets.find(t => t.ticketId === ticketId && t.status === 'ACTIVE');
    if (!ticket) return null;
    const exitTime = new Date();
    dispatch({ type: 'RELEASE_SLOT', payload: { ticketId, exitTime } });
    return { ...ticket, exitTime };
  };

  const getTicket = (ticketId) => state.tickets.find(t => t.ticketId === ticketId);
  const getSlot = (slotId) => state.slots.find(s => s.slotId === slotId);

  return (
    <ParkingContext.Provider value={{
      slots: state.slots,
      tickets: state.tickets,
      bookSlot, releaseSlot, getTicket, getSlot
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) throw new Error('useParking must be used within ParkingProvider');
  return context;
};
