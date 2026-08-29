export type Role = "ONG" | "PESSOA_FISICA";

export interface AuthUserPublic {
  id: string;
  name: string;
  email: string;
  cep?: string | null;
  state?: string | null;
  city?: string | null;
  contact?: string | null;
  address?: string | null;
  photoUrl?: string | null;
  role: Role;
}

export interface AuthUserFull extends AuthUserPublic {
  cpf?: string | null;
  cnpj?: string | null;
}

export type AuthUser = AuthUserFull;

export interface AuthResponse {
  user: AuthUserPublic;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
  description: string;
  photoUrl: string;
  photoUrls: string[];
  featuredPhotoIndex: number;
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
    id?: string;
    name?: string;
    contact?: string | null;
    city?: string | null;
    state?: string | null;
  };
  owner?: {
    id?: string;
    name?: string;
    contact?: string | null;
    city?: string | null;
    state?: string | null;
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
    hasOtherHealthInfo: boolean;
    otherHealthInfoDescription?: string | null;
    ong?: {
      id?: string;
      name?: string;
    };
  };
  adopter?: {
    id: string;
    name: string;
    email: string;
    contact?: string | null;
  };
}
