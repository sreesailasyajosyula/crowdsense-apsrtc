export type AdminCrowdLevel = 'low' | 'medium' | 'high';
export type AdminRouteStatus = 'critical' | 'moderate' | 'normal';

export type AdminRoute = {
  id: number;
  routeNo: string;
  from: { te: string; en: string };
  to: { te: string; en: string };
  crowdScore: number;
  waitingTime: number;
  standingPct: number;
  status: AdminRouteStatus;
  peakTime: { te: string; en: string };
  journeyReports: number;
};

export type HourData = {
  hour: string;
  passengers: number;
};

export type DayData = {
  day: { te: string; en: string };
  reports: number;
};

export const adminRoutes: AdminRoute[] = [
  {
    id: 1,
    routeNo: '216',
    from: { te: 'గుంటూరు', en: 'Guntur' },
    to: { te: 'విజయవాడ', en: 'Vijayawada' },
    crowdScore: 82,
    waitingTime: 18,
    standingPct: 65,
    status: 'critical',
    peakTime: { te: '8:00 – 10:00', en: '8:00 AM – 10:00 AM' },
    journeyReports: 342,
  },
  {
    id: 2,
    routeNo: '12',
    from: { te: 'బృందావన్ కాలనీ', en: 'Brundavan Colony' },
    to: { te: 'గుంటూరు', en: 'Guntur' },
    crowdScore: 78,
    waitingTime: 16,
    standingPct: 58,
    status: 'critical',
    peakTime: { te: '18:00 – 20:00', en: '6:00 PM – 8:00 PM' },
    journeyReports: 298,
  },
  {
    id: 3,
    routeNo: '201',
    from: { te: 'టెనాలి', en: 'Tenali' },
    to: { te: 'విజయవాడ', en: 'Vijayawada' },
    crowdScore: 60,
    waitingTime: 14,
    standingPct: 42,
    status: 'moderate',
    peakTime: { te: '7:30 – 9:30', en: '7:30 AM – 9:30 AM' },
    journeyReports: 211,
  },
  {
    id: 4,
    routeNo: '5K',
    from: { te: 'ఆటోనగర్', en: 'Autonagar' },
    to: { te: 'పండిట్ నెహ్రూ', en: 'Pandit Nehru' },
    crowdScore: 55,
    waitingTime: 12,
    standingPct: 35,
    status: 'moderate',
    peakTime: { te: '12:00 – 14:00', en: '12:00 PM – 2:00 PM' },
    journeyReports: 187,
  },
  {
    id: 5,
    routeNo: '333',
    from: { te: 'విశాఖపట్నం', en: 'Visakhapatnam' },
    to: { te: 'ద్వారకా నగర్', en: 'Dwaraka Nagar' },
    crowdScore: 50,
    waitingTime: 10,
    standingPct: 30,
    status: 'moderate',
    peakTime: { te: '16:00 – 18:00', en: '4:00 PM – 6:00 PM' },
    journeyReports: 156,
  },
  {
    id: 6,
    routeNo: '38',
    from: { te: 'మంగళగిరి', en: 'Mangalagiri' },
    to: { te: 'గుంటూరు', en: 'Guntur' },
    crowdScore: 28,
    waitingTime: 5,
    standingPct: 12,
    status: 'normal',
    peakTime: { te: '17:00 – 19:00', en: '5:00 PM – 7:00 PM' },
    journeyReports: 98,
  },
  {
    id: 7,
    routeNo: '77',
    from: { te: 'కోరుకొండ', en: 'Korukonda' },
    to: { te: 'రాజమండ్రి', en: 'Rajahmundry' },
    crowdScore: 22,
    waitingTime: 4,
    standingPct: 8,
    status: 'normal',
    peakTime: { te: '8:00 – 9:00', en: '8:00 AM – 9:00 AM' },
    journeyReports: 76,
  },
  {
    id: 8,
    routeNo: '9',
    from: { te: 'కార్ వర్క్స్', en: 'Car Works' },
    to: { te: 'పండిట్ నెహ్రూ', en: 'Pandit Nehru' },
    crowdScore: 30,
    waitingTime: 6,
    standingPct: 15,
    status: 'normal',
    peakTime: { te: '9:00 – 10:00', en: '9:00 AM – 10:00 AM' },
    journeyReports: 112,
  },
];

export const peakHourData: HourData[] = [
  { hour: '6 AM', passengers: 120 },
  { hour: '7 AM', passengers: 280 },
  { hour: '8 AM', passengers: 450 },
  { hour: '9 AM', passengers: 520 },
  { hour: '10 AM', passengers: 380 },
  { hour: '11 AM', passengers: 240 },
  { hour: '12 PM', passengers: 310 },
  { hour: '1 PM', passengers: 290 },
  { hour: '2 PM', passengers: 220 },
  { hour: '3 PM', passengers: 260 },
  { hour: '4 PM', passengers: 340 },
  { hour: '5 PM', passengers: 410 },
  { hour: '6 PM', passengers: 480 },
  { hour: '7 PM', passengers: 390 },
  { hour: '8 PM', passengers: 210 },
];

export const weeklyReportData: DayData[] = [
  { day: { te: 'సోమ', en: 'Mon' }, reports: 145 },
  { day: { te: 'మంగళ', en: 'Tue' }, reports: 132 },
  { day: { te: 'బుధ', en: 'Wed' }, reports: 168 },
  { day: { te: 'గురు', en: 'Thu' }, reports: 155 },
  { day: { te: 'శుక్ర', en: 'Fri' }, reports: 198 },
  { day: { te: 'శని', en: 'Sat' }, reports: 112 },
  { day: { te: 'ఆది', en: 'Sun' }, reports: 78 },
];
