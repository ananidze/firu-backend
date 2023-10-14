export interface JwtDto {
  _id: string;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
  /**
   * Role
   */
  role: string;
  /**
   * Permissions
   */
  permissions: string[];
}
