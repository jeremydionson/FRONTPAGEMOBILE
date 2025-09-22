const db = require('../config/firebase');
const COLLECTION = 'SubtopicFeeds';

class SubtopicFeed {
  static async create(subtopic_id, feed_url) {
    const ref = db.collection(COLLECTION).doc();
    await ref.set({
      subtopic_id,
      feed_url,
      last_checked: null,
      status: 'active'
    });
    return { id: ref.id, subtopic_id, feed_url, status: 'active' };
  }

  static async getActiveFeeds() {
    const snapshot = await db.collection(COLLECTION)
      .where('status', '==', 'active')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async updateStatus(feed_id, status) {
    await db.collection(COLLECTION).doc(feed_id).update({ status });
  }
}

module.exports = SubtopicFeed;
