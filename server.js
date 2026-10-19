const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. DEVICE STATE (Expo -> ESP)
// ==========================================
let deviceState = {
  motor: false,            // Starts OFF
  speed: 100,              // Ready speed
  rotateanglecheck: 0,
  distanse: false,
  clean: false,
  rotateangle: 0,
  go: false                // 👈 Replaced direction with go (Defaults to false)
};

// Expo updates the control state
app.post('/api/device-state', (req, res) => {
  const { motor, rotateanglecheck, distanse, clean, speed, rotateangle, go } = req.body;

  deviceState = {
    motor: typeof motor === 'boolean' ? motor : deviceState.motor,
    rotateanglecheck: typeof rotateanglecheck === 'number' ? rotateanglecheck : deviceState.rotateanglecheck,
    distanse: typeof distanse === 'boolean' ? distanse : deviceState.distanse,
    clean: typeof clean === 'boolean' ? clean : deviceState.clean,
    speed: typeof speed === 'number' ? speed : deviceState.speed,
    rotateangle: typeof rotateangle === 'number' ? rotateangle : deviceState.rotateangle,
    go: typeof go === 'boolean' ? go : deviceState.go, // 👈 Validated as boolean
  };

  console.log('🔄 State updated by Expo:', deviceState);
  res.status(200).json({ message: "State updated successfully", currentState: deviceState });
});

// ESP reads the control state
app.get('/api/device-state', (req, res) => {
  res.status(200).json(deviceState);
});


// ==========================================
// 2. DEVICE MEASURES (ESP -> Expo)
// ==========================================
let deviceMeasures = {
  AX: 0.0, AY: 0.0, AZ: 0.0, DX: 0.0, DY: 0.0, DZ: 0.0, Light: 0.0, robot: 0.0, DLF: 0.0, DRF: 0.0, DLB: 0.0, DRB: 0.0
};

app.post('/api/device-measures', (req, res) => {
  const incoming = req.body;
  deviceMeasures = {
    AX: typeof incoming.AX === 'number' ? incoming.AX : deviceMeasures.AX,
    AY: typeof incoming.AY === 'number' ? incoming.AY : deviceMeasures.AY,
    AZ: typeof incoming.AZ === 'number' ? incoming.AZ : deviceMeasures.AZ,
    DX: typeof incoming.DX === 'number' ? incoming.DX : deviceMeasures.DX,
    DY: typeof incoming.DY === 'number' ? incoming.DY : deviceMeasures.DY,
    DZ: typeof incoming.DZ === 'number' ? incoming.DZ : deviceMeasures.DZ,
    Light: typeof incoming.Light === 'number' ? incoming.Light : deviceMeasures.Light,
    robot: typeof incoming.robot === 'number' ? incoming.robot : deviceMeasures.robot,
    DLF: typeof incoming.DLF === 'number' ? incoming.DLF : deviceMeasures.DLF,
    DRF: typeof incoming.DRF === 'number' ? incoming.DRF : deviceMeasures.DRF,
    DLB: typeof incoming.DLB === 'number' ? incoming.DLB : deviceMeasures.DLB,
    DRB: typeof incoming.DRB === 'number' ? incoming.DRB : deviceMeasures.DRB,
  };
  res.status(200).json({ message: "Measures updated successfully", currentMeasures: deviceMeasures });
});

app.get('/api/device-measures', (req, res) => {
  res.status(200).json(deviceMeasures);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});