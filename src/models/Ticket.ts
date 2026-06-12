import mongoose, { Schema, Document } from 'mongoose';

export interface INote {
  noteText: string;
  createdAt: Date;
}

export interface ITicket extends Document {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  notes: INote[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  noteText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TicketSchema = new Schema<ITicket>({
  ticketId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open'
  },
  notes: [NoteSchema]
}, {
  timestamps: true
});

// Create index for search functionality across text fields
TicketSchema.index({
  ticketId: 'text',
  customerName: 'text',
  customerEmail: 'text',
  subject: 'text',
  description: 'text'
});

export const Ticket = (mongoose.models.Ticket as mongoose.Model<ITicket>) || mongoose.model<ITicket>('Ticket', TicketSchema);
