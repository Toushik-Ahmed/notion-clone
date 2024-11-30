import { User } from './type';

export {};

declare global {
  interface CustomJwtSessionClaims extends User {}
}
