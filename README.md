🛰 AstroAssist – Astronaut Safety Visual Assistant


🚀 Project Overview
AstroAssist is a real-time visual assistant designed for spacecraft environments. Using YOLOv8 trained on Duality AI’s Falcon synthetic dataset, AstroAssist detects critical emergency tools—fire extinguisher, oxygen tank, and toolbox—and overlays bounding boxes on a camera feed. The application also provides visual alerts and voice prompts to help astronauts locate essential equipment swiftly in crisis situations.

🧠 Hackathon Alignment
Falcon Synthetic Dataset: Model trained exclusively using Falcon-generated images of the station under varying lighting, occlusion, and layout conditions.

Required Object Classes: Includes all three target objects—the toolbox, oxygen tank, and fire extinguisher—as per challenge rules 
codeclash.in
+1
duality.ai
+1
.

<img width="1898" height="755" alt="Screenshot 2025-08-02 174344" src="https://github.com/user-attachments/assets/2ddf5418-2f5d-4234-bac4-9b43427f95e5" />















Model Training: Utilizes YOLOv8 for real-time inference optimization.

Bonus Features: Includes live detection app and a Falcon-based update mechanism for retraining the model.

📦 Repository Structure
bash
Copy
Edit
/
├── data/
│   ├── train/val/test images and labels
│   ├── data.yaml         # Contains Falcon dataset class paths
├── model/
│   ├── best.pt           # Trained YOLOv8 weights
│   └── config files
├── scripts/
│   ├── train.py          # Model training pipeline
│   ├── detect_live.py    # Real-time camera detection
│   └── eval_metrics.py   # Computes mAP, confusion matrix
├── app/
│   ├── frontend/         # Streamlit or React frontend
│   └── backend/          # Flask server, inference endpoints
├── README.md             # This file
└── report.pdf            # Final hackathon report & visuals
⚙️ Setup & Reproduction
Environment
Python 3.9+

Install dependencies:

bash
Copy
Edit
pip install ultralytics streamlit opencv-python pyttsx3
Training the YOLOv8 Model
bash
Copy
Edit
python scripts/train.py --data data/data.yaml --epochs 50 --imgsz 640
Real-Time Detection with Overlays
bash
Copy
Edit
python scripts/detect_live.py --weights model/best.pt
Launching the App
bash
Copy
Edit
cd app
streamlit run frontend/app.py
Or via Flask backend:

bash
Copy
Edit
python backend/server.py
📈 Performance & Evaluation
mAP@0.5: Example: 85% (target benchmark)

Inference FPS: 25+ fps on CPU using YOLOv8n

Confusion Matrix: Detailed breakdown of precision and recall per class

Failure Cases: Highlighted scenarios including occluded tools or incorrect detection

🎤 Bonus: Falcon-Based Retraining
Leverage Falcon's synthetic simulator to generate additional data for retraining:

Simulate scenarios with obscured, displaced, or rotated tools.

Include diverse lighting and background configurations.

Automatically retrain with new .yaml to improve detection robustness.

Workflow:
Falcon → New Synthetic Images → Augmented train/val split → Retrain → Evaluate

🪐 Features Highlight
Live Camera Input with YOLOv8 overlays

Visual Alerts: Screen flashes when tools are missing

Voice Prompt: Clearly conveys object location (e.g. “Extinguisher to your right”)

Minimal UI: Optimized for use in low-light, high-g settings

Logging: Records events for post-analysis in .csv or log files

🧭 Future Enhancements
Add Augmented Reality navigation (e.g., arrows pointing to objects)

Integrate voice control: “Find oxygen tank”

Support multi-camera fusion for better object tracking in 3D space

Provide emergency alert integration with station systems (e.g., alarm triggers)





📞 Contact & References
GitHub: github.com/GOURAV-765/Astronaut-Safety-Visual-Assistant



For questions, reach out at: [email/contact info]

