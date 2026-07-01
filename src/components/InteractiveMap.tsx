import React, { useState, useMemo } from 'react';
import { 
  MapPin, Users, AlertTriangle, CheckCircle, ShieldAlert, Navigation, 
  Search, ArrowRight, RefreshCw, ZoomIn, ZoomOut, HelpCircle 
} from 'lucide-react';
import { Complaint, MahallaConfig } from '../types';
import { OLTINKOL_MAHALLALARI } from '../data';

interface InteractiveMapProps {
  complaints: Complaint[];
  onSelectMahalla: (mahallaName: string) => void;
}

interface MapRegion {
  name: string;
  slug: string;
  points: string;
  centerX: number;
  centerY: number;
}

// 14 Mahalla region boundaries beautifully mapped inside a 500x320 grid
const MAP_REGIONS: MapRegion[] = [
  { name: "Sadda MFY", slug: "sadda", points: "220,10 280,10 320,50 240,70 180,40", centerX: 245, centerY: 35 },
  { name: "Qo'shtepa MFY", slug: "qoshtepa", points: "180,40 240,70 230,120 150,110 140,70", centerX: 185, centerY: 80 },
  { name: "Ipak Yo'li MFY", slug: "ipak-yoli", points: "240,70 320,50 350,100 280,120 230,120", centerX: 285, centerY: 90 },
  { name: "Bo'ston MFY", slug: "boston", points: "320,50 400,30 430,80 350,100", centerX: 375, centerY: 65 },
  { name: "Jalabek MFY", slug: "jalabek", points: "350,100 430,80 460,140 380,160 330,130", centerX: 400, centerY: 120 },
  { name: "Maslahat MFY", slug: "maslahat", points: "430,80 500,70 490,120 460,140", centerX: 470, centerY: 100 },
  { name: "Ittifoq MFY", slug: "ittifoq", points: "380,160 460,140 440,200 350,220 330,180", centerX: 405, centerY: 180 },
  { name: "Oltinko'l MFY", slug: "oltinkol-mfy", points: "230,120 280,120 330,130 380,160 330,180 260,190 220,160", centerX: 290, centerY: 150 },
  { name: "Markaz MFY", slug: "markaz", points: "150,110 230,120 220,160 140,170 120,130", centerX: 170, centerY: 140 },
  { name: "Orol MFY", slug: "orol", points: "100,60 180,40 140,70 120,130 80,100", centerX: 130, centerY: 85 },
  { name: "Ravon MFY", slug: "ravon", points: "20,80 100,60 80,100 120,130 90,180 30,140", centerX: 70, centerY: 120 },
  { name: "Madaniyat MFY", slug: "madaniyat", points: "120,130 140,170 210,180 180,240 110,220 90,180", centerX: 145, centerY: 185 },
  { name: "Kumko'cha MFY", slug: "kumkocha", points: "220,160 260,190 280,260 200,270 180,240 210,180", centerX: 225, centerY: 215 },
  { name: "Sujiy MFY", slug: "sujiy", points: "260,190 330,180 350,220 290,300 180,290 200,270 280,260", centerX: 275, centerY: 245 }
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ complaints, onSelectMahalla }) => {
  const [hoveredRegion, setHoveredRegion] = useState<MapRegion | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string>("Oltinko'l MFY");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate live stats for each Mahalla using the complaints array
  const mahallaStats = useMemo(() => {
    const stats: Record<string, { total: number; active: number; solved: number; population: number }> = {};
    
    // Seed standard configurations first
    OLTINKOL_MAHALLALARI.forEach(m => {
      stats[m.name] = {
        total: 0,
        active: 0,
        solved: 0,
        population: m.population || 2500
      };
    });

    // Populate actual live values from state
    complaints.forEach(c => {
      if (stats[c.mahalla]) {
        stats[c.mahalla].total += 1;
        if (c.status === 'Bajarildi') {
          stats[c.mahalla].solved += 1;
        } else if (c.status === 'Qabul qilindi' || c.status === "Ko'rib chiqilmoqda") {
          stats[c.mahalla].active += 1;
        }
      }
    });

    return stats;
  }, [complaints]);

  // Active region data based on user selection or hovered state
  const activeRegionName = hoveredRegion ? hoveredRegion.name : selectedRegionName;
  const activeRegionStats = mahallaStats[activeRegionName] || { total: 0, active: 0, solved: 0, population: 2500 };

  const handleRegionClick = (region: MapRegion) => {
    setSelectedRegionName(region.name);
    // Let the user trigger help directly
  };

  const handleRequestHelp = (name: string) => {
    onSelectMahalla(name);
  };

  // Find the color category for map representation
  const getRegionStyles = (name: string, isHovered: boolean, isSelected: boolean) => {
    const stats = mahallaStats[name] || { active: 0 };
    
    let baseColor = 'fill-emerald-50 text-emerald-700';
    let strokeColor = 'stroke-emerald-350';
    
    if (stats.active >= 3) {
      // High urgency
      baseColor = isHovered 
        ? 'fill-rose-200/90' 
        : isSelected 
          ? 'fill-rose-150/70' 
          : 'fill-rose-50/50';
      strokeColor = 'stroke-rose-400';
    } else if (stats.active > 0) {
      // Medium urgency
      baseColor = isHovered 
        ? 'fill-amber-200/90' 
        : isSelected 
          ? 'fill-amber-150/70' 
          : 'fill-amber-50/50';
      strokeColor = 'stroke-amber-400';
    } else {
      // Low/No urgency
      baseColor = isHovered 
        ? 'fill-emerald-200/90' 
        : isSelected 
          ? 'fill-emerald-150/70' 
          : 'fill-emerald-50/50';
      strokeColor = 'stroke-emerald-400';
    }

    return {
      className: `${baseColor} ${strokeColor} transition-all duration-300 cursor-pointer stroke-[1.5] ${
        isHovered ? 'stroke-[2.5] filter drop-shadow-sm' : ''
      } ${isSelected ? 'stroke-[2.5] stroke-emerald-600' : ''}`
    };
  };

  // Filter regions based on search query
  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return MAP_REGIONS;
    return MAP_REGIONS.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md font-sans overflow-hidden">
      
      {/* Upper bar with header & search */}
      <div className="bg-emerald-850 p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between border-b gap-4">
        <div>
          <h2 className="font-display font-extrabold text-lg md:text-xl text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            Oltinko'l tumani raqamli xaritasi
          </h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            O'z mahallangizni tanlang, muammolar holatini tekshiring va haritadan turib yordam so'rang
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-white/90">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400 inline-block"></span>
            <span>Faol muammo yo'q</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-100 border border-amber-400 inline-block"></span>
            <span>1-2 faol muammo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-100 border border-rose-400 inline-block"></span>
            <span>3+ faol muammo</span>
          </div>
        </div>
      </div>

      {/* Main Map + Details Content (Split columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* LEFT COLUMN: Map view with zoom */}
        <div className="lg:col-span-7 bg-slate-900 border-r border-slate-200 p-5 relative flex flex-col justify-between min-h-[360px]">
          
          {/* Controls overlays */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 backdrop-blur-xs">
              <button 
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer transition-all"
                title="Kattalashtirish"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer transition-all"
                title="Kichiklashtirish"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={() => { setZoomLevel(1); }}
                className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer transition-all"
                title="Dastlabki holat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="absolute top-4 right-4 z-10 w-44 md:w-56">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Mahallani qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs placeholder:text-slate-500 text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-750 focus:border-emerald-500 focus:outline-none pl-8 pr-2.5 py-2 rounded-lg backdrop-blur-xs"
              />
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="flex-1 flex items-center justify-center overflow-hidden h-full max-h-[300px] mt-6 select-none">
            <svg 
              viewBox="0 0 520 320" 
              className="w-full max-w-full h-auto transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Visual grid pattern */}
                <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="1" fill="rgba(255, 255, 255, 0.12)" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Decorative river coordinate (Karadaryo mock path) */}
              <path 
                d="M -20,130 C 130,120 220,220 360,210 C 440,205 480,260 550,260" 
                fill="none" 
                stroke="#1e3a5f" 
                strokeWidth="6" 
                strokeDasharray="4 2"
                className="opacity-40"
              />

              {/* Map Regions (Polygons) */}
              {MAP_REGIONS.map((region) => {
                const isHovered = hoveredRegion?.slug === region.slug;
                const isSelected = selectedRegionName === region.name;
                const styles = getRegionStyles(region.name, isHovered, isSelected);
                const stats = mahallaStats[region.name] || { active: 0 };
                const isMatch = filteredRegions.some(r => r.slug === region.slug);

                return (
                  <g 
                    key={region.slug}
                    onMouseEnter={() => setHoveredRegion(region)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleRegionClick(region)}
                    className={`${isMatch ? 'opacity-100' : 'opacity-25'} transition-opacity duration-200`}
                  >
                    {/* SVG Polygon shape */}
                    <polygon 
                      points={region.points}
                      className={styles.className}
                    />

                    {/* Glowing pulse if active problems exist */}
                    {stats.active > 0 && (
                      <g>
                        {/* Rippling circle */}
                        <circle 
                          cx={region.centerX} 
                          cy={region.centerY} 
                          r={stats.active >= 3 ? "12" : "8"} 
                          className={`animate-ping ${
                            stats.active >= 3 ? 'fill-rose-500/30' : 'fill-amber-500/30'
                          }`}
                          style={{ animationDuration: '2s' }}
                        />
                        {/* Solid center dot */}
                        <circle 
                          cx={region.centerX} 
                          cy={region.centerY} 
                          r={stats.active >= 3 ? "4.5" : "3.5"} 
                          className={`${
                            stats.active >= 3 ? 'fill-rose-500' : 'fill-amber-500'
                          }`}
                        />
                      </g>
                    )}

                    {/* Small name identifier overlay */}
                    <text 
                      x={region.centerX} 
                      y={region.centerY - 8} 
                      textAnchor="middle" 
                      className={`font-sans font-extrabold select-none pointer-events-none tracking-tight transition-all text-[8.5px] ${
                        isHovered || isSelected 
                          ? 'fill-slate-900 font-black' 
                          : 'fill-slate-600 font-bold'
                      }`}
                    >
                      {region.name.replace(" MFY", "")}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
            <span>Andijon viloyati - Oltinko'l tumani ma'muriy tizimi</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live yangilanmoqda
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Stats Panel & CTA */}
        <div className="lg:col-span-5 p-5 md:p-6 flex flex-col justify-between bg-slate-50/50">
          
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-200">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-800">Tanlangan HUDUD TAFTISHI</span>
              <h3 className="font-display font-black text-xl text-slate-800 mt-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-800" />
                {activeRegionName}
              </h3>
            </div>

            {/* Core Stats Card */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Aholi soni</span>
                <div className="flex items-baseline gap-1 mt-1 text-slate-800">
                  <span className="text-lg font-extrabold font-mono">
                    {activeRegionStats.population.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">kishi</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-slate-400 text-[10px]">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>Xonadonlar: {Math.round(activeRegionStats.population / 4.8)} ta</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Jami murojaatlar</span>
                <div className="flex items-baseline gap-1 mt-1 text-slate-850">
                  <span className="text-lg font-extrabold font-mono text-emerald-900">
                    {activeRegionStats.total}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">ta</span>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Tezkor qayta ishlash</span>
                </div>
              </div>
            </div>

            {/* Progress and status indicators */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-650 uppercase tracking-wide">Murojaatlar holati tahlili</h4>
              
              <div className="space-y-2 text-xs">
                
                {/* Active (Unresolved) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <AlertTriangle className={`w-3.5 h-3.5 ${
                      activeRegionStats.active >= 3 ? 'text-rose-500' : 'text-amber-500'
                    }`} />
                    <span>Hozirda faol (ko'rib chiqilmoqda)</span>
                  </div>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                    activeRegionStats.active >= 3 
                      ? 'bg-rose-100 text-rose-800' 
                      : activeRegionStats.active > 0 
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {activeRegionStats.active} ta
                  </span>
                </div>

                {/* Resolved */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Muvaffaqiyatli hal etilgan</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded text-xs">
                    {activeRegionStats.solved} ta
                  </span>
                </div>

              </div>

              {/* Progress Bar of Resolution */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>HAL ETISH SAMARADORLIGI</span>
                  <span>{activeRegionStats.total > 0 ? Math.round((activeRegionStats.solved / activeRegionStats.total) * 100) : 100}%</span>
                </div>
                <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${activeRegionStats.total > 0 ? (activeRegionStats.solved / activeRegionStats.total) * 100 : 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Custom security text */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-amber-850 leading-relaxed">
                <strong>Oltinko'l tumani mas'ul xizmati:</strong> Har bir mahalla bo'yicha yuborilgan maktublar mahalla oqsoqoli va hokimlik tizimida nazoratga olinadi. 3 kunlik tezkor chora kafolatlanadi.
              </div>
            </div>

          </div>

          <div className="pt-5 lg:pt-0">
            {/* BIG ACTION BUTTON TO POPULATE AND SCROLL TO FORM */}
            <button
              onClick={() => handleRequestHelp(activeRegionName)}
              className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-sm py-3 px-4 rounded-xl border-b-4 border-emerald-950 flex items-center justify-center gap-2 transition-all active:translate-y-0.5 cursor-pointer shadow-md shadow-emerald-800/10 group"
            >
              <span>{activeRegionName} bo'yicha yordam so'rash</span>
              <ArrowRight className="w-4 h-4 text-emerald-250 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10.5px] text-center text-slate-400 mt-2">
              Tizim bepul portal hisoblanadi. Murojaat bevosita formaga kiritiladi.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
