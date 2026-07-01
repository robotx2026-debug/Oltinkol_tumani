import { useState, useEffect } from 'react';
import { 
  Building2, Search, SlidersHorizontal, HelpCircle, ShieldAlert,
  ListFilter, RefreshCw, Layers, CheckCircle 
} from 'lucide-react';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { InteractiveMap } from './components/InteractiveMap';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintCard } from './components/ComplaintCard';
import { AdminPanel } from './components/AdminPanel';
import { PRE_SEEDED_COMPLAINTS, OLTINKOL_MAHALLALARI, PROBLEM_CATEGORIES, OFFICIAL_NAMES } from './data';
import { Complaint, StatusType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'citizen' | 'admin'>('citizen');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [supportedIds, setSupportedIds] = useState<string[]>([]);
  
  // Filtering and searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMahallaFilter, setSelectedMahallaFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [selectedMahallaFromMap, setSelectedMahallaFromMap] = useState<string>('');

  // Hydrate complaints from server API, with local storage fallback
  useEffect(() => {
    fetch('/api/complaints')
      .then(res => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then(data => {
        setComplaints(data);
      })
      .catch(err => {
        console.warn('API error, falling back to local storage:', err);
        const saved = localStorage.getItem('oltinkol_tuman_complaints');
        if (saved) {
          try {
            setComplaints(JSON.parse(saved));
          } catch (e) {
            setComplaints(PRE_SEEDED_COMPLAINTS(new Date()));
          }
        } else {
          const seeded = PRE_SEEDED_COMPLAINTS(new Date());
          setComplaints(seeded);
          localStorage.setItem('oltinkol_tuman_complaints', JSON.stringify(seeded));
        }
      });

    // Hydrate client-side supported IDs
    const savedIds = localStorage.getItem('oltinkol_tuman_supported_ids');
    if (savedIds) {
      try {
        setSupportedIds(JSON.parse(savedIds));
      } catch (e) {}
    }
  }, []);

  const handleAddComplaint = async (newC: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'deadlineAt' | 'officerName' | 'supportCount'>) => {
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newC)
      });
      if (response.ok) {
        const updated = await response.json();
        setComplaints(updated);
        // Sync to local storage for offline tolerance
        localStorage.setItem('oltinkol_tuman_complaints', JSON.stringify(updated));
        
        // Auto-support our own newly created complaint
        if (updated.length > 0) {
          const newId = updated[0].id;
          const newSupported = [...supportedIds, newId];
          setSupportedIds(newSupported);
          localStorage.setItem('oltinkol_tuman_supported_ids', JSON.stringify(newSupported));
        }
      } else {
        throw new Error("Murojaat saqlashda xatolik yuz berdi");
      }
    } catch (err) {
      console.warn("Backend unavailable, using local fallback", err);
      const now = new Date();
      const deadline = new Date(now);
      deadline.setDate(deadline.getDate() + 3);

      let appointedOfficial = OFFICIAL_NAMES[0];
      if (newC.problemType.includes('suv')) {
        appointedOfficial = OFFICIAL_NAMES[2];
      } else if (newC.problemType.includes('gaz') || newC.problemType.includes('isitish')) {
        appointedOfficial = OFFICIAL_NAMES[1];
      } else if (newC.problemType.includes('Yo\'l') || newC.problemType.includes('Chiqindi') || newC.problemType.includes('yoritish')) {
        appointedOfficial = OFFICIAL_NAMES[4];
      } else if (newC.problemType.includes('Ta\'lim')) {
        appointedOfficial = OFFICIAL_NAMES[6];
      }

      const complaint: Complaint = {
        ...newC,
        id: `m-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: now.toISOString(),
        status: 'Qabul qilindi',
        deadlineAt: deadline.toISOString(),
        officerName: appointedOfficial,
        supportCount: 1,
        hasSupported: true,
        isFree: true
      };

      const updated = [complaint, ...complaints];
      setComplaints(updated);
      localStorage.setItem('oltinkol_tuman_complaints', JSON.stringify(updated));
      setSupportedIds([...supportedIds, complaint.id]);
      localStorage.setItem('oltinkol_tuman_supported_ids', JSON.stringify([...supportedIds, complaint.id]));
    }
  };

  const handleSelectMahallaFromMap = (mahallaName: string) => {
    setSelectedMahallaFromMap(mahallaName);
    setTimeout(() => {
      document.getElementById('complaint-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const handleSupportComplaint = async (id: string) => {
    const alreadySupported = supportedIds.includes(id);
    const newSupportedIds = alreadySupported 
      ? supportedIds.filter(x => x !== id) 
      : [...supportedIds, id];
    
    setSupportedIds(newSupportedIds);
    localStorage.setItem('oltinkol_tuman_supported_ids', JSON.stringify(newSupportedIds));

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'support',
          hasSupported: alreadySupported
        })
      });
      if (response.ok) {
        const updated = await response.json();
        setComplaints(updated);
        localStorage.setItem('oltinkol_tuman_complaints', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Backend error updating support, doing local update", err);
      const updated = complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            supportCount: alreadySupported ? c.supportCount - 1 : c.supportCount + 1
          };
        }
        return c;
      });
      setComplaints(updated);
      localStorage.setItem('oltinkol_tuman_complaints', JSON.stringify(updated));
    }
  };

  const handleUpdateStatus = async (id: string, status: StatusType, resolutionText?: string, officerName?: string) => {
    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          status,
          resolutionText,
          officerName
        })
      });
      if (response.ok) {
        const updated = await response.json();
        setComplaints(updated);
        localStorage.setItem('oltinkol_tuman_complaints', JSON.stringify(updated));
      } else {
        throw new Error("Status yangilash xatosi");
      }
    } catch (err) {
      console.warn("Backend update failed, using local update", err);
      const updated = complaints.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status,
            ...(resolutionText !== undefined && { resolutionText }),
            ...(officerName !== undefined && { officerName })
          };
        }
        return c;
      });
      setComplaints(updated);
      localStorage.setItem('oltinkol_tuman_complaints', JSON.stringify(updated));
    }
  };

  // Map each complaint to include the client-side user's personalized "hasSupported" status
  const mappedComplaints = complaints.map(c => ({
    ...c,
    hasSupported: supportedIds.includes(c.id)
  }));

  const filteredComplaints = mappedComplaints.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMahalla = selectedMahallaFilter === '' || c.mahalla === selectedMahallaFilter;
    const matchesCategory = selectedCategoryFilter === '' || c.problemType === selectedCategoryFilter;
    const matchesStatus = selectedStatusFilter === '' || c.status === selectedStatusFilter;

    return matchesSearch && matchesMahalla && matchesCategory && matchesStatus;
  });

  return (
    <div id="portal-root" className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-amber-100 selection:text-amber-900">
      
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentView === 'citizen' ? (
          <div className="space-y-6 animate-fade-in">
            
            <StatsDashboard complaints={mappedComplaints} />

            <InteractiveMap 
              complaints={mappedComplaints} 
              onSelectMahalla={handleSelectMahallaFromMap} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-5 lg:sticky lg:top-6">
                <ComplaintForm 
                  onSubmit={handleAddComplaint} 
                  selectedMahallaFromMap={selectedMahallaFromMap}
                />
              </div>

              <div className="lg:col-span-7 space-y-5">
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-emerald-800" />
                        Murojaat va muammolar ro'yxati
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Oltinko'l aholisi tomonidan yozilgan barcha muammolar ro'yxati</p>
                    </div>
                    
                    {(selectedMahallaFilter || selectedCategoryFilter || selectedStatusFilter || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedMahallaFilter('');
                          setSelectedCategoryFilter('');
                          setSelectedStatusFilter('');
                          setSearchQuery('');
                        }}
                        className="text-xs text-emerald-700 hover:text-emerald-950 underline font-medium cursor-pointer"
                      >
                        Filtplarni tozalash
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    
                    <div className="relative">
                      <Search className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Kalit so'z yoki ism bo'yicha qidiruv"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-8 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-emerald-500 bg-slate-50/50"
                      />
                    </div>

                    <select
                      value={selectedMahallaFilter}
                      onChange={(e) => setSelectedMahallaFilter(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-emerald-500"
                    >
                      <option value="">Barcha mahallalar</option>
                      {OLTINKOL_MAHALLALARI.map(m => (
                        <option key={m.slug} value={m.name}>{m.name}</option>
                      ))}
                    </select>

                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-emerald-500"
                    >
                      <option value="">Barcha muammo turlari</option>
                      {PROBLEM_CATEGORIES.map(cat => (
                        <option key={cat.title} value={cat.title}>{cat.title}</option>
                      ))}
                    </select>

                    <select
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-emerald-500"
                    >
                      <option value="">Barcha holatlar</option>
                      <option value="Qabul qilindi">Qabul qilindi</option>
                      <option value="Ko'rib chiqilmoqda">Ko'rib chiqilmoqda</option>
                      <option value="Bajarildi">Bajarildi (Hal etilgan)</option>
                      <option value="Rad etildi">Rad etildi</option>
                    </select>

                  </div>
                </div>

                {filteredComplaints.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
                    <p className="text-slate-400 font-medium font-sans">
                      Hech qanday mos keladigan murojaat topilmadi.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Yangi murojaat yo'llash orqali ro'yxatni to'ldirishingiz mumkin.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredComplaints.map((c) => (
                      <ComplaintCard 
                        key={c.id} 
                        complaint={c} 
                        onSupport={handleSupportComplaint} 
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-amber-500/10 border border-amber-500/20 text-slate-800 p-4 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 font-display">Taqdimot & Sinov Rejimi (MFY Kengashi)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Oddiy sharoitda murojaatlarni MFY rasmiylari o'rganadi. Ushbu panel sizga MFY kengashi nomidan javob yozishni sinab ko'rish imkonini beradi. Chap tarafdagi ro'yxatdan biron-bir murojaatni tanlab, unga mas'ul tayinlang va <strong>3 kunlik ko'rib chiqish kafolatini</strong> amalda hal qiling!
                </p>
              </div>
            </div>

            <AdminPanel 
              complaints={mappedComplaints} 
              onUpdateStatus={handleUpdateStatus} 
            />
          </div>
        )}

      </main>

      <footer className="w-full bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-white tracking-wide">Oltinko'l tumani</span>
              <span className="bg-emerald-800 text-emerald-100 font-mono font-medium text-[9px] py-0.25 px-1.5 rounded">
                E-Davlat
              </span>
            </div>
            <p className="text-slate-500 mt-1 font-sans">
              Andijon viloyati, Oltinko'l tumani bepul fuqarolar muammolarini boshqarish ochiq tizimi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>Platforma turi: <strong className="text-slate-350">Mutlaqo Tekin (Free)</strong></span>
            <span>Aloqa: <strong className="text-slate-350">+998 (74) 310-20-30</strong></span>
            <span>&copy; {new Date().getFullYear()} Oltinko'l tumani. Barcha huquqlar himoyalangan.</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
