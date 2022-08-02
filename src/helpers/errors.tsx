export class PermissionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionsError";
  }
}