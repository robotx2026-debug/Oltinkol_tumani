import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

// Since we compile server.ts to dist/server.cjs, we need to handle paths correctly.
const isProd = process.env.NODE_ENV === 'production';
const PORT = 3000;

// Path to complaints JSON database - use Vercel's /tmp directory if running on Vercel (since root is read-only)
const DB_FILE = process.env.VERCEL
  ? '/tmp/complaints-db.json'
  : path.join(process.cwd(), 'complaints-db.json');

// Helper to load/save complaints
interface Complaint {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  mahalla: string;
  problemType: string;
  description: string;
  createdAt: string;
  status: 'Qabul qilindi' | "Ko'rib chiqilmoqda" | 'Bajarildi' | 'Rad etildi';
  deadlineAt: string;
  officerName: string;
  supportCount: number;
  hasSupported?: boolean;
  isFree?: boolean;
  resolutionText?: string;
}

// Default seeded complaints if no DB file exists
const DEFAULT_OFFICIALS = [
  "Sardorbek Alimov — MFY Raisi",
  "Nodirbek Karimov — Muhandis-gazchi",
  "Sherzodbek Tojiboyev — Suv ta'minoti boshlig'i",
  "Otabek Yo'ldoshev — Hokim yordamchisi",
  "Zafarbek Orifov — Obodonlashtirish bo'limi",
  "Dilshodbek Tursunov — Mahalla Xotin-qizlar faoli",
  "Baxtiyorbjon Dadajonov — Yoshlar yetakchisi"
];

function getSeededComplaints(): Complaint[] {
  const now = new Date();
  const getPastDateStr = (daysAgo: number) => {
    const d = new Date(now);
    d.setMinutes(d.getMinutes() - daysAgo * 1440 - (daysAgo * 30));
    return d.toISOString();
  };

  const getDeadlineStr = (createdAtStr: string) => {
    const d = new Date(createdAtStr);
    d.setDate(d.getDate() + 3);
    return d.toISOString();
  };

  return [
    {
      id: "m-101",
      fullName: "Anvarjon Ergashboyev",
      phone: "+998 93 123-45-67",
      email: "anvar93@gmail.com",
      mahalla: "Qo'shtepa MFY",
      problemType: "Ichimlik suvi ta'minoti",
      description: "Bizning ko'chada ichimlik suvi yetishmovchiligi bo'lyapti. 4 kundan beri suv butunlay to'xtatilgan, hech qanaqa ogohlantirishsiz. Iltimos buni ko'rib chiqinglar, jami 40 ta xonadon suvsiz qoldi.",
      createdAt: getPastDateStr(1.2),
      status: "Ko'rib chiqilmoqda",
      deadlineAt: getDeadlineStr(getPastDateStr(1.2)),
      isFree: true,
      officerName: "Sherzodbek Tojiboyev — Suv ta'minoti boshlig'i",
      resolutionText: "Murojaat suv ta'minoti korxonasiga yuborildi. Hududdagi nasos stansiyasida elektr uzilganligi sababli nasos vaqtincha to'xtab qolgan ekan. Mutaxassislar jalb etilgan, yaqin soatlarda suv qayta tiklanadi.",
      supportCount: 18,
    },
    {
      id: "m-102",
      fullName: "Malikaxon Mo'minova",
      phone: "+998 90 987-65-43",
      email: "malika.mominova@mail.ru",
      mahalla: "Oltinko'l MFY",
      problemType: "Tabiiy gaz va isitish",
      description: "Soat 18:00 dan keyin tabiiy gaz bosimi juda past bo'lyapti. Ovqat pishirishga umuman gaz yetmayapti. Mahallamizda gaz muammosini hal etishingizni so'raymiz. Har yili shu ahvol takrorlanmoqda.",
      createdAt: getPastDateStr(0.5),
      status: "Qabul qilindi",
      deadlineAt: getDeadlineStr(getPastDateStr(0.5)),
      isFree: true,
      officerName: "Nodirbek Karimov — Muhandis-gazchi",
      resolutionText: "Murojaat ro'yxatga olindi. 'Oltinko'ltumangaz' xodimlari gaz taqsimlash punktlaridagi bosimni o'lchashmoqda. 3 kun muddat ichida bosimni kutish chorasi ko'riladi.",
      supportCount: 12,
    },
    {
      id: "m-103",
      fullName: "Rustamjon Soliyev",
      phone: "+998 99 444-55-66",
      email: "soliyev.rustam@gmail.com",
      mahalla: "Bo'ston MFY",
      problemType: "Yo'l va transport infratuzilmasi",
      description: "Maktabgacha ta'lim muassasasi oldidagi asosiy yo'lda chuqurliklar ko'payib ketgan. Yomg'irli kunlarda bolalarni olib borish mutlaqo imkonsiz bo'lib qoladi. Shag'al to'kib bo'lsa ham tekislash lozim.",
      createdAt: getPastDateStr(2.8),
      status: "Bajarildi",
      deadlineAt: getDeadlineStr(getPastDateStr(2.8)),
      isFree: true,
      officerName: "Zafarbek Orifov — Obodonlashtirish bo'limi",
      resolutionText: "Murojaat muvaffaqiyatli hal qilindi. MFY obodonlashtirish boshqarmasi tomonidan 4 ta yuk mashinasi shag'al keltirilib yo'l chuqurliklari tekislab berildi. Kelgusida yo'l dasturiga kiritilib asfaltlanadi.",
      supportCount: 25,
    },
    {
      id: "m-104",
      fullName: "Davronbek Yoqubov",
      phone: "+998 91 333-22-11",
      email: "yoqubov.dev@gmail.com",
      mahalla: "Ittifoq MFY",
      problemType: "Ko'chalarni yoritish va elektr simlari",
      description: "Ittifoq ko'chasida kechasi ko'chalar butunlay qorong'u, yoritish chiroqlari birorta ham ishlamaydi. Farzandlarimiz kechki darsdan qaytishiga rosa qo'rqyapmiz.",
      createdAt: getPastDateStr(0.1),
      status: "Qabul qilindi",
      deadlineAt: getDeadlineStr(getPastDateStr(0.1)),
      isFree: true,
      officerName: "Otabek Yo'ldoshev — Hokim yordamchisi",
      resolutionText: "Ushbu murojaat hududiy elektr tarmoqlari korxonasiga yo'naltirildi va mas'ul tayinlandi. 3 kunlik muddat doirasida ko'cha chiroqlari texnik ko'rikdan o'tkazilib, ishga tushiriladi.",
      supportCount: 4,
    }
  ];
}

