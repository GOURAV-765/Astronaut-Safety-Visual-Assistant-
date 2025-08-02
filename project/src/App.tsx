import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, Volume2, VolumeX, Circle, Square, Zap } from 'lucide-react';
import CameraFeed from './components/CameraFeed';
import DetectionOverlay from './components/DetectionOverlay';
import EmergencyAlerts from './components/EmergencyAlerts';
import ControlPanel from './components/ControlPanel';
import { Detection, EmergencyScenario } from './types/detection';

function App() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [currentScenario, setCurrentScenario] = useState<EmergencyScenario>('normal');
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [confidence, setConfidence] = useState(0.7);
  const [lastAlert, setLastAlert] = useState<string | null>(null);
  const [isCriticalAlert, setIsCriticalAlert] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Haptic feedback function
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [200]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Sound feedback function
  const playSound = (type: 'click' | 'alert' | 'success') => {
    if (!audioEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const frequencies = {
      click: 800,
      alert: 440,
      success: 660
    };
    
    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };
  // Simulate YOLOv8 detection results
  useEffect(() => {
    const generateDetections = () => {
      const mockDetections: Detection[] = [];
      
      // Generate detections based on current scenario
      switch (currentScenario) {
        case 'fire':
          // Fire scenario - missing fire extinguisher
          mockDetections.push(
            {
              id: 'oxygen_1',
              class: 'oxygen_tank',
              confidence: 0.92,
              bbox: { x: 120, y: 180, width: 80, height: 120 },
              location: 'left side'
            },
            {
              id: 'toolbox_1',
              class: 'toolbox',
              confidence: 0.88,
              bbox: { x: 450, y: 250, width: 100, height: 60 },
              location: 'right side'
            }
          );
          break;
          
        case 'leak':
          // Leak scenario - all tools present but toolbox partially occluded
          mockDetections.push(
            {
              id: 'fire_ext_1',
              class: 'fire_extinguisher',
              confidence: 0.85,
              bbox: { x: 200, y: 150, width: 60, height: 140 },
              location: 'center left'
            },
            {
              id: 'oxygen_1',
              class: 'oxygen_tank',
              confidence: 0.94,
              bbox: { x: 350, y: 120, width: 90, height: 130 },
              location: 'center right'
            },
            {
              id: 'toolbox_1',
              class: 'toolbox',
              confidence: 0.65, // Lower confidence due to occlusion
              bbox: { x: 500, y: 280, width: 80, height: 50 },
              location: 'far right'
            }
          );
          break;
          
        case 'oxygen':
          // Oxygen scenario - missing oxygen tank
          mockDetections.push(
            {
              id: 'fire_ext_1',
              class: 'fire_extinguisher',
              confidence: 0.91,
              bbox: { x: 180, y: 160, width: 65, height: 135 },
              location: 'left side'
            },
            {
              id: 'toolbox_1',
              class: 'toolbox',
              confidence: 0.87,
              bbox: { x: 420, y: 240, width: 95, height: 65 },
              location: 'right side'
            }
          );
          break;
          
        default:
          // Normal scenario - all tools present
          mockDetections.push(
            {
              id: 'fire_ext_1',
              class: 'fire_extinguisher',
              confidence: 0.89,
              bbox: { x: 150, y: 140, width: 70, height: 150 },
              location: 'left side'
            },
            {
              id: 'oxygen_1',
              class: 'oxygen_tank',
              confidence: 0.93,
              bbox: { x: 320, y: 110, width: 85, height: 140 },
              location: 'center'
            },
            {
              id: 'toolbox_1',
              class: 'toolbox',
              confidence: 0.86,
              bbox: { x: 480, y: 260, width: 90, height: 70 },
              location: 'right side'
            }
          );
      }
      
      // Filter by confidence threshold
      const filteredDetections = mockDetections.filter(d => d.confidence >= confidence);
      setDetections(filteredDetections);
    };

    // Generate new detections every 2 seconds to simulate real-time updates
    intervalRef.current = setInterval(generateDetections, 2000);
    generateDetections(); // Initial generation

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentScenario, confidence]);

  // Handle emergency alerts and voice guidance
  useEffect(() => {
    const checkForMissingTools = () => {
      const detectedClasses = detections.map(d => d.class);
      const requiredTools = ['fire_extinguisher', 'oxygen_tank', 'toolbox'];
      const missingTools = requiredTools.filter(tool => !detectedClasses.includes(tool));
      
      // Check for critical scenarios
      const isCritical = (currentScenario === 'fire' && !detectedClasses.includes('fire_extinguisher')) ||
                        (currentScenario === 'oxygen' && !detectedClasses.includes('oxygen_tank'));
      
      setIsCriticalAlert(isCritical);
      
      if (missingTools.length > 0 && audioEnabled) {
        const missingTool = missingTools[0];
        let alertMessage = '';
        
        switch (missingTool) {
          case 'fire_extinguisher':
            alertMessage = 'Warning: Fire extinguisher not detected. Please locate immediately.';
            if (currentScenario === 'fire') {
              triggerHapticFeedback('heavy');
              playSound('alert');
            }
            break;
          case 'oxygen_tank':
            alertMessage = 'Alert: Oxygen tank not found. Critical for life support.';
            if (currentScenario === 'oxygen') {
              triggerHapticFeedback('heavy');
              playSound('alert');
            }
            break;
          case 'toolbox':
            alertMessage = 'Notice: Toolbox missing. May be needed for repairs.';
            break;
        }
        
        if (alertMessage !== lastAlert) {
          setLastAlert(alertMessage);
          
          // Cancel previous speech
          if (speechRef.current) {
            speechSynthesis.cancel();
          }
          
          // Create new speech utterance
          speechRef.current = new SpeechSynthesisUtterance(alertMessage);
          speechRef.current.rate = 1.2;
          speechRef.current.pitch = 1.1;
          speechSynthesis.speak(speechRef.current);
        }
      } else if (missingTools.length === 0) {
        setLastAlert(null);
        setIsCriticalAlert(false);
      }
    };

    checkForMissingTools();
  }, [detections, audioEnabled, lastAlert, currentScenario]);

  const toggleRecording = () => {
    triggerHapticFeedback('medium');
    playSound('click');
    setIsRecording(!isRecording);
    if (audioEnabled) {
      const message = isRecording ? 'Recording stopped' : 'Recording started';
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const toggleAudio = () => {
    triggerHapticFeedback('light');
    playSound('click');
    setAudioEnabled(!audioEnabled);
    if (!audioEnabled) {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className={`min-h-screen bg-black text-white smooth-transition ${isCriticalAlert ? 'critical-blink' : ''}`}>
      {/* Header */}
      <header className="bg-gray-900 border-b-2 border-green-500 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Camera className="w-10 h-10 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-high-contrast tracking-tight">EMERGENCY TOOL DETECTION</h1>
              <p className="text-green-400 text-lg font-bold">YOLOv8 REAL-TIME ASSISTANT</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-xl text-black font-bold text-lg transition-all duration-200 transform hover:scale-110 ${
                audioEnabled 
                  ? 'bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/50' 
                  : 'bg-red-500 hover:bg-red-400 shadow-lg shadow-red-500/50'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
            </button>
            
            <button
              onClick={toggleRecording}
              className={`p-4 rounded-xl text-white font-bold text-lg transition-all duration-200 transform hover:scale-110 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-400 animate-pulse shadow-lg shadow-red-500/50' 
                  : 'bg-gray-600 hover:bg-gray-500 shadow-lg'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main Camera Feed */}
        <main className="flex-1 p-8">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
            <CameraFeed />
            <DetectionOverlay detections={detections} />
            
            {/* Status Overlay */}
            <div className="absolute top-6 left-6 bg-black bg-opacity-90 rounded-xl p-4 border border-green-500">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-black text-green-400 text-high-contrast">LIVE DETECTION</span>
              </div>
              <div className="text-sm font-bold text-white text-high-contrast">
                OBJECTS: {detections.length} | CONFIDENCE: ≥{(confidence * 100).toFixed(0)}%
              </div>
              {isRecording && (
                <div className="flex items-center space-x-2 mt-2">
                  <Circle className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-sm font-black text-red-500 text-high-contrast">RECORDING</span>
                </div>
              )}
            </div>
            
            {/* Critical Alert Overlay */}
            {isCriticalAlert && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 bg-opacity-20 border-4 border-red-500 rounded-2xl p-8 critical-blink">
                  <div className="flex items-center justify-center space-x-4">
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                    <div className="text-center">
                      <h2 className="text-4xl font-black text-red-500 text-high-contrast">CRITICAL ALERT</h2>
                      <p className="text-xl font-bold text-white text-high-contrast mt-2">EMERGENCY TOOL MISSING</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Emergency Alerts */}
          <EmergencyAlerts 
            detections={detections} 
            scenario={currentScenario}
            audioEnabled={audioEnabled}
          />
        </main>

        {/* Control Panel */}
        <aside className="w-96 bg-gray-900 border-l-2 border-green-500">
          <ControlPanel
            scenario={currentScenario}
            onScenarioChange={(scenario) => {
              triggerHapticFeedback('medium');
              playSound('click');
              setCurrentScenario(scenario);
            }}
            confidence={confidence}
            onConfidenceChange={(conf) => {
              triggerHapticFeedback('light');
              setConfidence(conf);
            }}
            detections={detections}
            isRecording={isRecording}
            audioEnabled={audioEnabled}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;