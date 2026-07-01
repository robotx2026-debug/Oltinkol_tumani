import React, { useState, useEffect } from 'react';
import { 
  Flame, Droplets, Zap, MapPin, Lightbulb, HeartPulse, Trash2, Waves, BookOpen, Wifi, HelpCircle,
  Clock, ThumbsUp, Shield, Checking, CheckCircle2, UserRound, ArrowRight
} from 'lucide-react';
import { Complaint } from '../types';

interface ComplaintCardProps {
  complaint: Complaint;
  onSupport: (id: string) => void;
  isAdminView?: boolean;
}

const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  switch (name) {
    case 'Tabiiy gaz va isitish': return <Flame className={className} />;
    case 'Ichimlik suvi ta\'minoti': return <Droplets className={className} />;
    case 'Elektr energiyasi': return <Zap className={className} />;
    case 'Yo\'l va transport infratuzilmasi': return <MapPin className={className} />;
    case "Ko'chalarni yoritish va elektr simlari": return <Lightbulb className={className} />;
    case "Sog'liqni saqlash va dorixonalar": return <HeartPulse className={className} />;
    case 'Chiqindi va tozalash ishlari': return <Trash2 className={className} />;
    case 'Ariqlar va drenaj tizimi': return <Waves className={className} />;
    case 'Ta\'lim va Bolalar maydonchasi': return <BookOpen className={className} />;
    case 'Internet va Aloqa': return <Wifi className={className} />;
    default: return <HelpCircle className={className} />;
  }
};

const maskName = (name: string) => {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.map(part => {
    if (part.length <= 2) return part;
    return part[0] + "*".repeat(part.length - 2) + part[part.length - 1];
  }).join(" ");
};

const maskPhone = (phone: string) => {
  if (!phone) return "";
  return phone.replace(/(\+998 \d{2} )\d{3}(-\d{2}-)\d{2}/, "$1***$2**");
};

const maskEmail = (email: string) => {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (user.length <= 3) return `***@${domain}`;
  return `${user.substring(0, 2)}***${user.slice(-1)}@${domain}`;
};

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onSupport, isAdminView }) => {
  const [timeLeft, setTimeLeft] = useState<string>('72:00:00');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (complaint.status === 'Bajarildi') {
      setTimeLeft('Hal etildi');
      return;
    }
    if (complaint.status === 'Rad etildi') {
      setTimeLeft('Yopildi');
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(complaint.deadlineAt).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft('Muddati yakunlandi (Nazoratda)');
        setIsUrgent(true);
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const hStr = hours < 10 ? `0${hours}` : `${hours}`;
      const mStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const sStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

      setTimeLeft(`${hStr}:${mStr}:${sStr}`);
      if (hours < 12) {
        setIsUrgent(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [complaint.deadlineAt, complaint.status]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Qabul qilindi':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case "Ko'rib chiqilmoqda":
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Bajarildi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rad etildi':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between font-sans">
      
      <div className="p-4 md:p-5">
        
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              #{complaint.id}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {complaint.mahalla}
            </span>
          </div>

          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusStyle(complaint.status)}`}>
            {complaint.status}
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 shrink-0 mt-0.5">
            <CategoryIcon name={complaint.problemType} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 font-sans text-sm md:text-base leading-snug">
              {complaint.problemType}
            </h4>
            <span className="text-[10px] text-slate-400 font-medium font-mono">{formattedDate}</span>
          </div>
        </div>

        <p className="text-slate-600 text-xs md:text-sm font-sans mt-3 leading-relaxed whitespace-pre-wrap line-clamp-4">
          {complaint.description}
        </p>

        <div className="mt-4 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Murojaatchi:</span>
            <span className="text-slate-700 font-semibold">{maskName(complaint.fullName)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Telefon:</span>
            <span className="text-slate-700 font-mono">{maskPhone(complaint.phone)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">E-pochta:</span>
            <span className="text-slate-700 font-mono text-[11px]">{maskEmail(complaint.email)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            <span>Ijro jarayoni</span>
            <span className="text-slate-500">3 kunlik kafolat</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className={`h-1.5 rounded-l-full transition-colors ${
              complaint.status !== 'Rad etildi' ? 'bg-blue-500' : 'bg-rose-300'
            }`} />
            <div className={`h-1.5 transition-colors ${
              complaint.status === 'Ko\'rib chiqilmoqda' || complaint.status === 'Bajarildi'
                ? 'bg-amber-400' 
                : 'bg-slate-200'
            }`} />
            <div className={`h-1.5 rounded-r-full transition-colors ${
              complaint.status === 'Bajarildi' ? 'bg-emerald-500' : 'bg-slate-200'
            }`} />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 p-2.5 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <UserRound className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-slate-400 leading-none">Mas'ul xodim</p>
              <p className="text-[11px] font-bold text-slate-700 leading-snug mt-0.5">{complaint.officerName}</p>
            </div>
          </div>
        </div>

        {complaint.resolutionText && (
          <div className="mt-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs">
            <span className="font-bold text-emerald-950 block mb-0.5">Rasmiy javob:</span>
            <span className="text-emerald-900 leading-relaxed font-sans">{complaint.resolutionText}</span>
          </div>
        )}

      </div>

      <div className="bg-slate-50 border-t border-slate-100 p-3 px-4 md:px-5 flex items-center justify-between">
        
        <div className="flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${isUrgent && complaint.status !== 'Bajarildi' ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          <div className="text-left">
            <p className="text-[8px] text-slate-400 leading-none">Ijro muddati:</p>
            <p className={`text-xs font-mono font-bold leading-none mt-0.5 ${
              complaint.status === 'Bajarildi' 
                ? 'text-emerald-600' 
                : isUrgent 
                ? 'text-rose-600 font-extrabold' 
                : 'text-slate-700'
            }`}>
              {timeLeft}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSupport(complaint.id)}
          disabled={complaint.hasSupported || complaint.status === 'Bajarildi'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            complaint.hasSupported
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : complaint.status === 'Bajarildi'
              ? 'bg-emerald-100/35 text-emerald-600 border-emerald-100/30 cursor-not-allowed'
              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${complaint.hasSupported ? 'fill-amber-500 text-amber-600' : ''}`} />
          <span>{complaint.supportCount}</span>
          <span className="text-[10px] font-normal text-slate-400 hover:text-slate-600 hidden xs:inline">
            {complaint.hasSupported ? "Qo'shildingiz" : "Qo'shilaman"}
          </span>
         </button>

      </div>

    </div>
  );
};
