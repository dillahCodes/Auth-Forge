export interface GetSessions {
  currentSessionId: string;
  sessions: Session[];
}

export type GetSessionsCount = SessionCount[];

export interface SessionCount {
  _count: number;
  revoked: boolean;
}

export interface Session {
  id: string;
  device: string;
  location: Location;
  isCurrent: boolean;
  loggedInAt: Date;
  status: string;
}

export interface Location {
  city: string | null;
  country: string | null;
  countryRegion: string | null;
  region: string | null;
}
