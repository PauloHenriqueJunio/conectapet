export type Role = "ONG" | "PESSOA_FISICA";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  cep?: string | null;
  state?: string | null;
  city?: string | null;
  contact?: string | null;
  address?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
  description: string;
  photoUrl: string;
  isAdopted: boolean;
  ongId: string;
  size: string;
  sex: string;
  isCastrated: boolean;
  isDewormed: boolean;
  hasVaccineV8: boolean;
  hasVaccineGiardia: boolean;
  hasVaccineFlu: boolean;
  hasVaccineRabies: boolean;
  hasVaccineFeline: boolean;
  hasVaccineFelv: boolean;
  hasHistoryOfIllness: boolean;
  illnessDescription?: string | null;
  hasOtherHealthInfo: boolean;
  otherHealthInfoDescription?: string | null;
  ong?: {
    name: string;
    contact?: string;
  };
}

export interface AdoptionRequest {
  id: string;
  petId: string;
  adopterId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
  createdAt: string;
  pet?: {
    id: string;
    name: string;
    species: string;
    photoUrl: string;
    hasVaccineV8: boolean;
    hasVaccineGiardia: boolean;
    isCastrated: boolean;
    isDewormed: boolean;
    hasVaccineRabies: boolean;
    hasVaccineFlu: boolean;
    hasVaccineFeline: boolean;
    hasVaccineFelv: boolean;
    hasHistoryOfIllness: boolean;
    illnessDescription?: string | null;
    hasOtherHealthInfo: string | null;
    otherHealthInfoDescription?: string | null;
  };
  adopter?: {
    id: string;
    name: string;
    email: string;
  };
}
