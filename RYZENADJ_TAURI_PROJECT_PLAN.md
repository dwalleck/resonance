# RyzenAdj Tauri UI Project Plan

## Overview

This document outlines the plan to create a modern, cross-platform GUI for
RyzenAdj using Rust/Tauri and React, leveraging components and patterns from the
Claudia project.

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Tailwind CSS + shadcn/ui components (from Claudia)
- **Backend**: Rust with Tauri
- **State Management**: Zustand
- **Charts**: Recharts (for power/temperature monitoring)
- **Build Tools**: Vite + Bun/npm

## Project Structure

```
resonance/
├── src/                           # React frontend
│   ├── components/
│   │   ├── ui/                   # Copy from Claudia
│   │   ├── PowerDashboard.tsx    # Main monitoring dashboard
│   │   ├── PowerControls.tsx     # Sliders and inputs
│   │   ├── ProfileManager.tsx    # Save/load profiles
│   │   ├── SystemInfo.tsx        # CPU info display
│   │   └── Settings.tsx          # App settings
│   ├── lib/
│   │   ├── api.ts               # Tauri command invocations
│   │   ├── utils.ts             # Copy from Claudia
│   │   └── types.ts             # TypeScript types
│   ├── stores/
│   │   └── powerStore.ts        # Zustand store for metrics
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css               # Tailwind CSS
├── src-tauri/
│   ├── src/
│   │   ├── commands/
│   │   │   ├── mod.rs
│   │   │   ├── power.rs         # Power management commands
│   │   │   └── system.rs        # System info commands
│   │   ├── ryzenadj/
│   │   │   ├── mod.rs          # FFI bindings to RyzenAdj
│   │   │   ├── types.rs        # Rust types
│   │   │   └── safety.rs       # Safe wrappers
│   │   ├── lib.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── package.json
└── README.md
```

## Implementation Steps

### Phase 1: Project Setup (Week 1)

1. **Initialize Tauri Project**

   ```bash
   npm create tauri-app@latest resonance -- --template react-ts
   cd resonance
   ```

2. **Copy UI Components from Claudia**
   - Copy entire `src/components/ui/` directory
   - Copy `src/lib/utils.ts`
   - Copy Tailwind configuration
   - Copy relevant styles

3. **Set Up Dependencies**

   ```json
   {
     "dependencies": {
       "@radix-ui/react-*": "latest",
       "class-variance-authority": "^0.7.1",
       "clsx": "^2.1.1",
       "lucide-react": "latest",
       "react": "^18.3.1",
       "recharts": "^2.14.1",
       "tailwind-merge": "^2.6.0",
       "tailwindcss": "^3.4.0",
       "zustand": "^5.0.6"
     }
   }
   ```

### Phase 2: Rust FFI Integration (Week 1-2)

1. **Create RyzenAdj Bindings**

   ```rust
   // src-tauri/src/ryzenadj/mod.rs
   use std::ffi::c_void;
   use std::sync::Mutex;

   #[link(name = "ryzenadj")]
   extern "C" {
       fn init_ryzenadj() -> *mut c_void;
       fn cleanup_ryzenadj(ry: *mut c_void);
       fn get_stapm_limit(ry: *mut c_void) -> f32;
       fn set_stapm_limit(ry: *mut c_void, value: u32) -> i32;
       // ... other functions
   }

   pub struct RyzenAdj {
       handle: *mut c_void,
   }

   unsafe impl Send for RyzenAdj {}
   unsafe impl Sync for RyzenAdj {}
   ```

2. **Create Safe Wrappers**

   ```rust
   impl RyzenAdj {
       pub fn new() -> Result<Self, String> {
           let handle = unsafe { init_ryzenadj() };
           if handle.is_null() {
               Err("Failed to initialize RyzenAdj".into())
           } else {
               Ok(Self { handle })
           }
       }

       pub fn get_metrics(&self) -> PowerMetrics {
           unsafe {
               PowerMetrics {
                   stapm_limit: get_stapm_limit(self.handle),
                   stapm_value: get_stapm_value(self.handle),
                   fast_limit: get_fast_limit(self.handle),
                   // ... more metrics
               }
           }
       }
   }
   ```

3. **Build Native Library**
   - Clone RyzenAdj as git submodule
   - Add build script to compile libryzenadj
   - Link in Cargo.toml

### Phase 3: Core UI Components (Week 2)

1. **Power Dashboard Component**

   ```tsx
   // src/components/PowerDashboard.tsx
   import { Card } from '@/components/ui/card';
   import { usePowerStore } from '@/stores/powerStore';
   import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

   export function PowerDashboard() {
     const { metrics, history } = usePowerStore();

     return (
       <div className="grid grid-cols-2 gap-4">
         <Card className="p-6">
           <h3 className="text-lg font-semibold mb-4">Power Usage</h3>
           <LineChart width={400} height={200} data={history}>
             <XAxis dataKey="time" />
             <YAxis />
             <Tooltip />
             <Line type="monotone" dataKey="power" stroke="#8884d8" />
           </LineChart>
         </Card>

         <Card className="p-6">
           <h3 className="text-lg font-semibold mb-4">Temperature</h3>
           <div className="text-3xl font-bold">
             {metrics.tctl_temp.toFixed(1)}°C
           </div>
         </Card>
       </div>
     );
   }
   ```

