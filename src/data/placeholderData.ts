export type CrowdLevel = 'low' | 'medium' | 'high' | 'very-high';

export type RouteInfo = {
  id: number;
  routeNo: string;
  from: { te: string; en: string };
  to: { te: string; en: string };
  crowd: CrowdLevel;
  crowdScore: number;
  peakTime: { te: string; en: string };
  bestTime: { te: string; en: string };
  avgWaiting: number;
};

export type JourneyRecord = {
  id: number;
  date: string;
  routeNo: string;
  from: { te: string; en: string };
  to: { te: string; en: string };
  crowd: CrowdLevel;
  time: string;
  waitingTime: number;
  standing: boolean;
};

export const routes: RouteInfo[] = [
  {
    id: 1,
    routeNo: '216',
    from: { te: 'గుంటూరు బస్ స్టేషన్', en: 'Guntur Bus Station' },
    to: { te: 'విజయవాడ బస్ స్టేషన్', en: 'Vijayawada Bus Station' },
    crowd: 'high',
    crowdScore: 82,
    peakTime: { te: 'ఉదయం 8:00 – 10:00', en: '8:00 AM – 10:00 AM' },
    bestTime: { te: 'ఉదయం 11:00', en: '11:00 AM' },
    avgWaiting: 18,
  },
  {
    id: 2,
    routeNo: '5K',
    from: { te: 'ఆటోనగర్', en: 'Autonagar' },
    to: { te: 'పండిట్ నెహ్రూ బస్ స్టేషన్', en: 'Pandit Nehru Bus Station' },
    crowd: 'medium',
    crowdScore: 55,
    peakTime: { te: 'మధ్యాహ్నం 12:00 – 2:00', en: '12:00 PM – 2:00 PM' },
    bestTime: { te: 'మధ్యాహ్నం 3:00', en: '3:00 PM' },
    avgWaiting: 12,
  },
  {
    id: 3,
    routeNo: '38',
    from: { te: 'మంగళగిరి', en: 'Mangalagiri' },
    to: { te: 'గుంటూరు బస్ స్టేషన్', en: 'Guntur Bus Station' },
    crowd: 'low',
    crowdScore: 28,
    peakTime: { te: 'సాయంత్రం 5:00 – 7:00', en: '5:00 PM – 7:00 PM' },
    bestTime: { te: 'ఉదయం 9:00', en: '9:00 AM' },
    avgWaiting: 5,
  },
  {
    id: 4,
    routeNo: '201',
    from: { te: 'టెనాలి', en: 'Tenali' },
    to: { te: 'విజయవాడ బస్ స్టేషన్', en: 'Vijayawada Bus Station' },
    crowd: 'medium',
    crowdScore: 60,
    peakTime: { te: 'ఉదయం 7:30 – 9:30', en: '7:30 AM – 9:30 AM' },
    bestTime: { te: 'మధ్యాహ్నం 1:00', en: '1:00 PM' },
    avgWaiting: 14,
  },
  {
    id: 5,
    routeNo: '12',
    from: { te: 'బృందావన్ కాలనీ', en: 'Brundavan Colony' },
    to: { te: 'గుంటూరు బస్ స్టేషన్', en: 'Guntur Bus Station' },
    crowd: 'high',
    crowdScore: 78,
    peakTime: { te: 'సాయంత్రం 6:00 – 8:00', en: '6:00 PM – 8:00 PM' },
    bestTime: { te: 'ఉదయం 10:00', en: '10:00 AM' },
    avgWaiting: 16,
  },
  {
    id: 6,
    routeNo: '77',
    from: { te: 'కోరుకొండ', en: 'Korukonda' },
    to: { te: 'రాజమండ్రి బస్ స్టేషన్', en: 'Rajahmundry Bus Station' },
    crowd: 'low',
    crowdScore: 22,
    peakTime: { te: 'ఉదయం 8:00 – 9:00', en: '8:00 AM – 9:00 AM' },
    bestTime: { te: 'మధ్యాహ్నం 2:00', en: '2:00 PM' },
    avgWaiting: 4,
  },
  {
    id: 7,
    routeNo: '333',
    from: { te: 'విశాఖపట్నం బస్ స్టేషన్', en: 'Visakhapatnam Bus Station' },
    to: { te: 'ద్వారకా నగర్', en: 'Dwaraka Nagar' },
    crowd: 'medium',
    crowdScore: 50,
    peakTime: { te: 'సాయంత్రం 4:00 – 6:00', en: '4:00 PM – 6:00 PM' },
    bestTime: { te: 'ఉదయం 11:30', en: '11:30 AM' },
    avgWaiting: 10,
  },
  {
    id: 8,
    routeNo: '9',
    from: { te: 'కార్ వర్క్స్', en: 'Car Works' },
    to: { te: 'పండిట్ నెహ్రూ బస్ స్టేషన్', en: 'Pandit Nehru Bus Station' },
    crowd: 'low',
    crowdScore: 30,
    peakTime: { te: 'ఉదయం 9:00 – 10:00', en: '9:00 AM – 10:00 AM' },
    bestTime: { te: 'మధ్యాహ్నం 12:30', en: '12:30 PM' },
    avgWaiting: 6,
  },
];

export const myJourneys: JourneyRecord[] = [
  {
    id: 1,
    date: '2024-07-22',
    routeNo: '216',
    from: { te: 'గుంటూరు బస్ స్టేషన్', en: 'Guntur Bus Station' },
    to: { te: 'విజయవాడ బస్ స్టేషన్', en: 'Vijayawada Bus Station' },
    crowd: 'high',
    time: '08:30',
    waitingTime: 20,
    standing: true,
  },
  {
    id: 2,
    date: '2024-07-20',
    routeNo: '38',
    from: { te: 'మంగళగిరి', en: 'Mangalagiri' },
    to: { te: 'గుంటూరు బస్ స్టేషన్', en: 'Guntur Bus Station' },
    crowd: 'low',
    time: '17:45',
    waitingTime: 5,
    standing: false,
  },
  {
    id: 3,
    date: '2024-07-18',
    routeNo: '5K',
    from: { te: 'ఆటోనగర్', en: 'Autonagar' },
    to: { te: 'పండిట్ నెహ్రూ బస్ స్టేషన్', en: 'Pandit Nehru Bus Station' },
    crowd: 'medium',
    time: '09:15',
    waitingTime: 12,
    standing: true,
  },
  {
    id: 4,
    date: '2024-07-15',
    routeNo: '201',
    from: { te: 'టెనాలి', en: 'Tenali' },
    to: { te: 'విజయవాడ బస్ స్టేషన్', en: 'Vijayawada Bus Station' },
    crowd: 'medium',
    time: '14:00',
    waitingTime: 10,
    standing: false,
  },
  {
    id: 5,
    date: '2024-07-12',
    routeNo: '12',
    from: { te: 'బృందావన్ కాలనీ', en: 'Brundavan Colony' },
    to: { te: 'గుంటూరు బస్ స్టేషన్', en: 'Guntur Bus Station' },
    crowd: 'high',
    time: '18:30',
    waitingTime: 25,
    standing: true,
  },
  {
    id: 6,
    date: '2024-07-10',
    routeNo: '333',
    from: { te: 'విశాఖపట్నం బస్ స్టేషన్', en: 'Visakhapatnam Bus Station' },
    to: { te: 'ద్వారకా నగర్', en: 'Dwaraka Nagar' },
    crowd: 'low',
    time: '11:00',
    waitingTime: 4,
    standing: false,
  },
];
