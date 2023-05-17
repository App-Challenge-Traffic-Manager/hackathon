import { IApplication } from "./application.interface";

export interface IDevice {
  id: string;
  name: string | null;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  apps: IApplication[];
}
