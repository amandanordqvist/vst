import { StatusType } from '@/components/StatusBadge';

export interface Vessel {
  id: string;
  name: string;
  model: string;
  imageUrl: string;
  status: StatusType;
  lastCheck: string;
  lastMaintenance: string;
  location: string;
  issueCount?: number;
  type: string;
  length: string;
  registrationNumber: string;
  fuelLevel: number;
  engineHours: number;
}

export const vessels: Vessel[] = [
  {
    id: '1',
    name: 'Sea Breeze',
    model: 'Sunseeker Predator 60',
    imageUrl: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=800&auto=format&fit=crop',
    status: 'good',
    lastCheck: 'Today, 9:30 AM',
    lastMaintenance: '2023-10-15',
    location: 'Marina Bay, Slip 42',
    issueCount: 0,
    type: 'Motor Yacht',
    length: '42 ft',
    registrationNumber: 'VST-2023-0001',
    fuelLevel: 0.85,
    engineHours: 342,
  },
  {
    id: '2',
    name: 'Ocean Explorer',
    model: 'Beneteau Oceanis 38.1',
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
    status: 'warning',
    lastCheck: 'Yesterday, 4:15 PM',
    lastMaintenance: '2023-09-20',
    location: 'Harbor Point, Dock C',
    issueCount: 2,
    type: 'Sailing Yacht',
    length: '38 ft',
    registrationNumber: 'VST-2023-0002',
    fuelLevel: 0.45,
    engineHours: 567,
  },
  {
    id: '3',
    name: 'Coastal Cruiser',
    model: 'Lagoon 450 F',
    imageUrl: 'https://images.unsplash.com/photo-1575384043001-f37f54e1f44c?q=80&w=800&auto=format&fit=crop',
    status: 'critical',
    lastCheck: '3 days ago',
    lastMaintenance: '2023-08-01',
    location: 'Sunset Harbor, Pier 7',
    issueCount: 5,
    type: 'Catamaran',
    length: '45 ft',
    registrationNumber: 'VST-2023-0003',
    fuelLevel: 0.15,
    engineHours: 892,
  },
];