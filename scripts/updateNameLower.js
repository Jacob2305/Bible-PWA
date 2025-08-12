// scripts/updateNameLower.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read service account key file
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "../serviceAccountKey.json"), "utf-8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateNameLower() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();

  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const name = data.name;
    if (!name || data.nameLower) continue;

    await doc.ref.update({
      nameLower: name.toLowerCase(),
    });

    console.log(`Updated ${doc.id} → nameLower: ${name.toLowerCase()}`);
    count++;
  }

  console.log(`✅ Finished. Updated ${count} users.`);
}

updateNameLower().catch(console.error);
