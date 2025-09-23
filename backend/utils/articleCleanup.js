const admin = require("firebase-admin");

async function cleanupOldArticles(daysToKeep = 30) {
  try {
    const db = admin.firestore();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    console.log(`🧹 Cleaning up articles older than ${daysToKeep} days (before ${cutoffDate.toDateString()})...`);
    
    const snapshot = await db.collection("articles")
      .where("createdAt", "<", cutoffDate)
      .limit(500) // Process in batches
      .get();
    
    if (snapshot.empty) {
      console.log("✨ No old articles to cleanup");
      return 0;
    }
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`🗑️ Cleaned up ${snapshot.docs.length} old articles`);
    return snapshot.docs.length;
    
  } catch (error) {
    console.error("❌ Article cleanup failed:", error.message);
    return 0;
  }
}

module.exports = { cleanupOldArticles };