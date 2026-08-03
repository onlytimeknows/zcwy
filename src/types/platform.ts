export type CapabilityIcon = 'shield' | 'chain' | 'settlement';

export interface PlatformCapability {
  id: string;
  title: string;
  description: string;
  icon: CapabilityIcon;
}
