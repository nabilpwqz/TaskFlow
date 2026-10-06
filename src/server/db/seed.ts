import { getInitialStoreData, DataStore } from "./store";
import { connectToDatabase } from "./connection";
import { UserModel } from "./models/User";
import fs from "fs";
import path from "path";

async function runSeed() {
  console.log("🌱 TaskFlow Seeding Script Started...");

  const mongo = await connectToDatabase();
  const initialData = getInitialStoreData();

  if (mongo) {
    console.log("Connected to MongoDB. Seeding collections...");
    try {
      await UserModel.deleteMany({});
      for (const u of initialData.users) {
        await UserModel.create(u);
      }
      console.log(`✅ Seeded ${initialData.users.length} users to MongoDB.`);
    } catch (err: any) {
      console.error("MongoDB seed error:", err.message);
    }
  }

  // Also seed local file store if in local environment
  const DATA_DIR = path.join(process.cwd(), ".data");
  const DATA_FILE = path.join(DATA_DIR, "taskflow-store.json");

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    console.log("✅ Seeded local data store (.data/taskflow-store.json)");
  } catch (err: any) {
    console.warn("Could not write local data file (likely read-only environment):", err.message);
  }

  console.log("✨ Seeding completed successfully!");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
