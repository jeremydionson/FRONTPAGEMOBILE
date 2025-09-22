const admin = require('firebase-admin');
const db = admin.firestore(); // Make sure firebase-admin is initialized elsewhere

const COLLECTION = 'users';

class User {
  // Create a new user from Google signup
  static async createFromGoogle(user) {
    const ref = db.collection(COLLECTION).doc(user.uid);

    await ref.set({
      name: user.displayName,
      email: user.email,
      selected_topics: [],
      selected_subtopics: [],
      selected_niches: [],
      saved_content: [],
      selected_subscriptions: [] // New field
    });

    const doc = await ref.get();
    return { id: doc.id, ...doc.data() };
  }

  // Get user by ID
  static async getById(uid) {
    const ref = db.collection(COLLECTION).doc(uid);
    const doc = await ref.get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Update user fields
  static async update(uid, data) {
    const ref = db.collection(COLLECTION).doc(uid);

    // Only update allowed fields
    const allowedFields = [
      'selected_topics',
      'selected_subtopics',
      'selected_niches',
      'saved_content',
      'selected_subscriptions'
    ];

    const updateData = {};
    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    await ref.update(updateData);
    const updatedDoc = await ref.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  }
}

module.exports = User;
