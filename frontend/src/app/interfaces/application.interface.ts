export interface IApplication {
  id: string;
  name: string;
  upload: string;
  download: string;
  upload_speed: number;
  download_speed: number;
  started_at: string;
  last_updated_at: string;
  deviceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
