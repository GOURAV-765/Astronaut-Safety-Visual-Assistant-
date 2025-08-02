import React from 'react';
import { Settings, Sliders, Activity, Database } from 'lucide-react';
import { Detection, EmergencyScenario } from '../types/detection';

interface ControlPanelProps {
  scenario: EmergencyScenario;
  onScenarioChange: (scenario: EmergencyScenario) => void;
  confidence: number;
  onConfidenceChange: (confidence: number) => void;
  detections: Detection[];
  isRecording: boolean;
  audioEnabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  scenario,
  onScenarioChange,
  confidence,
  onConfidenceChange,
  detections,
  isRecording,
  audioEnabled
}) => {
  const scenarios = [
    { id: 'normal' as const, label: 'Normal Operations', description: 'All tools present' },
    { id: 'fire' as const, label: 'Fire Emergency', description: 'Fire extinguisher missing' },
    { id: 'leak' as const, label: 'Atmosphere Leak', description: 'Tools partially occluded' },
    { id: 'oxygen' as const, label: 'Oxygen Emergency', description: 'Oxygen tank missing' }
  ];

  const getScenarioColor = (id: EmergencyScenario) => {
    switch (id) {
      case 'fire':
        return 'text-red-500 border-red-500 bg-red-900';
      case 'oxygen':
        return 'text-yellow-500 border-yellow-500 bg-yellow-900';
      case 'leak':
        return 'text-blue-500 border-blue-500 bg-blue-900';
      default:
        return 'text-green-500 border-green-500 bg-green-900';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-900">
      <div className="space-y-8">
        {/* Scenario Control */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-2 bg-green-500 rounded-lg">
              <Settings className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-black text-white text-high-contrast">EMERGENCY SCENARIOS</h3>
          </div>
          
          <div className="space-y-4">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => onScenarioChange(s.id)}
                className={`w-full p-4 text-left rounded-xl border-4 transition-all duration-200 transform hover:scale-105 ${
                  scenario === s.id
                    ? `${getScenarioColor(s.id)} shadow-lg`
                    : 'border-gray-600 text-white hover:border-gray-500 bg-gray-800'
                }`}
              >
                <div className="font-black text-lg text-high-contrast">{s.label.toUpperCase()}</div>
                <div className="text-base font-bold opacity-90 mt-1 text-high-contrast">{s.description.toUpperCase()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Detection Settings */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-2 bg-green-500 rounded-lg">
              <Sliders className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-black text-white text-high-contrast">DETECTION SETTINGS</h3>
          </div>
          
          <div>
            <label className="block text-lg font-black mb-4 text-white text-high-contrast">
              CONFIDENCE THRESHOLD: {(confidence * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={confidence}
              onChange={(e) => onConfidenceChange(parseFloat(e.target.value))}
              className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer hover:bg-gray-600 transition-colors"
            />
            <div className="flex justify-between text-base font-bold text-gray-300 mt-2">
              <span>30%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Current Detections */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-2 bg-green-500 rounded-lg">
              <Activity className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-black text-white text-high-contrast">LIVE DETECTIONS</h3>
          </div>
          
          <div className="space-y-4">
            {detections.length === 0 ? (
              <p className="text-gray-400 text-lg font-bold text-high-contrast">NO OBJECTS DETECTED ABOVE THRESHOLD</p>
            ) : (
              detections.map((detection) => (
                <div
                  key={detection.id}
                  className="p-4 bg-gray-800 rounded-xl border-2 border-gray-600 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-lg text-white text-high-contrast">
                      {detection.class.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-base font-bold text-green-500 text-high-contrast">
                      {(detection.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-300 text-high-contrast">
                    LOCATION: {detection.location.toUpperCase()}
                  </div>
                  <div className="text-sm font-bold text-gray-300 text-high-contrast">
                    BBOX: {detection.bbox.x}, {detection.bbox.y}, 
                    {detection.bbox.width}×{detection.bbox.height}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Status */}
        <div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-2 bg-green-500 rounded-lg">
              <Database className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-black text-white text-high-contrast">SYSTEM STATUS</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white text-high-contrast">YOLOV8 MODEL</span>
              <span className="text-base font-black text-green-500 text-high-contrast">ACTIVE</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white text-high-contrast">CAMERA FEED</span>
              <span className="text-base font-black text-green-500 text-high-contrast">CONNECTED</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white text-high-contrast">AUDIO ALERTS</span>
              <span className={`text-base font-black text-high-contrast ${audioEnabled ? 'text-green-500' : 'text-red-500'}`}>
                {audioEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white text-high-contrast">RECORDING</span>
              <span className={`text-base font-black text-high-contrast ${isRecording ? 'text-red-500' : 'text-gray-400'}`}>
                {isRecording ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="font-black text-xl mb-4 text-white text-high-contrast">PERFORMANCE METRICS</h4>
          <div className="text-base font-bold text-gray-300 space-y-2 text-high-contrast">
            <div>FPS: 30</div>
            <div>INFERENCE TIME: 45ms</div>
            <div>mAP@0.5: 0.847</div>
            <div>OBJECTS/FRAME: {detections.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;