export interface Participant {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  uid: string;
  uid_type?: string | null;
  state: string;
}

export interface LoginResponse {
  ok: string;
  token?: string;
  participant?: Participant;
  message: string;
}

export interface SignupError {
  [key: string]: string;
}

export interface SignupResponse {
  ok: string;
  message: string;
  participant?: Participant;
  errors?: SignupError;
  code_error?: number;
}

export interface LoginRequest {
  api_key: string;
  campaign: string;
  participation: {
    'codigo-de-cliente': string;
    password: string;
  };
}

export interface SignupRequest {
  api_key: string;
  campaign: string;
  properties: {
    email: string;
    'nombre-completo': string;
    'codigo-de-cliente': string;
    password: string;
  };
}