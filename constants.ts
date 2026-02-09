import { Client, Appointment, AuditLog } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Alice Silva',
    email: 'alice@example.com',
    phone: '555-0101',
    plan: 'Premium',
    status: 'Active',
    joinedDate: '2023-01-15',
    pets: [
      { id: 'p1', name: 'Luna', breed: 'Golden Retriever', age: 3, weight: 28, imageUrl: 'https://picsum.photos/200/200?random=1' },
      { id: 'p2', name: 'Max', breed: 'Beagle', age: 5, weight: 14, imageUrl: 'https://picsum.photos/200/200?random=2' }
    ]
  },
  {
    id: 'c2',
    name: 'Roberto Souza',
    email: 'roberto@example.com',
    phone: '555-0202',
    plan: 'Basic',
    status: 'In Limbo', // Logic will verify this
    joinedDate: '2023-03-10',
    pets: [
      { id: 'p3', name: 'Mingau', breed: 'Gato Siamês', age: 2, weight: 4, imageUrl: 'https://picsum.photos/200/200?random=3' }
    ]
  },
  {
    id: 'c3',
    name: 'Carolina Dias',
    email: 'carol@example.com',
    phone: '555-0303',
    plan: 'Gold',
    status: 'Active',
    joinedDate: '2023-06-20',
    pets: [
      { id: 'p4', name: 'Rocky', breed: 'Bulldog', age: 4, weight: 24, imageUrl: 'https://picsum.photos/200/200?random=4' }
    ]
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    clientId: 'c1',
    petId: 'p1',
    vetName: 'Dra. Sarah Wilson',
    date: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(), // Today 9 AM
    status: 'Completed',
    serviceType: 'Routine',
    notes: 'Luna está saudável. Peso estável.',
    vetRating: 5,
    riskScore: 10,
    sentiment: 'Positive',
    healthEvolution: 'stable'
  },
  {
    id: 'a2',
    clientId: 'c1',
    petId: 'p2',
    vetName: 'Dra. Sarah Wilson',
    date: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(), // Today 10:30 AM
    status: 'In Progress',
    serviceType: 'Post-Vet',
    notes: 'Verificando lesão na perna. Parece melhor, mas ainda manca um pouco.',
  },
  {
    id: 'a3',
    clientId: 'c3',
    petId: 'p4',
    vetName: 'Dr. James Lee',
    date: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(), // Today 2 PM
    status: 'Pending',
    serviceType: 'Welcome',
  }
];

export const MOCK_LOGS: AuditLog[] = [
  {
    id: 'l1',
    clientId: 'c1',
    petId: 'p1',
    timestamp: '2023-10-01T10:00:00Z',
    action: 'Atualização de Plano',
    user: 'Admin',
    details: 'Upgrade para Plano Premium',
    type: 'Financial'
  },
  {
    id: 'l2',
    clientId: 'c1',
    petId: 'p1',
    timestamp: '2023-10-15T09:30:00Z',
    action: 'Verificação de Peso',
    user: 'Dra. Wilson',
    details: 'Peso registrado: 28kg (anterior 27.5kg)',
    type: 'Medical'
  },
  {
    id: 'l3',
    clientId: 'c2',
    petId: 'p3',
    timestamp: '2023-11-01T14:15:00Z',
    action: 'Vacinação',
    user: 'Enf. Joy',
    details: 'Administrou reforço de Raiva',
    type: 'Medical'
  }
];
