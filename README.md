# Clinical Observer // Protocol v1.0

A high-end diagnostic tool with a Digital Brutalism aesthetic that passively observes user telemetry.

## // DATA_SOURCES & API_ENDPOINTS

This application aggregates data from the following external and internal interfaces:

### External REST APIs
1. **[ipwho.is](https://ipwho.is/)**
   - **Purpose**: Network Topology & Geolocation.
   - **Data Points**: IP Address, ISP, ASN, City, Country, Latitude/Longitude, Timezone, Currency.
   - **Usage**: Used to triangulate the subject's physical location and network identity without requiring explicit permission.

2. **[Open-Meteo](https://open-meteo.com/)**
   - **Purpose**: Environmental Analysis.
   - **Data Points**: Weather Code (WMO), Temperature.
   - **Usage**: Correlates the subject's coordinates with local atmospheric conditions to assess environmental state.

### Browser/Device APIs
1. **WebGL API (`WEBGL_debug_renderer_info`)**
   - **Purpose**: Hardware Fingerprinting.
   - **Usage**: Extracts the unmasked GPU renderer and vendor strings to identify the graphics processing unit.

2. **Navigator API (`navigator.hardwareConcurrency`, `navigator.deviceMemory`)**
   - **Purpose**: System Profiling.
   - **Usage**: determines CPU logic core count and available RAM (where supported) to estimate computing power.

3. **Device Orientation API**
   - **Purpose**: Behavioral Telemetry.
   - **Usage**: Captures real-time gyroscopic data (Alpha, Beta, Gamma rotation) to track device movement and handling patterns.

4. **Touch & Pointer Events**
   - **Purpose**: Biometric Interaction.
   - **Usage**: Calculates input velocity and contact radius to analyze motor function and engagement levels.

---
*ERR_CODE: 503_HUMAN_NOT_FOUND*