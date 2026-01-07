
export enum ChannelType {
  WEBSITE = 'website',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  SMS = 'sms'
}

export enum UserRole {
  BUSINESS_OWNER = 'business_owner',
  CUSTOMER = 'customer'
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface BusinessConfig {
  name: string;
  offering: string;
  audience: string;
  primaryGoal: string;
  channels: ChannelType[];
}

export interface AgentState {
  isConfigured: boolean;
  config: BusinessConfig;
  messages: Message[];
  currentChannel: ChannelType;
  currentUserRole: UserRole;
}
