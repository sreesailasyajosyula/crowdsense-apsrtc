import 'dotenv/config';
import { createApp } from './app.js';
import { initFirebaseAdmin } from './config/firebaseAdmin.js';

initFirebaseAdmin();

const app = createApp();
const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`CrowdSense API running on http://localhost:${port}`);
});
