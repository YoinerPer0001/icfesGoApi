import admin from "firebase-admin";
import "dotenv/config";

if (!admin.apps.length) { // ✅ evita inicializar más de una vez
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || ""
    }),
  });
}

export default admin;