export interface User {
  id: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
}

export interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  status: 'available' | 'occupied' | 'cleaning' | 'do_not_disturb';
}

export interface Booking {
  id: number;
  userId: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed';
}

export interface Complaint {
  id: number;
  userId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}