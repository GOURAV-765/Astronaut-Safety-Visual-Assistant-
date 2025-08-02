import React from 'react';
import { Detection } from '../types/detection';

interface DetectionOverlayProps {
  detections: Detection[];
}

const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ detections }) => {
  const getClassColor = (className: string) => {
    switch (className) {
      case 'fire_extinguisher':
        return 'border-red-500 bg-red-500';
      case 'oxygen_tank':
        return 'border-green-500 bg-green-500';
      case 'toolbox':
        return 'border-yellow-500 bg-yellow-500';
      default:
        return 'border-white bg-white';
    }
  };

  const getClassLabel = (className: string) => {
    switch (className) {
      case 'fire_extinguisher':
        return 'Fire Extinguisher';
      case 'oxygen_tank':
        return 'Oxygen Tank';
      case 'toolbox':
        return 'Toolbox';
      default:
        return className;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {detections.map((detection) => {
        const colorClass = getClassColor(detection.class);
        const label = getClassLabel(detection.class);
        
        return (
          <div
            key={detection.id}
            className={`absolute border-4 ${colorClass.split(' ')[0]} transition-all duration-300 detection-appear shadow-lg`}
            style={{
              left: `${(detection.bbox.x / 640) * 100}%`,
              top: `${(detection.bbox.y / 480) * 100}%`,
              width: `${(detection.bbox.width / 640) * 100}%`,
              height: `${(detection.bbox.height / 480) * 100}%`,
            }}
          >
            {/* Label */}
            <div
              className={`absolute -top-10 left-0 px-4 py-2 text-sm font-black text-black rounded-lg ${colorClass.split(' ')[1]} ${colorClass.split(' ')[0]} shadow-lg text-high-contrast`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {label.toUpperCase()} ({(detection.confidence * 100).toFixed(1)}%)
            </div>
            
            {/* Corner indicators */}
            <div className={`absolute -top-2 -left-2 w-6 h-6 ${colorClass.split(' ')[1]} rounded-full shadow-lg`}></div>
            <div className={`absolute -top-2 -right-2 w-6 h-6 ${colorClass.split(' ')[1]} rounded-full shadow-lg`}></div>
            <div className={`absolute -bottom-2 -left-2 w-6 h-6 ${colorClass.split(' ')[1]} rounded-full shadow-lg`}></div>
            <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${colorClass.split(' ')[1]} rounded-full shadow-lg`}></div>
            
            {/* Center dot */}
            <div className={`absolute top-1/2 left-1/2 w-4 h-4 ${colorClass.split(' ')[1]} rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-lg`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default DetectionOverlay;