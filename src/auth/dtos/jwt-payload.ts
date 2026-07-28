export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  iat?: number;   // absents à la signature, présents à la vérification
  exp?: number;
}