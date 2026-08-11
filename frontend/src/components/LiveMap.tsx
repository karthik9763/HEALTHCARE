import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Play, Pause, RotateCcw, Navigation2, Zap, Gauge, MapPin, Building2 as HospitalIcon, Ambulance as AmbulanceIcon } from 'lucide-react';

interface LiveMapProps {
  ambulanceLat?: number;
  ambulanceLng?: number;
  userLat?: number;
  userLng?: number;
  hospitalLat?: number;
  hospitalLng?: number;
  driverName?: string;
  ambulanceReg?: string;
  eta?: string;
  distance?: string;
  speed?: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  ambulanceLat = 40.7145,
  ambulanceLng = -74.0070,
  userLat = 40.7128,
  userLng = -74.0060,
  hospitalLat = 40.7138,
  hospitalLng = -74.0080,
  driverName = 'David Miller',
  ambulanceReg = 'AMB-101-NYC',
  eta = '4 mins',
  distance = '1.8 km',
  speed = 45
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const ambMarkerRef = useRef<L.Marker | null>(null);
  
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1);
  const [trafficLevel, setTrafficLevel] = useState<'Clear' | 'Moderate' | 'Heavy'>('Clear');
  const [simPos, setSimPos] = useState({ lat: ambulanceLat, lng: ambulanceLng });

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([userLat, userLng], 14);

      // OpenStreetMap dark theme tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // User location marker
      const userIcon = L.divIcon({
        className: 'custom-user-icon',
        html: `<div style="background-color: #3b82f6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #3b82f6;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>Patient Location</b><br>Wall Street & Broadway, NY`);

      // Hospital location marker
      const hospitalIcon = L.divIcon({
        className: 'custom-hospital-icon',
        html: `<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px #10b981;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      L.marker([hospitalLat, hospitalLng], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`<b>St. Jude Hospital</b><br>742 Evergreen Terrace`);

      // Ambulance moving marker
      const ambIcon = L.divIcon({
        className: 'custom-amb-icon',
        html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px #ef4444;" class="animate-pulse"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const ambMarker = L.marker([ambulanceLat, ambulanceLng], { icon: ambIcon }).addTo(map);
      ambMarker.bindPopup(`<b>Ambulance: ${ambulanceReg}</b><br>Driver: ${driverName}`);
      ambMarkerRef.current = ambMarker;

      // Draw route polyline
      const routePoints: [number, number][] = [
        [ambulanceLat, ambulanceLng],
        [userLat, userLng],
        [hospitalLat, hospitalLng]
      ];
      L.polyline(routePoints, { color: '#ef4444', weight: 4, opacity: 0.8, dashArray: '8, 8' }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Handle live movement simulation or replay
  useEffect(() => {
    let interval: any;
    if (isPlayingReplay) {
      interval = setInterval(() => {
        setSimPos(prev => {
          const deltaLat = (userLat - prev.lat) * 0.05 * replaySpeed;
          const deltaLng = (userLng - prev.lng) * 0.05 * replaySpeed;
          const nextLat = prev.lat + deltaLat;
          const nextLng = prev.lng + deltaLng;
          if (ambMarkerRef.current) {
            ambMarkerRef.current.setLatLng([nextLat, nextLng]);
          }
          return { lat: nextLat, lng: nextLng };
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingReplay, replaySpeed, userLat, userLng]);

  const handleResetReplay = () => {
    setIsPlayingReplay(false);
    setSimPos({ lat: ambulanceLat, lng: ambulanceLng });
    if (ambMarkerRef.current) {
      ambMarkerRef.current.setLatLng([ambulanceLat, ambulanceLng]);
    }
  };

  const openGoogleMapsDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${ambulanceLat},${ambulanceLng}&destination=${userLat},${userLng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col">
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map Status Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Live Telemetry Pill */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-white uppercase tracking-wider">{ambulanceReg}</span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Gauge className="w-4 h-4 text-blue-400" />
            <span>{speed} km/h</span>
          </div>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="font-bold text-red-400">ETA {eta}</span>
          </div>
        </div>

        {/* Traffic Status Switcher */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-2 text-xs">
          <span className="text-slate-400">Traffic:</span>
          {(['Clear', 'Moderate', 'Heavy'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTrafficLevel(t)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                trafficLevel === t
                  ? t === 'Clear' ? 'bg-emerald-600 text-white' : t === 'Moderate' ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Map Floating Control Panel */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Driver & Route Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
            <AmbulanceIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              Driver: {driverName}
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">GPS Active</span>
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Distance Remaining: <strong className="text-slate-200">{distance}</strong></span>
              <span>•</span>
              <span>Destination: <strong className="text-emerald-400">St. Jude ER</strong></span>
            </p>
          </div>
        </div>

        {/* Controls: Route Replay & Google Maps */}
        <div className="flex items-center gap-2">
          
          {/* Replay Controls */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setIsPlayingReplay(!isPlayingReplay)}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-200 transition-colors"
              title={isPlayingReplay ? "Pause Route Replay" : "Play Route Replay"}
            >
              {isPlayingReplay ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={handleResetReplay}
              className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Reset Route"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setReplaySpeed(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1)}
              className="px-2 py-1 text-[10px] font-bold bg-slate-700 text-slate-300 rounded-md hover:text-white"
            >
              {replaySpeed}x
            </button>
          </div>

          {/* Turn-by-Turn Google Maps Navigation button */}
          <button
            onClick={openGoogleMapsDirections}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Navigation2 className="w-4 h-4" />
            <span>Open Navigation</span>
          </button>
        </div>

      </div>
    </div>
  );
};
