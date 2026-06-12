import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { connectToDatabase } from './src/lib/mongodb';
import { Ticket } from './src/models/Ticket';

// --- IN-MEMORY FALLBACK DATABASE SCHEMAS & PRE-LOADED DATA ---
interface INoteMem {
  noteText: string;
  createdAt: Date;
}

interface ITicketMem {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  notes: INoteMem[];
  createdAt: Date;
  updatedAt: Date;
}

let inMemoryTickets: ITicketMem[] = [
  {
    ticketId: 'TKT-001',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    subject: 'Cannot access login dashboard',
    description: 'When attempting to click the sign in button, the page freezes and throws a console error about chunk loading failure. Please assist as this is affecting our entire operations team.',
    status: 'Open',
    notes: [
      { noteText: 'Attempted to recreate. Appears to be related to cached CDN bundles.', createdAt: new Date(Date.now() - 3600000 * 2) }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 2)
  },
  {
    ticketId: 'TKT-002',
    customerName: 'Robert Smith',
    customerEmail: 'robert@example.com',
    subject: 'Billing inquiry - Invoice #4492',
    description: 'I was double charged for this month subscription. The invoice #4492 shows a total of $156.00 but my credit card statement has two transactions for $156.00 each.',
    status: 'In Progress',
    notes: [
      { noteText: 'Contacted Stripe billing. Awaiting manual trigger refund verification.', createdAt: new Date(Date.now() - 3600000) }
    ],
    createdAt: new Date(Date.now() - 3650000 * 24),
    updatedAt: new Date(Date.now() - 3600000)
  },
  {
    ticketId: 'TKT-003',
    customerName: 'Charlie Davis',
    customerEmail: 'charlie@example.com',
    subject: 'Feature Request: Dark Mode API',
    description: 'We would love to request a dark mode theme toggle for our embedded support-crm widget. This would help us style the client side interface to integrate cleanly into our SaaS.',
    status: 'Closed',
    notes: [
      { noteText: 'Resolved by providing clean customization options in v2.4.0 configuration parameters.', createdAt: new Date(Date.now() - 3600000 * 4) }
    ],
    createdAt: new Date(Date.now() - 3700000 * 24),
    updatedAt: new Date(Date.now() - 3600000 * 4)
  },
  {
    ticketId: 'TKT-004',
    customerName: 'Eve Wilson',
    customerEmail: 'eve@example.com',
    subject: 'Webhook signature verification failing',
    description: 'We are receiving webhook payloads but the signature verification fails every single time. We are using the correct secret token from our CRM settings panel.',
    status: 'Open',
    notes: [],
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000)
  }
];

