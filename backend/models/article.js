const db = require('../config/firebase');
const COLLECTION = 'articles';

class Article {
  static async create(article) {
    const ref = db.collection(COLLECTION).doc();
    await ref.set(article);
    return { id: ref.id, ...article };
  }

  static async getAll() {
    const snapshot = await db.collection(COLLECTION).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByTopicsSubtopics(topics = [], subtopics = []) {
    let query = db.collection(COLLECTION);
    if (topics.length > 0) query = query.where('topic_id', 'in', topics);
    if (subtopics.length > 0) query = query.where('subtopic_id', 'in', subtopics);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Article;
