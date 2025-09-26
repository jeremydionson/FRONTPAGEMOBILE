import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MainFeed() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:3001/search');
      const data = await response.json();
      setArticles(data.articles || []); // Extract articles from response
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FRONT PAGE</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FRONT PAGE</Text>
      </View>

      {/* Feed */}
      <ScrollView style={styles.feed}>
        {articles.map((article, index) => (
          <View key={index} style={styles.articleContainer}>
            {/* Article Header */}
            <View style={styles.articleHeader}>
              <Text style={styles.displayTitle}>{article.displayTitle || article.title}</Text>
              <Text style={styles.displaySource}>{article.displaySource || article.source}</Text>
            </View>

            {/* Article Image */}
            <Image
              source={{ uri: article.imageUrl || `https://picsum.photos/800/600?random=${index}` }}
              style={styles.articleImage}
            />

            {/* Article Caption */}
            <View style={styles.captionContainer}>
              <Text style={styles.displayCaption}>
                {article.displayCaption || article.description || article.AI_summary || article.title}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  feed: {
    flex: 1,
  },
  articleContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  articleHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  displayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  displaySource: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  articleImage: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#f0f0f0',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  displayCaption: {
    fontSize: 14,
    lineHeight: 18,
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});