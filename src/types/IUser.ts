export enum Role {
  Client = "CLIENT",
  Consultant = "CONSULTANT", // CONSULTANT = COACH
  MasterCoach = "MASTER_COACH",
  Franchise = "FRANCHISE",
  Admin = "ADMIN",
}

export type IUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
};
