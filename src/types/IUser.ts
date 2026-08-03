export enum Role {
  Client = "CLIENT",
  Admin = "ADMIN",
}

export type IUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  token: string;
};


export type IUserStats = {
    wins: number;
    losses: number;
    pokemonLength: number;
    winRate: number;
}

export type IUserProps = {
    id: string;
    email: string;
    role: Role;
    name: string;
    avatar: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    stats: IUserStats;
}