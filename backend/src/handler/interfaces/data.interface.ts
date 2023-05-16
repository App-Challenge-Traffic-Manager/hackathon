export interface ApplicationData {
  pid: string;
  name: string;
  create_time: string;
  last_time_update: string;
  upload: string;
  download: string;
  upload_speed: number;
  download_speed: number;
  protocol_traffic: ProtocolTrafficData[];
  host_traffic: HostTrafficData[];
}

export interface ProtocolTrafficData {
  protocol: string;
  download: string;
  upload: string;
}

export interface HostTrafficData {
  host: string;
  download: string;
  upload: string;
}
