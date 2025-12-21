export interface GetSessions {
  currentSessionId: string;
  sessions: Session[];
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
  city: string;
  country: string;
  countryRegion: string;
  region: string;
}
