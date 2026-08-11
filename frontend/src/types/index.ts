export type Role = 'admin' | 'user';

export type EmergencySeverity = 'Low' | 'Mild' | 'Moderate' | 'High' | 'Critical';

export type RiskLevel = 'Healthy' | 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical';

export type EmergencyStatus = 
  | 'Request Sent'
  | 'Ambulance Assigned'
  | 'Driver En Route'
  | 'Ambulance Arrived'
  | 'Patient Picked Up'
  | 'Reached Hospital'
  | 'Monitoring Recovery'
  | 'SOS Activated'
  | 'Auto-Cancelled'
  | 'Completed'
  | 'Cancelled';

export type AmbulanceStatus = 'available' | 'busy' | 'maintenance' | 'offline';

export type DriverStatus = 'available' | 'busy' | 'offline';

export type StressLevel = 'Low' | 'Moderate' | 'High';

export interface HealthMetrics {
  heartRate: number;           // BPM
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  spO2: number;                // %
  temperature: number;         // Celsius
  bloodSugar: number;          // mg/dL
  weight: number;              // kg
  height: number;              // cm
  bmi: number;
  sleepHours: number;
  caloriesBurned: number;
  dailySteps: number;
  waterIntake: number;         // Liters
  stressLevel: StressLevel;
  // Medical Details
  medicalNotes: string;
  allergies: string;
  chronicDiseases: string;
  currentMedications: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  isBlocked?: boolean;
  isActive?: boolean;
  phone?: string;
  age?: number;
  dob?: string;
  gender?: string;
  bloodGroup?: string;

  // AI Risk Classification
  healthScore?: number;        // 0-100
  riskLevel?: RiskLevel;

  // 18 Health Metrics (flattened for UI use)
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  spO2?: number;
  temperature?: number;
  bloodSugar?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  sleepHours?: number;
  caloriesBurned?: number;
  dailySteps?: number;
  waterIntake?: number;
  stressLevel?: StressLevel;
  medicalNotes?: string;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;

  emergencyContacts?: EmergencyContact[];
  lastSignedIn?: string;
  createdAt?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Ambulance {
  _id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  status: AmbulanceStatus;
  currentLocation: Location;
  fuelLevel: number;
  lastMaintenanceDate?: string;
  driverId?: Driver | string;
  hospitalId?: Hospital | string;
  gpsStatus: 'active' | 'inactive';
  speed?: number;
  maintenanceHistory?: { date: string; details: string; cost: number }[];
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry?: string;
  experience: number;
  rating: number;
  status: DriverStatus;
  ambulanceId?: Ambulance | string;
  completedTrips?: number;
}

export interface Hospital {
  _id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcuBeds: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface EmergencyRequest {
  _id: string;
  userId?: User | string;
  patientName: string;
  patientAge?: number;
  patientPhone?: string;
  location: Location;
  severity: EmergencySeverity;
  description?: string;
  status: EmergencyStatus;
  ambulanceId?: Ambulance;
  driverId?: Driver;
  hospitalId?: Hospital;
  estimatedArrivalTime?: string;
  distanceRemainingKm?: number;
  priority: number;
  // Smart Recovery Workflow
  inRecoveryPhase?: boolean;
  recoveryTimerSeconds?: number;
  createdAt?: string;
  completedAt?: string;
}

export interface TelemetryData {
  ambulanceId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heartRate: number;
  bloodPressure: string;
  spO2: number;
  temperature: string;
  bloodSugar: number;
  estimatedArrival: string;
  distanceRemaining: string;
  timestamp: string;
}

export interface EmergencyContact {
  _id?: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIRiskStats {
  healthy: number;
  lowRisk: number;
  moderateRisk: number;
  highRisk: number;
  critical: number;
}
