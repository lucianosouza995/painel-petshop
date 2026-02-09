export type ClientStatus = 'Active' | 'Inactive' | 'In Limbo';
export type PlanType = 'Basic' | 'Premium' | 'Gold';
export type AppointmentStatus = 'Pending' | 'In Progress' | 'Completed' | 'No Show';
export type ServiceType = 'Welcome' | 'Routine' | 'Post-Vet';
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  imageUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  pets: Pet[];
  plan: PlanType;
  status: ClientStatus;
  joinedDate: string;
}

export interface AuditLog {
  id: string;
  clientId: string;
  petId?: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  type: 'Medical' | 'Admin' | 'Financial';
}

export interface Appointment {
  id: string;
  clientId: string;
  petId: string;
  vetName: string;
  date: string;
  status: AppointmentStatus;
  serviceType: ServiceType;
  notes?: string;
  
  // Monitoring Metrics
  vetRating?: number; // 1-5
  riskScore?: number; // 0-100
  sentiment?: Sentiment;
  healthEvolution?: 'improving' | 'stable' | 'declining';
}
