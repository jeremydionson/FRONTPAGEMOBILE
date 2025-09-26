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

interface Subtopic {
  id: string;
  name: string;
  description: string;
  articleCount: number;
  level: number;
  hasNiches?: boolean;
}

const healthSubtopics: Subtopic[] = [
  // New Supplements subtopic (parent for supplement niches)
  {
    id: 'supplements',
    name: 'Supplements',
    description: 'Research on dietary and nutritional supplementation',
    articleCount: 30,
    level: 1,
    hasNiches: true, // Dietary Supplements, Nutritional Supplements
  },
  {
    id: 'general-health',
    name: 'General Health',
    description: 'Broad health topics, wellness trends, and medical insights',
    articleCount: 34,
    level: 0,
  },
  {
    id: 'biohacking',
    name: 'Biohacking',
    description: 'Optimize your body and mind through science-backed methods',
    articleCount: 15,
    level: 1,
  },
  {
    id: 'gut-health',
    name: 'Gut Health',
    description: 'Microbiome, digestion, and gastrointestinal wellness',
    articleCount: 15,
    level: 1,
    hasNiches: true, // Psoriasis is a niche under Gut Health
  },
  {
    id: 'longevity-science',
    name: 'Longevity Science',
    description: 'Anti-aging research, lifespan extension, and healthspan',
    articleCount: 15,
    level: 1,
  },
  {
    id: 'mental-health',
    name: 'Mental Health',
    description: 'Psychology, psychiatry, cognitive wellness, and brain health',
    articleCount: 15,
    level: 1,
    hasNiches: true, // Anxiety & Stress, Depression Research
  },
  {
    id: 'sleep-optimization',
    name: 'Sleep Optimization',
    description: 'Sleep science, circadian rhythms, and rest quality',
    articleCount: 15,
    level: 1,
    hasNiches: true, // Sleep Disorders, Sleep Research
  },
];

export default function Subtopics() {
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);

  const handleSubtopicToggle = (subtopicId: string) => {
    if (selectedSubtopics.includes(subtopicId)) {
      setSelectedSubtopics(selectedSubtopics.filter(id => id !== subtopicId));
    } else {
      setSelectedSubtopics([...selectedSubtopics, subtopicId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedSubtopics.length === healthSubtopics.length) {
      setSelectedSubtopics([]);
    } else {
      setSelectedSubtopics(healthSubtopics.map(s => s.id));
    }
  };

  const handleContinue = () => {
    if (selectedSubtopics.length === 0) {
      Alert.alert('Select Subtopics', 'Please select at least one subtopic to continue.');
      return;
    }

    // TODO: Save selected subtopics to user preferences

    // Check if any selected subtopics have niches
    const selectedWithNiches = healthSubtopics
      .filter(s => selectedSubtopics.includes(s.id) && s.hasNiches)
      .map(s => s.name);

    if (selectedWithNiches.length > 0) {
      // Pass selected subtopics that have niches to the niche screen
      const subtopicsParam = encodeURIComponent(selectedWithNiches.join(','));
      router.push(`/niche?subtopics=${subtopicsParam}`);
    } else {
      router.push('/loading');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Subtopics</Text>
        <Text style={styles.subtitle}>
          Choose specific areas within Health that interest you most
        </Text>
      </View>

      {/* Select All Toggle */}
      <View style={styles.selectAllContainer}>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={handleSelectAll}
        >
          <View style={[
            styles.checkbox,
            selectedSubtopics.length === healthSubtopics.length && styles.checkboxSelected
          ]}>
            {selectedSubtopics.length === healthSubtopics.length && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          <Text style={styles.selectAllText}>
            {selectedSubtopics.length === healthSubtopics.length ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Subtopics List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.subtopicsList}>
          {healthSubtopics.map((subtopic) => (
            <TouchableOpacity
              key={subtopic.id}
              style={styles.subtopicItem}
              onPress={() => handleSubtopicToggle(subtopic.id)}
            >
              <View style={styles.subtopicContent}>
                <View style={styles.subtopicHeader}>
                  <View style={[
                    styles.checkbox,
                    selectedSubtopics.includes(subtopic.id) && styles.checkboxSelected
                  ]}>
                    {selectedSubtopics.includes(subtopic.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <View style={styles.subtopicInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.subtopicName}>{subtopic.name}</Text>
                      {subtopic.hasNiches && (
                        <View style={styles.nicheIndicator}>
                          <Text style={styles.nicheIndicatorText}>+</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <Text style={styles.subtopicDescription}>
                  {subtopic.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSubtopics.length === 0 && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={selectedSubtopics.length === 0}
        >
          <Text style={[
            styles.continueButtonText,
            selectedSubtopics.length === 0 && styles.disabledButtonText,
          ]}>
            Continue ({selectedSubtopics.length})
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
    paddingBottom: 24,
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
  selectAllContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  selectAllText: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '500',
    marginLeft: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  subtopicsList: {
    paddingHorizontal: 24,
  },
  subtopicItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  subtopicContent: {
    flex: 1,
  },
  subtopicHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subtopicInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtopicName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  nicheIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff9800',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  nicheIndicatorText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  articleCount: {
    fontSize: 14,
    color: '#666',
  },
  subtopicDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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