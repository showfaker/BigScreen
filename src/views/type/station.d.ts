
export interface StationType {
  [key: string]: string;
}
  
export interface StationData {
  name: string;
  count?: number;
  totalCapacity?: number;
}

export interface systemgjData {
	alarmLevel: string;
	alarmText?: string;
	deviceName?: string;
	startTime?: number;
	stationName?: number;
}

export interface StationData {
	stations: Array<{
	  region: string;
	  // 其他可能需要的字段
	}>;
  }