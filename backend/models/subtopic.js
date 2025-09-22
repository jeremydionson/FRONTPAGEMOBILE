const db = require('../config/firebase');
const COLLECTION = 'Subtopics';

class Subtopic {
  static async create(topic_id, name, type) {
    const ref = db.collection(COLLECTION).doc();
    await ref.set({ topic_id, name, type });
    return { id: ref.id, topic_id, name, type };
  }

  static async getByTopic(topic_id) {
    const snapshot = await db.collection(COLLECTION)
      .where('topic_id', '==', topic_id)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Subtopic;