// Helper to determine which database mode to target
async function checkDatabaseAvailable(): Promise<{ available: boolean; fallbackReason?: string }> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '' || uri.includes('MY_MONGODB_URI')) {
    return { available: false, fallbackReason: 'MONGODB_URI is not set in environment secrets' };
  }
  try {
    await connectToDatabase();
    return { available: true };
  } catch (err: any) {
    return { available: false, fallbackReason: err.message || 'Failed to establish physical connection to Atlas cluster' };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse incoming request bodies as JSON
  app.use(express.json());

  // Inject Custom Database Header to every API Call
  app.use(async (req, res, next) => {
    const dbStatus = await checkDatabaseAvailable();
    res.setHeader('X-Database-Mode', dbStatus.available ? 'MongoDB Atlas' : 'In-Memory Demo Sandbox');
    if (!dbStatus.available) {
      res.setHeader('X-Fallback-Reason', dbStatus.fallbackReason || 'unknown');
    }
    next();
  });

  // API Route: POST /api/tickets - Create a new ticket
  app.post('/api/tickets', async (req: Request, res: Response) => {
    try {
      const { customerName, customerEmail, subject, description } = req.body;

      if (!customerName || !customerEmail || !subject || !description) {
        return res.status(400).json({ error: 'All fields are required: customerName, customerEmail, subject, description.' });
      }

      const dbStatus = await checkDatabaseAvailable();

      if (dbStatus.available) {
        // --- REAL MONGO ROUTE ---
        const tickets = await Ticket.find({}, { ticketId: 1 });
        let maxNum = 0;
        for (const t of tickets) {
          const match = t.ticketId.match(/TKT-(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) { maxNum = num; }
          }
        }
        const nextNum = maxNum + 1;
        const ticketId = `TKT-${String(nextNum).padStart(3, '0')}`;

        const newTicket = new Ticket({
          ticketId,
          customerName,
          customerEmail,
          subject,
          description,
          status: 'Open',
          notes: []
        });

        await newTicket.save();

        return res.status(201).json({
          ticketId: newTicket.ticketId,
          createdAt: newTicket.createdAt,
          databaseMode: 'MongoDB Atlas'
        });
      } else {
        // --- IN-MEMORY MOCK ROUTE ---
        let maxNum = 0;
        for (const t of inMemoryTickets) {
          const match = t.ticketId.match(/TKT-(\d+)/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) { maxNum = num; }
          }
        }
        const nextNum = maxNum + 1;
        const ticketId = `TKT-${String(nextNum).padStart(3, '0')}`;

        const newTicket: ITicketMem = {
          ticketId,
          customerName,
          customerEmail,
          subject,
          description,
          status: 'Open',
          notes: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        inMemoryTickets.unshift(newTicket); // Prepend to show immediately in listings

        return res.status(201).json({
          ticketId: newTicket.ticketId,
          createdAt: newTicket.createdAt,
          databaseMode: 'In-Memory Sandbox'
        });
      }
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      return res.status(500).json({ error: error.message || 'Server error occurred while creating ticket.' });
    }
  });

  // API Route: GET /api/tickets - Support search and filter
  app.get('/api/tickets', async (req: Request, res: Response) => {
    try {
      const { status, search } = req.query as { status?: string; search?: string };
      const dbStatus = await checkDatabaseAvailable();

      if (dbStatus.available) {
        // --- REAL MONGO ROUTE ---
        const query: any = {};
        if (status && status !== 'All') {
          query.status = status;
        }
        if (search && search.trim() !== '') {
          const searchRegex = new RegExp(search.trim(), 'i');
          query.$or = [
            { ticketId: searchRegex },
            { customerName: searchRegex },
            { customerEmail: searchRegex },
            { subject: searchRegex },
            { description: searchRegex }
          ];
        }

        const tickets = await Ticket.find(query)
          .select('ticketId customerName subject status createdAt')
          .sort({ createdAt: -1 });

        return res.json(tickets);
      } else {
        // --- IN-MEMORY MOCK ROUTE ---
        let filtered = [...inMemoryTickets];

        // Filter status
        if (status && status !== 'All') {
          filtered = filtered.filter(t => t.status === status);
        }

        // Search text matching
        if (search && search.trim() !== '') {
          const term = search.trim().toLowerCase();
          filtered = filtered.filter(t => 
            t.ticketId.toLowerCase().includes(term) ||
            t.customerName.toLowerCase().includes(term) ||
            t.customerEmail.toLowerCase().includes(term) ||
            t.subject.toLowerCase().includes(term) ||
            t.description.toLowerCase().includes(term)
          );
        }

        // Return trimmed items (only what table needs)
        const output = filtered.map(t => ({
          ticketId: t.ticketId,
          customerName: t.customerName,
          subject: t.subject,
          status: t.status,
          createdAt: t.createdAt
        }));

        return res.json(output);
      }
    } catch (error: any) {
      console.error('Error listing tickets:', error);
      return res.status(500).json({ error: error.message || 'Server error occurred while fetching tickets.' });
    }
  });

  // API Route: GET /api/tickets/:ticketId - Get complete details for a ticket
  app.get('/api/tickets/:ticketId', async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      const dbStatus = await checkDatabaseAvailable();

      if (dbStatus.available) {
        // --- REAL MONGO ROUTE ---
        const ticket = await Ticket.findOne({ ticketId });
        if (!ticket) {
          return res.status(404).json({ error: `Ticket with ID ${ticketId} not found.` });
        }

        return res.json({
          ticketId: ticket.ticketId,
          customerName: ticket.customerName,
          customerEmail: ticket.customerEmail,
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          notes: ticket.notes,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt
        });
      } else {
        // --- IN-MEMORY MOCK ROUTE ---
        const ticket = inMemoryTickets.find(t => t.ticketId === ticketId);
        if (!ticket) {
          return res.status(404).json({ error: `Ticket with ID ${ticketId} not found.` });
        }
        return res.json(ticket);
      }
    } catch (error: any) {
      console.error('Error fetching ticket details:', error);
      return res.status(500).json({ error: error.message || 'Server error occurred while retrieving ticket.' });
    }
  });

  // API Route: PUT /api/tickets/:ticketId - Update status and/or append notes
  app.put('/api/tickets/:ticketId', async (req: Request, res: Response) => {
    try {
      const { ticketId } = req.params;
      const { status, noteText } = req.body;
      const dbStatus = await checkDatabaseAvailable();

      if (dbStatus.available) {
        // --- REAL MONGO ROUTE ---
        const ticket = await Ticket.findOne({ ticketId });
        if (!ticket) {
          return res.status(404).json({ error: `Ticket with ID ${ticketId} not found.` });
        }

        if (status) {
          if (!['Open', 'In Progress', 'Closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Status must be Open, In Progress, or Closed.' });
          }
          ticket.status = status;
        }

        if (noteText && typeof noteText === 'string' && noteText.trim() !== '') {
          ticket.notes.push({
            noteText: noteText.trim(),
            createdAt: new Date()
          });
        }

        await ticket.save();

        return res.json({
          success: true,
          updatedAt: ticket.updatedAt
        });
      } else {
        // --- IN-MEMORY MOCK ROUTE ---
        const ticket = inMemoryTickets.find(t => t.ticketId === ticketId);
        if (!ticket) {
          return res.status(404).json({ error: `Ticket with ID ${ticketId} not found.` });
        }

        if (status) {
          if (!['Open', 'In Progress', 'Closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Status must be Open, In Progress, or Closed.' });
          }
          ticket.status = status;
        }

        if (noteText && typeof noteText === 'string' && noteText.trim() !== '') {
          ticket.notes.push({
            noteText: noteText.trim(),
            createdAt: new Date()
          });
        }

        ticket.updatedAt = new Date();

        return res.json({
          success: true,
          updatedAt: ticket.updatedAt
        });
      }
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      return res.status(500).json({ error: error.message || 'Server error occurred while updating ticket.' });
    }
  });

  // Vite Integration for Serving Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server executing successfully on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start full-stack server:', err);
});
