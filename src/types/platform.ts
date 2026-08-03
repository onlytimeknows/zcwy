export type CapabilityIcon = 'shield' | 'chain' | 'settlement';

export type JourneyTone = 'blue' | 'purple' | 'yellow';

export type ModuleIcon = 'play' | 'student' | 'enterprise' | 'help';

export type ModuleTone = 'dark' | 'blue' | 'yellow' | 'purple';

export type TrustNodeId = 'university' | 'platform' | 'regulator' | 'notary';

export interface NetworkPosition {
  x: number;
  y: number;
}

export interface PlatformCapability {
  id: string;
  title: string;
  description: string;
  icon: CapabilityIcon;
}

export interface JourneyPhase extends PlatformCapability {
  stage: string;
  eyebrow: string;
  evidence: string[];
  tone: JourneyTone;
  checkpoint: NetworkPosition;
}

export interface HomeModule {
  id: string;
  path: string;
  label: string;
  title: string;
  description: string;
  icon: ModuleIcon;
  tone: ModuleTone;
  action: string;
}

export interface TrustNetworkNode {
  id: TrustNodeId;
  label: string;
  status: string;
  responsibility: string;
  position: NetworkPosition;
  activePhases: string[];
}

export interface TrustNetworkConnection {
  id: string;
  path: string;
  activePhases: string[];
}
