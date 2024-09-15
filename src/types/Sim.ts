export interface SimAttribute {
  [key: string]: string | number | SimAttribute | Profile | SessionStatus;
}

export interface Subscriber {
  imsi: string;
  msisdn: string;
  status: string;
  subscription: string;
  capabilities: {
    data: boolean;
    sms: boolean;
    voice: boolean;
  };
}

export interface Profile {
  iccid: string;
  otaSupported: boolean;
  primaryImsi: string;
  subscribers: {
    [imsi: string]: Subscriber;
  };
}

export interface SessionStatusAttribute {
  [key: string]: string | number | boolean;
}

export interface SessionStatus extends SessionStatusAttribute {
  online: boolean;
  ueIpAddress: string;
  subscription: string;
}

export interface Sim extends SimAttribute {
  simId: string;
  primaryImsi: string;
  status: string;
  profiles: {
    [iccid: string]: Profile;
  };
  speedClass: string;
  tags: {
    name: string;
    [key: string]: string;
  };
  type: string;
  sessionStatus: SessionStatus;
}
