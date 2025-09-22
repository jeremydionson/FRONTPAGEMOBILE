const db = require('../config/firebase');
const COLLECTION = 'Topics';

class Topic {
  static async create(name) {
    const ref = db.collection(COLLECTION).doc();
    await ref.set({ name });
    return { id: ref.id, name };
  }

  static async getAll() {
    const snapshot = await db.collection(COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Topic;
