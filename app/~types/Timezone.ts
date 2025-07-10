export type TimeZoneCode = 'GMT' | 'EST' | 'PST' | 'CET';

export type TimeZone = {
  name: string;
  iana: string;
  format: string;
  usesDst: boolean;
};

export const timeZones: Record<TimeZoneCode, TimeZone> = {
  GMT: {
    name: 'Greenwich Mean Time',
    iana: 'Etc/GMT',
    format: 'HH:mm z',
    usesDst: false,
  },
  EST: {
    name: 'Eastern Time (US & Canada)',
    iana: 'America/New_York',
    format: 'h:mm a z',
    usesDst: true,
  },
  PST: {
    name: 'Pacific Time (US & Canada)',
    iana: 'America/Los_Angeles',
    format: 'h:mm a z',
    usesDst: true,
  },
  CET: {
    name: 'Central European Time',
    iana: 'Europe/Berlin',
    format: 'HH:mm z',
    usesDst: true,
  },
};
