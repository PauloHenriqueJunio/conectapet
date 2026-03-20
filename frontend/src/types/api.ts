export type Role = "ONG" | "ADOTANTE";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  cep?: string | null;
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
  };
  adopter?: {
    id: string;
    name: string;
    email: string;
  };
}
