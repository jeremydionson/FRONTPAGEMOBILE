const db = require('../config/firebase');
const COLLECTION = 'Follows';

class Follow {
  static async add(user_id, subtopic_id, follow_type) {
    const ref = db.collection(COLLECTION).doc();
    await ref.set({ user_id, subtopic_id, follow_type });
    return { id: ref.id, user_id, subtopic_id, follow_type };
  }

  static async getByUser(user_id) {
    const snapshot = await db.collection(COLLECTION)
      .where('user_id', '==', user_id)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Follow;
