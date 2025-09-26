import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

interface Topic {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  articleCount?: number;
}

const topics: Topic[] = [
  {
    id: 'health',
    name: 'Health',
    icon: '🏥',
    available: true,
    articleCount: 154,
  },
  {
    id: 'tech',
    name: 'Tech & Gadgets',
    icon: '💻',
    available: false,
  },
  {
    id: 'finance',
    name: 'Finance & Investing',
    icon: '💰',
    available: false,
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    available: false,
  },
  {
    id: 'news',
    name: 'News',
    icon: '📰',
    available: false,
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    available: false,
  },
  {
    id: 'food',
    name: 'Food',
    icon: '🍽️',
    available: false,
  },
  {
    id: 'cars',
    name: 'Cars',
    icon: '🚗',
    available: false,
  },
  {
    id: 'watches',
    name: 'Watches',
    icon: '⌚',
    available: false,
  },
];

export default function TopicSelection() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicPress = (topic: Topic) => {
    if (!topic.available) {
      Alert.alert(
        'Coming Soon',
        `${topic.name} articles are being processed and will be available soon!`
      );
      return;
    }

    if (selectedTopics.includes(topic.id)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topic.id));
    } else {
      setSelectedTopics([...selectedTopics, topic.id]);
    }
  };

  const handleContinue = () => {
    if (selectedTopics.length === 0) {
      Alert.alert('Select Topics', 'Please select at least one topic to continue.');
      return;
    }

    // TODO: Save selected topics to user preferences
    router.push('/subtopics');
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Topics</Text>
        <Text style={styles.subtitle}>
          Select the topics that interest you most to personalize your feed
        </Text>
      </View>

      {/* Topics Grid */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.topicsGrid}>
          {topics.map((topic, index) => (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.topicCard,
                selectedTopics.includes(topic.id) && styles.selectedCard,
                !topic.available && styles.disabledCard,
              ]}
              onPress={() => handleTopicPress(topic)}
              disabled={false} // Allow pressing to show coming soon message
            >
              <Text style={[
                styles.topicIcon,
                !topic.available && styles.disabledIcon,
              ]}>
                {topic.icon}
              </Text>
              <Text style={[
                styles.topicName,
                selectedTopics.includes(topic.id) && styles.selectedText,
                !topic.available && styles.disabledText,
              ]}>
                {topic.name}
              </Text>
              {!topic.available && (
                <Text style={styles.comingSoon}>Coming Soon</Text>
              )}
              {selectedTopics.includes(topic.id) && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedTopics.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedTopics.length === 0}
        >
          <Text style={[
            styles.continueButtonText,
            selectedTopics.length === 0 && styles.disabledButtonText,
          ]}>
            Continue ({selectedTopics.length})
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  topicCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  disabledCard: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  topicIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedText: {
    color: '#2196f3',
  },
  disabledText: {
    color: '#999',
  },
  articleCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#999',
  },
});