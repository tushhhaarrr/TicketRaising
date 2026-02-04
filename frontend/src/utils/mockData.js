/* 
  Mock Data Utility
  Reason: Backend connect hone se pehle, frontend par "Real-time" updates simulare karne ke liye.
  Data ko localStorage mein save karenge taaki refresh ke baad bhi data rahe.
*/

const INITIAL_TICKETS = [
    { id: 1701, subject: 'Server Downtown', user: 'Tech Lead', status: 'Pending', category: 'Software', date: '2023-10-24', description: 'Main server is not responding.' },
    { id: 1702, subject: 'Payment Gateway Error', user: 'Finance Dept', status: 'Pending', category: 'Software', date: '2023-10-23', description: 'Transactions failing.' },
    { id: 1703, subject: 'AC Maintenance', user: 'HR Team', status: 'Resolved', category: 'Hardware', date: '2023-10-20', description: 'AC in room 302 leaking.' },
];

export const getTickets = () => {
    const stored = localStorage.getItem('mockTickets');
    if (!stored) {
        localStorage.setItem('mockTickets', JSON.stringify(INITIAL_TICKETS));
        return INITIAL_TICKETS;
    }
    return JSON.parse(stored);
};

export const addTicket = (ticket) => {
    const tickets = getTickets();
    const newTicket = { ...ticket, id: Math.floor(Math.random() * 10000) + 1000 };
    const updated = [newTicket, ...tickets];
    localStorage.setItem('mockTickets', JSON.stringify(updated));
    return newTicket;
};

export const updateTicketStatus = (id, newStatus) => {
    const tickets = getTickets();
    const updated = tickets.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
    );
    localStorage.setItem('mockTickets', JSON.stringify(updated));
    return updated;
};
