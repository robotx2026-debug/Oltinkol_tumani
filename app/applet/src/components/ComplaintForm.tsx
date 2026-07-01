import React, { useState } from 'react';
import { 
  User, Phone, Mail, Home, AlertTriangle, CheckCircle, HelpCircle, 
  Flame, Droplets, Zap, MapPin, Lightbulb, HeartPulse, Trash2, Waves, BookOpen, Wifi 
} from 'lucide-react';
import { OLTINKOL_MAHALLALARI, PROBLEM_CATEGORIES, OFFICIAL_NAMES } from '../data';
import { Complaint } from '../types';

interface ComplaintFormProps {
  onSubmit: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'deadlineAt' | 'officerName' | 'supportCount'>) => void;
}

// Icon mapper helper
const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case 'Flame': return <Flame className={className} />;
    case 'Droplets': return <Droplets className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'Lightbulb': return <Lightbulb className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'Trash2': return <Trash2 className={className} />;
    case 'Waves': return <Waves className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Wifi': return <Wifi className={className} />;
    default: return <HelpCircle className={className} />;
  }
};

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedMahalla, setSelectedMahalla] = useState('');
  const [customMahalla, setCustomMahalla] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Ichimlik suvi ta'minoti');
  const [selectedPresetIssue, setSelectedPresetIssue] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Quick helper to handle preset clicking
  const handlePresetClick = (issue: string) => {
    setSelectedPresetIssue(issue);
    setCustomDescription(prev => {
      if (prev.trim() === '') return issue;
      // Append if already has content
      return prev + `\n\nQo'shimcha tafsilot: ${issue}`;
    });
  };

  const currentCategoryObj = PROBLEM_CATEGORIES.find(cat => cat.title === activeCategory) || PROBLEM_CATEGORIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !email || !selectedMahalla) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    const finalMahalla = selectedMahalla === 'Boshqa' ? customMahalla : selectedMahalla;
    if (selectedMahalla === 'Boshqa' && !customMahalla.trim()) {
      alert("Iltimos, mahallangiz nomini yozing!");
      return;
    }

    const finalDescription = customDescription.trim() || selectedPresetIssue || "Muammo turi tanlandi.";

    onSubmit({
      fullName,
      phone,
      email,
      mahalla: finalMahalla,
      problemType: activeCategory,
      description: finalDescription,
    });

    // Reset form states
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setCustomDescription('');
      setSelectedPresetIssue('');
    }, 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      
      {/* Header Form */}
      <div className="bg-emerald-800 text-white p-5 border-b border-amber-500/20">
        <h3 className="font-display font-bold text-lg text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Yangi murojaat yo'llash (Mutlaqo Bepul)
        </h3>
        <p className="text-xs text-emerald-100 mt-1">
          Muammo haqidagi ma'lumotlarni kiriting. Maxsus MFY mas'ul xodimi 3 kun (72 soat) ichida uni ko'rib chiqib, choralar belgilaydi.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-emerald-800 font-display">Murojaat muvaffaqiyatli jo'natildi!</h4>
          <p className="text-sm text-slate-500 max-w-sm mt-2">
            Hurmatli {fullName}, sizning murojaatingiz ro'yxatga olindi. Tizim avtomatik ravishda 3 kunlik gerbli hisobot tayyorladi. Quyidagi ro'yxatdan murojaatingiz holatini real vaqt rejimida kuzatishingiz mumkin.
          </p>
          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono text-slate-500">
            Xizmat haqi: <span className="text-emerald-600 font-bold">0 so'm (Mutlaqo bepul)</span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
          
          {/* Section 1: Personal Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">1. Aloqa va Shaxsiy ma'lumotlar</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Ism va sharifingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Davron Soliyev"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefon raqamingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Masalan: +998 (93) 123-45-67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> E-pochta manzilingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Masalan: davron93@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Mahalla Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-slate-400" /> Mahallangiz nomi <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={selectedMahalla}
                  onChange={(e) => setSelectedMahalla(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">-- Mahallani tanlang --</option>
                  {OLTINKOL_MAHALLALARI.map((m) => (
                    <option key={m.slug} value={m.name}>{m.name}</option>
                  ))}
                  <option value="Boshqa">Boshqa mahalla (Qo'lda kiritish)...</option>
                </select>
              </div>

            </div>

            {/* Custom Mahalla Input if "Boshqa" selected */}
            {selectedMahalla === 'Boshqa' && (
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 animate-fade-in">
                <label className="block text-xs font-bold text-amber-800 mb-1.5">
                  Mahallangiz nomini kiriting:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Ittifoq ko'chasi, Ravon MFY"
                  value={customMahalla}
                  onChange={(e) => setCustomMahalla(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            )}

          </div>

          {/* Section 2: Problem Type Selection */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">2. Muammo toifasini tanlash</span>
            </div>

            {/* Horizontal or grid Category selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PROBLEM_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.title;
                return (
                  <button
                    key={cat.title}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.title);
                      setSelectedPresetIssue('');
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all text-xs cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs scale-102' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CategoryIcon name={cat.icon} className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="line-clamp-2 leading-tight">{cat.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                <span>⚡ Mahallaga oid eng ko'p uchraydigan muammolar (Tanlash uchun bosing):</span>
              </h5>
              <div className="flex flex-wrap gap-2">
                {currentCategoryObj.commonIssues.map((issue, idx) => {
                  const isSelected = selectedPresetIssue === issue;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetClick(issue)}
                      className={`px-3 py-1.5 rounded-lg text-xs text-left border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-400 border-amber-500 text-emerald-950 font-semibold' 
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {issue}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Section 3: Detailed Description */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
              <span>Murojaat tafsilotlari / Muammoni tavsiflang <span className="text-red-500">*</span></span>
              <span className="text-[10px] text-slate-400">(Tepadagi tayyor muammolarni bossangiz, bu yerga matn qo'shiladi)</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Muammo haqida batafsil ma'lumot qoldiring. Masalan: qaysi ko'chada, qachondan beri suv kelmayapti yoki yo'l sifati yomon..."
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-sans"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-display text-sm font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            Murojaatni jo'natish (TEKIN) — 3 kun ichida hal etish
          </button>

          <p className="text-[10px] text-center text-slate-400">
            Murojaat yuborish orqali siz shaxsiy ma'lumotlaringizni Oltinko'l MFY tizimida maxfiy saqlangan holda qayta ishlashga ruxsat berasiz.
          </p>

        </form>
      )}

    </div>
  );
};