function loadComplaints(): Complaint[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error loading complaints from DB file:", error);
  }
  const seeded = getSeededComplaints();
  saveComplaints(seeded);
  return seeded;
}

function saveComplaints(complaints: Complaint[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(complaints, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error saving complaints to DB file:", error);
  }
}

const app = express();
app.use(express.json());

// API Route: GET all complaints
app.get('/api/complaints', (req, res) => {
  const complaints = loadComplaints();
  res.json(complaints);
});

// API Route: POST a new complaint
app.post('/api/complaints', (req, res) => {
  const { fullName, phone, email, mahalla, problemType, description } = req.body;
  
  if (!fullName || !phone || !mahalla || !problemType || !description) {
    return res.status(400).json({ error: "Kerakli ma'lumotlar to'liq kiritilmadi!" });
  }

  const complaints = loadComplaints();
  
  const now = new Date();
  const deadline = new Date(now);
  deadline.setDate(deadline.getDate() + 3);

  // Assign standard officials based on problem type
  let appointedOfficial = DEFAULT_OFFICIALS[0];
  if (problemType.includes('suv')) {
    appointedOfficial = DEFAULT_OFFICIALS[2]; // Sherzodbek Tojiboyev - Suv
  } else if (problemType.includes('gaz') || problemType.includes('isitish')) {
    appointedOfficial = DEFAULT_OFFICIALS[1]; // Nodirbek Karimov - Gaz
  } else if (problemType.includes('Yo\'l') || problemType.includes('Chiqindi') || problemType.includes('yoritish')) {
    appointedOfficial = DEFAULT_OFFICIALS[4]; // Zafarbek - Obodonlashtirish
  } else if (problemType.includes('Ta\'lim')) {
    appointedOfficial = DEFAULT_OFFICIALS[6]; // Baxtiyorjon - Yoshlar
  }

  const newComplaint: Complaint = {
    id: `m-${Math.floor(100 + Math.random() * 900)}`,
    fullName,
    phone,
    email: email || '',
    mahalla,
    problemType,
    description,
    createdAt: now.toISOString(),
    status: 'Qabul qilindi',
    deadlineAt: deadline.toISOString(),
    officerName: appointedOfficial,
    supportCount: 1,
    hasSupported: true,
    isFree: true
  };

  complaints.unshift(newComplaint);
  saveComplaints(complaints);
  res.status(201).json(complaints);
});

// API Route: PUT/Update a complaint (Status / Support)
app.put('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { action, status, resolutionText, officerName, hasSupported } = req.body;
  
  const complaints = loadComplaints();
  const index = complaints.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Murojaat topilmadi!" });
  }

  const complaint = complaints[index];

  if (action === 'support') {
    const alreadySupported = hasSupported;
    complaint.supportCount = alreadySupported ? complaint.supportCount - 1 : complaint.supportCount + 1;
    // In a real multi-user system, we don't save per-user "hasSupported" globally on the server,
    // but to satisfy UI requirements we can flag it or let the client handle its local flag.
  } else if (action === 'update_status') {
    if (status) complaint.status = status;
    if (resolutionText !== undefined) complaint.resolutionText = resolutionText;
    if (officerName !== undefined) complaint.officerName = officerName;
  }

  complaints[index] = complaint;
  saveComplaints(complaints);
  res.json(complaints);
});

// API Route: DELETE a complaint
app.delete('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  let complaints = loadComplaints();
  const initialLength = complaints.length;
  complaints = complaints.filter(c => c.id !== id);

  if (complaints.length === initialLength) {
    return res.status(404).json({ error: "Murojaat topilmadi!" });
  }

  saveComplaints(complaints);
  res.json(complaints);
});

async function startServer() {
  // Vite integration for dev vs prod build
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Oltinko'l tumani Portali running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

