enum TimeZone {
  EST = "America/New_York",
  HONDURAS = "America/Tegucigalpa",
  PHILIPPINES = "Asia/Manila",
}

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  timeZone: TimeZone;
  role: Role;
  scheduledStart: string;
  scheduledEnd: string;
  attendances: Attendance[];
  overtimeRequests: OvertimeRequest[];
};

export type Attendance = {
  id: string;
  userId: string;
  timeIn?: Date | null;
  timeOut?: Date | null;
  isLate: boolean;
  isAbsent: boolean;
  createdAt: Date;
  updatedAt: Date;
};

enum OvertimeType {
  PRE_SHIFT = "PRE_SHIFT",
  POST_SHIFT = "POST_SHIFT",
}

enum OvertimeStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type OvertimeRequest = {
  id: string;
  userId: string;
  hours: number;
  type: OvertimeType;
  status: OvertimeStatus;
  createdAt: Date;
  updatedAt: Date;
};
