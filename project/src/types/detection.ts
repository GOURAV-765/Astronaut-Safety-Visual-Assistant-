export interface Detection {
  id: string;
  class: 'fire_extinguisher' | 'oxygen_tank' | 'toolbox';
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  location: string;
}

export type EmergencyScenario = 'normal' | 'fire' | 'leak' | 'oxygen';

export interface EmergencyAlert {
  type: 'missing' | 'low_confidence' | 'critical';
  message: string;
  tool: string;
  timestamp: number;
}