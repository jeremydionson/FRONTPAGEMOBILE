import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

interface NicheOption {
  id: string;
  name: string;
  parentSubtopic: string;
  description: string;
  articleCount?: number;
  available: boolean;
}

const nicheOptions: NicheOption[] = [
  // Mental Health niches
  {
    id: 'anxiety-stress',
    name: 'Anxiety & Stress',
    parentSubtopic: 'Mental Health',
    description: 'Clinical research on anxiety disorders, stress management, and therapeutic approaches',
    available: false,
  },
  {
    id: 'depression-research',
    name: 'Depression Research',
    parentSubtopic: 'Mental Health',
    description: 'Latest studies on depression, treatment methods, and neurological insights',
    available: false,
  },

  // Gut Health niches
  {
    id: 'psoriasis',
    name: 'Psoriasis',
    parentSubtopic: 'Gut Health',
    description: 'Research connecting gut health to skin conditions and autoimmune responses',
    articleCount: 15,
    available: true,
  },
  {
    id: 'microbiome-research',
    name: 'Microbiome Research',
    parentSubtopic: 'Gut Health',
    description: 'Cutting-edge studies on gut bacteria, microbiome diversity, and health impacts',
    available: false,
  },
  {
    id: 'probiotics-prebiotics',
    name: 'Probiotics & Prebiotics',
    parentSubtopic: 'Gut Health',
    description: 'Evidence-based research on beneficial bacteria and prebiotic fiber effects',
    available: false,
  },

  // Sleep Optimization niches
  {
    id: 'sleep-disorders',
    name: 'Sleep Disorders',
    parentSubtopic: 'Sleep Optimization',
    description: 'Clinical studies on insomnia, sleep apnea, and other sleep-related conditions',
    available: false,
  },
  {
    id: 'sleep-research',
    name: 'Sleep Research',
    parentSubtopic: 'Sleep Optimization',
    description: 'Circadian rhythm research, sleep quality studies, and optimization techniques',
    available: false,
  },

  // Supplements niches
  {
    id: 'dietary-supplements',
    name: 'Dietary Supplements',
    parentSubtopic: 'Supplements',
    description: 'Clinical trials and research on vitamins, minerals, and dietary supplements',
    articleCount: 15,
    available: true,
  },
  {
    id: 'nutritional-supplements',
    name: 'Nutritional Supplements',
    parentSubtopic: 'Supplements',
    description: 'Evidence-based studies on nutritional supplementation and health outcomes',
    articleCount: 15,
    available: true,
  },
];

export default function Niche() {
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [filteredNiches, setFilteredNiches] = useState<NicheOption[]>([]);
  const { subtopics } = useLocalSearchParams();

  useEffect(() => {
    // Parse selected subtopics from URL parameters
    if (subtopics && typeof subtopics === 'string') {
      const selectedSubtopics = decodeURIComponent(subtopics).split(',');
      console.log('Selected subtopics from URL:', selectedSubtopics);

      // Filter niches to only show those for selected subtopics
      const relevantNiches = nicheOptions.filter(niche => {
        const isRelevant = selectedSubtopics.includes(niche.parentSubtopic);
        console.log(`Niche ${niche.name} (parent: ${niche.parentSubtopic}) - relevant:`, isRelevant);
        return isRelevant;
      });

      console.log('Filtered niches:', relevantNiches.map(n => n.name));
      setFilteredNiches(relevantNiches);
    } else {
      // Fallback: show all niches if no parameters
      console.log('No subtopics parameter, showing all niches');
      setFilteredNiches(nicheOptions);
    }
  }, [subtopics]);

  // Group filtered niches by parent subtopic
  const groupedNiches = filteredNiches.reduce((groups, niche) => {
    const parent = niche.parentSubtopic;
    if (!groups[parent]) {
      groups[parent] = [];
    }
    groups[parent].push(niche);
    return groups;
  }, {} as Record<string, NicheOption[]>);

  const handleNicheToggle = (nicheId: string) => {
    const niche = filteredNiches.find(n => n.id === nicheId);
    if (!niche?.available) {
      return; // Don't allow selection of unavailable niches
    }

    if (selectedNiches.includes(nicheId)) {
      setSelectedNiches(selectedNiches.filter(id => id !== nicheId));
    } else {
      setSelectedNiches([...selectedNiches, nicheId]);
    }
  };

  const handleTimeToExplore = () => {
    // TODO: Save selected niches to user preferences
    router.push('/loading');
  };

  const availableCount = selectedNiches.filter(id => {
    const niche = filteredNiches.find(n => n.id === id);
    return niche?.available;
  }).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Niches</Text>
        <Text style={styles.subtitle}>
          Dive deeper into specialized areas that interest you most
        </Text>
      </View>

      {/* Niche Groups */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.nichesList}>
          {Object.entries(groupedNiches).map(([parentSubtopic, niches]) => (
            <View key={parentSubtopic} style={styles.nicheGroup}>
              <Text style={styles.groupTitle}>{parentSubtopic}</Text>

              {niches.map((niche) => (
                <TouchableOpacity
                  key={niche.id}
                  style={[
                    styles.nicheItem,
                    selectedNiches.includes(niche.id) && styles.selectedNiche,
                    !niche.available && styles.disabledNiche,
                  ]}
                  onPress={() => handleNicheToggle(niche.id)}
                  disabled={!niche.available}
                >
                  <View style={styles.nicheContent}>
                    <View style={styles.nicheHeader}>
                      <View style={[
                        styles.checkbox,
                        selectedNiches.includes(niche.id) && styles.checkboxSelected,
                        !niche.available && styles.checkboxDisabled,
                      ]}>
                        {selectedNiches.includes(niche.id) && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <View style={styles.nicheInfo}>
                        <Text style={[
                          styles.nicheName,
                          !niche.available && styles.disabledText,
                        ]}>
                          {niche.name}
                        </Text>
                        {niche.available && niche.articleCount ? (
                          <Text style={styles.articleCount}>
                            {niche.articleCount} articles
                          </Text>
                        ) : (
                          <Text style={styles.comingSoon}>Coming Soon</Text>
                        )}
                      </View>
                    </View>
                    <Text style={[
                      styles.nicheDescription,
                      !niche.available && styles.disabledText,
                    ]}>
                      {niche.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={handleTimeToExplore}
        >
          <Text style={styles.exploreButtonText}>
            Time to Explore {availableCount > 0 ? `(${availableCount})` : ''}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          You can always adjust your preferences later in settings
        </Text>
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
  scrollContainer: {
    flex: 1,
  },
  nichesList: {
    paddingHorizontal: 24,
  },
  nicheGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  nicheItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedNiche: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  disabledNiche: {
    backgroundColor: '#f5f5f5',
    opacity: 0.6,
  },
  nicheContent: {
    flex: 1,
  },
  nicheHeader: {
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
  checkboxDisabled: {
    borderColor: '#ccc',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nicheInfo: {
    flex: 1,
  },
  nicheName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  disabledText: {
    color: '#999',
  },
  articleCount: {
    fontSize: 12,
    color: '#666',
  },
  comingSoon: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  nicheDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  exploreButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});