import { IHostTraffic } from './host-traffic.interface';
import { IProtocolTraffic } from './protocol-traffic.interface';

export interface IApplication {
  id: string;
  pid: number;
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
  protocol_traffics: IProtocolTraffic[];
  host_traffics: IHostTraffic[];
}
