const TimeZone = {
  EST: "America/New_York",
  HONDURAS: "America/Tegucigalpa",
  PHILIPPINES: "Asia/Manila",
} as const;

const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type TimeZone = (typeof TimeZone)[keyof typeof TimeZone];
export type Role = (typeof Roles)[keyof typeof Roles];

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
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

const OvertimeType = {
  PRE_SHIFT: "PRE_SHIFT",
  POST_SHIFT: "POST_SHIFT",
} as const;

const OvertimeStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type OvertimeType = (typeof OvertimeType)[keyof typeof OvertimeType];
export type OvertimeStatus =
  (typeof OvertimeStatus)[keyof typeof OvertimeStatus];

export type OvertimeRequest = {
  id: string;
  userId: string;
  hours: number;
  type: OvertimeType;
  status: OvertimeStatus;
  createdAt: Date;
  updatedAt: Date;
};
