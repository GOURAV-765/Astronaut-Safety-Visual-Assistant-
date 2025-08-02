import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Detection, EmergencyScenario } from '../types/detection';

interface EmergencyAlertsProps {
  detections: Detection[];
  scenario: EmergencyScenario;
  audioEnabled: boolean;
}

const EmergencyAlerts: React.FC<EmergencyAlertsProps> = ({ 
  detections, 
  scenario, 
  audioEnabled 
}) => {
  const [alerts, setAlerts] = useState<Array<{
    type: 'critical' | 'warning' | 'info';
    message: string;
    tool: string;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    const detectedClasses = detections.map(d => d.class);
    const requiredTools = ['fire_extinguisher', 'oxygen_tank', 'toolbox'];
    const missingTools = requiredTools.filter(tool => !detectedClasses.includes(tool));
    const lowConfidenceTools = detections.filter(d => d.confidence < 0.8);

    const newAlerts = [];

    // Critical missing tools based on scenario
    if (scenario === 'fire' && !detectedClasses.includes('fire_extinguisher')) {
      newAlerts.push({
        type: 'critical' as const,
        message: 'CRITICAL: Fire extinguisher not detected! Immediate location required.',
        tool: 'fire_extinguisher',
        timestamp: Date.now()
      });
    }

    if (scenario === 'oxygen' && !detectedClasses.includes('oxygen_tank')) {
      newAlerts.push({
        type: 'critical' as const,
        message: 'CRITICAL: Oxygen tank missing! Life support emergency.',
        tool: 'oxygen_tank',
        timestamp: Date.now()
      });
    }

    // Warning for other missing tools
    missingTools.forEach(tool => {
      if ((scenario === 'fire' && tool === 'fire_extinguisher') || 
          (scenario === 'oxygen' && tool === 'oxygen_tank')) {
        return; // Already handled as critical
      }

      newAlerts.push({
        type: 'warning' as const,
        message: `WARNING: ${tool.replace('_', ' ')} not detected.`,
        tool,
        timestamp: Date.now()
      });
    });

    // Info for low confidence detections
    lowConfidenceTools.forEach(detection => {
      newAlerts.push({
        type: 'info' as const,
        message: `INFO: ${detection.class.replace('_', ' ')} detected with low confidence (${(detection.confidence * 100).toFixed(1)}%). May be partially occluded.`,
        tool: detection.class,
        timestamp: Date.now()
      });
    });

    setAlerts(newAlerts.slice(0, 3)); // Keep only latest 3 alerts
  }, [detections, scenario]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Info className="w-8 h-8 text-green-500" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-900 border-4 border-red-500 text-white shadow-lg shadow-red-500/50';
      case 'warning':
        return 'bg-yellow-900 border-4 border-yellow-500 text-white shadow-lg shadow-yellow-500/50';
      default:
        return 'bg-green-900 border-4 border-green-500 text-white shadow-lg shadow-green-500/50';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="mt-8 p-6 bg-green-900 border-4 border-green-500 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-white font-black text-xl text-high-contrast">ALL EMERGENCY TOOLS DETECTED</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {alerts.map((alert, index) => (
        <div
          key={`${alert.tool}-${alert.timestamp}-${index}`}
          className={`p-6 rounded-xl ${getAlertStyle(alert.type)} ${
            alert.type === 'critical' ? 'critical-blink' : alert.type === 'warning' ? 'warning-pulse' : ''
          }`}
        >
          <div className="flex items-start space-x-4">
            {getAlertIcon(alert.type)}
            <div className="flex-1">
              <p className="font-black text-lg text-high-contrast">{alert.message.toUpperCase()}</p>
              {detections.find(d => d.class === alert.tool) && (
                <p className="text-base font-bold opacity-90 mt-2 text-high-contrast">
                  LAST SEEN: {detections.find(d => d.class === alert.tool)?.location?.toUpperCase()}
                </p>
              )}
            </div>
            {alert.type === 'critical' && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-500 rounded-full animate-ping shadow-lg"></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmergencyAlerts;