import { Complaint, MahallaConfig, ProblemCategory } from './types';

export const OLTINKOL_MAHALLALARI: MahallaConfig[] = [
  { name: "Oltinko'l MFY", slug: "oltinkol-mfy", population: 4200 },
  { name: "Qo'shtepa MFY", slug: "qoshtepa", population: 3100 },
  { name: "Bo'ston MFY", slug: "boston", population: 2800 },
  { name: "Jalabek MFY", slug: "jalabek", population: 3500 },
  { name: "Ittifoq MFY", slug: "ittifoq", population: 1950 },
  { name: "Markaz MFY", slug: "markaz", population: 4800 },
  { name: "Madaniyat MFY", slug: "madaniyat", population: 2100 },
  { name: "Kumko'cha MFY", slug: "kumkocha", population: 1800 },
  { name: "Orol MFY", slug: "orol", population: 1650 },
  { name: "Maslahat MFY", slug: "maslahat", population: 2400 },
  { name: "Ravon MFY", slug: "ravon", population: 3200 },
  { name: "Sadda MFY", slug: "sadda", population: 2900 },
  { name: "Sujiy MFY", slug: "sujiy", population: 1750 },
  { name: "Ipak Yo'li MFY", slug: "ipak-yoli", population: 2250 },
];

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    title: "Tabiiy gaz va isitish",
    icon: "Flame",
    description: "Gaz bosimi pastligi, gaz quvurlaridagi nosozliklar yoki gaz ta'minotidagi uzilishlar.",
    commonIssues: [
      "Gaz bosimi juda past, ovqat pishirish qiyin bo'lmoqda",
      "Mahallaga tabiiy gaz kelmayapti (uzilishlar bor)",
      "Gaz quvuridan sizib chiqish yoki nosozlik bor",
      "Kuz-qish mavsumida isitish tizimi yetarli darajada ishlamayapti"
    ]
  },
  {
    title: "Ichimlik suvi ta'minoti",
    icon: "Droplets",
    description: "Ichimlik suvi yetishmovchiligi, quvurlar yorilishi va suv bosimi.",
    commonIssues: [
      "Mahallada ichimlik suvi yetishmovchiligi bo'lyapti (suv kelmayapti)",
      "Suv bosimi juda past (yuqori xonadonlarga chiqmayapti)",
      "Markaziy suv quvuri yorilgan, ko'chada suv isrof bo'lyapti",
      "Ichimlik suvi sifati past yoki loyqa kelmoqda"
    ]
  },
  {
    title: "Elektr energiyasi",
    icon: "Zap",
    description: "Elektr tarmog'idagi tez-tez uzilishlar, transformator va eskirgan ustunlar muammolari.",
    commonIssues: [
      "Tez-tez elektr energiyasi ro'yxatdan tashqari o'chadi",
      "Ko'chadagi elektr simyog'ochlar (ustunlar) eskirgan va yiqilish xavfi bor",
      "Kuchlanish (voltaj) o'ta past, maishiy texnika ishlamayapti",
      "Transformator quvvati yetishmayapti yoki yonib ketgan"
    ]
  },
  {
    title: "Yo'l va transport infratuzilmasi",
    icon: "MapPin",
    description: "Yo'llarning ta'mirtalabligi, trotuarlar yo'qligi va jamoat transporti qatnovi.",
    commonIssues: [
      "Asosiy yoki ichki yo'llarda chuqurliklar ko'p, asfaltlash kerak",
      "Yomg'ir yoqqanda ko'chalardan yurib bo'lmaydi (loyiq ko'cha)",
      "Yo'laklar (trotuarlar) yo'q, piyodalar yo'lda yurishga majbur",
      "Jamoat transporti (avtobus/marshrutka) qatnovi tartibsiz yoki yo'q"
    ]
  },
  {
    title: "Ko'chalarni yoritish va elektr simlari",
    icon: "Lightbulb",
    description: "Tungi yoritish tizimi ishlamasligi natijasidagi xavfsizlik muammolari.",
    commonIssues: [
      "Kechasi ko'chalar butunlay qorong'u, yoritish chiroqlari yo'q",
      "O'rnatilgan ko'cha chiroqlari yonib ketgan, ta'mirlanmagan",
      "Yoritish ustunlari o'rnatish lozim"
    ]
  },
  {
    title: "Sog'liqni saqlash va dorixonalar",
    icon: "HeartPulse",
    description: "Tibbiyot maskanlari yoki dorixonalar yetishmasligi muammolari.",
    commonIssues: [
      "Mahallada tez tibbiy yordam punkti yo'qligi",
      "Eng yaqin dorixona uzoqda joylashgan, dorilar qidirish muammo",
      "SVP (qishloq vrachlik punkti)da shifokorlar yetishmasligi"
    ]
  },
  {
    title: "Chiqindi va tozalash ishlari",
    icon: "Trash2",
    description: "Chiqindilarni o'z vaqtida olib ketmaslik va ekologik holat.",
    commonIssues: [
      "Moxovxona yoki chiqindi punktidan chiqindi haftalab olib ketilmayapti",
      "Noqonuniy joylarga chiqindi to'plash yoki chiqindini yoqish",
      "Chiqindi konteynerlari yetishmasligi yoki yaroqsiz holatda"
    ]
  },
  {
    title: "Ariqlar va drenaj tizimi",
    icon: "Waves",
    description: "Sug'orish ariqlari yo'qligi yoki ularning to'lib qolishi muammolari.",
    commonIssues: [
      "Ariqlar loy va chiqindiga to'lgan, suv o'tmayapti",
      "Drenaj tizimi yo'qligi sabab yerto'lalarga suv sizib kirmoqda",
      "Ekinlarni sug'orish uchun ariq suvi yetishmovchiligi"
    ]
  },
  {
    title: "Ta'lim va Bolalar maydonchasi",
    icon: "BookOpen",
    description: "Maktabgacha ta'lim, maktablar va bolalar bo'sh vaqtini mazmunli tashkil etish.",
    commonIssues: [
      "Bolalar o'yin maydonchasi yo'q yoki butunlay buzilgan",
      "Mahalladagi bog'chada o'rinlar yetarli emas",
      "Maktab yo'li xavfli bo'lib, svetofor yoki piyodalar o'tish joyi yo'q"
    ]
  },
  {
    title: "Internet va Aloqa",
    icon: "Wifi",
    description: "Sifatli telefon aloqasi va tezkor internet yetishmovchiligi.",
    commonIssues: [
      "Simli internet (GPON / optika) tarmog'i kelmagan",
      "Mobil aloqa sifati juda yomon yoki tarmoq mutlaqo yo'q",
      "Internet tezligi o'ta sekin va tez-tez uziladi"
    ]
  }
];

export const OFFICIAL_NAMES = [
  "Sardorbek Alimov — MFY Raisi",
  "Nodirbek Karimov — Muhandis-gazchi",
  "Sherzodbek Tojiboyev — Suv ta'minoti boshlig'i",
  "Otabek Yo'ldoshev — Hokim yordamchisi",
  "Zafarbek Orifov — Obodonlashtirish bo'limi",
  "Dilshodbek Tursunov — Mahalla Xotin-qizlar faoli",
  "Baxtiyorbjon Dadajonov — Yoshlar yetakchisi"
];

// Seed complaints from realistic scenarios
export const PRE_SEEDED_COMPLAINTS = (now: Date): Complaint[] => {
  const getPastDateStr = (daysAgo: number) => {
    const d = new Date(now);
    d.setMinutes(d.getMinutes() - daysAgo * 1440 - (daysAgo * 30)); // make it slightly offset
    return d.toISOString();
  };

  const getDeadlineStr = (createdAtStr: string) => {
    const d = new Date(createdAtStr);
    d.setDate(d.getDate() + 3); // 3 days deadline
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
      createdAt: getPastDateStr(1.2), // ~28 hours ago
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
      createdAt: getPastDateStr(0.5), // 12 hours ago
      status: "Qabul qilindi",
      deadlineAt: getDeadlineStr(getPastDateStr(0.5)),
      isFree: true,
      officerName: "Nodirbek Karimov — Muhandis-gazchi",
      resolutionText: "Murojaat ro'yxatga olindi. 'Oltinko'ltumangaz' xodimlari gaz taqsimlash punktlaridagi bosimni o'lchashmoqda. 3 kun muddat ichida bosimni tartibga solish chorasi ko'riladi.",
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
      createdAt: getPastDateStr(2.8), // almost 3 days ago, almost solved
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
      createdAt: getPastDateStr(0.1), // Just now
      status: "Qabul qilindi",
      deadlineAt: getDeadlineStr(getPastDateStr(0.1)),
      isFree: true,
      officerName: "Otabek Yo'ldoshev — Hokim yordamchisi",
      resolutionText: "Ushbu murojaat hududiy elektr tarmoqlari korxonasiga yo'naltirildi va mas'ul tayinlandi. 3 kunlik muddat doirasida ko'cha chiroqlari texnik ko'rikdan o'tkazilib, ishga tushiriladi.",
      supportCount: 4,
    }
  ];
};