2. **Power Controls**

   ```tsx
   // src/components/PowerControls.tsx
   import { Button } from '@/components/ui/button';
   import { Label } from '@/components/ui/label';
   import { Slider } from '@/components/ui/slider';

   export function PowerControls() {
     const [stapmLimit, setStapmLimit] = useState(25000);

     const handleApply = async () => {
       await invoke('set_power_limits', {
         stapmLimit,
         fastLimit: stapmLimit,
         slowLimit: stapmLimit,
       });
     };

     return (
       <Card className="p-6">
         <h3 className="text-lg font-semibold mb-4">Power Limits</h3>

         <div className="space-y-4">
           <div>
             <Label>STAPM Limit: {stapmLimit / 1000}W</Label>
             <Slider
               min={5000}
               max={54000}
               step={1000}
               value={[stapmLimit]}
               onValueChange={([v]) => setStapmLimit(v)}
             />
           </div>

           <Button onClick={handleApply}>Apply Settings</Button>
         </div>
       </Card>
     );
   }
   ```

### Phase 4: State Management (Week 2-3)

1. **Create Zustand Store**

   ```typescript
   // src/stores/powerStore.ts
   import { invoke } from '@tauri-apps/api/core';
   import { create } from 'zustand';

   interface PowerStore {
     metrics: PowerMetrics;
     history: PowerMetrics[];
     isMonitoring: boolean;

     startMonitoring: () => void;
     stopMonitoring: () => void;
     updateMetrics: () => Promise<void>;
   }

   export const usePowerStore = create<PowerStore>((set, get) => ({
     metrics: getDefaultMetrics(),
     history: [],
     isMonitoring: false,

     updateMetrics: async () => {
       const metrics = await invoke<PowerMetrics>('get_power_metrics');
       set(state => ({
         metrics,
         history: [...state.history.slice(-59), metrics].slice(-60),
       }));
     },

     startMonitoring: () => {
       set({ isMonitoring: true });
       const interval = setInterval(() => {
         get().updateMetrics();
       }, 1000);
       // Store interval ID for cleanup
     },
   }));
   ```

### Phase 5: Profile Management (Week 3)

1. **Profile System**
   - Save/load power profiles
   - Quick presets (Balanced, Performance, Battery Saver)
   - Import/export profiles

2. **Persistence**
   - Use Tauri's app data directory
   - Store profiles as JSON

### Phase 6: Platform-Specific Features (Week 3-4)

1. **Privilege Elevation**

   ```rust
   // Handle admin/root requirements
   #[cfg(target_os = "windows")]
   fn check_admin() -> bool {
       // Windows admin check
   }

   #[cfg(target_os = "linux")]
   fn check_root() -> bool {
       // Linux root check
   }
   ```

2. **System Tray Integration**
   - Quick profile switching
   - Current metrics display

### Phase 7: Testing & Polish (Week 4)

1. **Error Handling**
   - Graceful failures
   - User-friendly error messages
   - Fallback states

2. **Performance Optimization**
   - Efficient metric polling
   - Debounced updates
   - Memory management

3. **UI Polish**
   - Animations
   - Dark/light mode
   - Responsive design

## Key Features to Implement

### Must Have (MVP)

- [x] Real-time power/temperature monitoring
- [x] Adjust power limits (STAPM, PPT Fast/Slow)
- [x] Temperature limit control
- [x] Basic profiles (Balanced, Performance, Battery)
- [x] System information display
- [x] Cross-platform support (Windows/Linux)

### Nice to Have

- [ ] Advanced frequency controls
- [ ] Per-core metrics
- [ ] Custom profile creation
- [ ] Auto-profile switching based on AC/battery
- [ ] Command-line interface
- [ ] System tray integration
- [ ] Export metrics to CSV
- [ ] Multi-language support

## Development Commands

```bash
# Install dependencies
bun install

# Run in development
bun run tauri dev

# Build for production
bun run tauri build

# Build native library
cd src-tauri
cargo build --release
```

## Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [RyzenAdj Repository](https://github.com/FlyGoat/RyzenAdj)
- [Claudia UI Components Reference](../claudia/src/components/ui/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## Notes

- Ensure proper error handling for privilege elevation
- Test on various AMD Ryzen mobile CPUs
- Consider battery life impact of monitoring frequency
- Follow RyzenAdj's safety guidelines for power limits

## Timeline

- **Week 1**: Project setup, UI component migration
- **Week 2**: Rust FFI integration, core UI components
- **Week 3**: State management, profile system
- **Week 4**: Platform features, testing, polish

Total estimated time: 4 weeks for MVP
