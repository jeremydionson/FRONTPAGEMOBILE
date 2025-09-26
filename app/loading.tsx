import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Loading() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [progressAnim] = useState(new Animated.Value(0));
  const [dotAnim1] = useState(new Animated.Value(0));
  const [dotAnim2] = useState(new Animated.Value(0));
  const [dotAnim3] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations
    startAnimations();

    // Navigate to feed after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/feed');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const startAnimations = () => {
    // Fade in main content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Pulsing dots animation
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start dot animations with staggered delays
    createPulseAnimation(dotAnim1, 0).start();
    createPulseAnimation(dotAnim2, 150).start();
    createPulseAnimation(dotAnim3, 300).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Loading Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📰</Text>
        </View>

        {/* Main Message */}
        <Text style={styles.title}>Getting your personalized feed ready...</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Loading Steps */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepText}>✓ Analyzing your preferences</Text>
          <Text style={styles.stepText}>✓ Curating relevant articles</Text>
          <Text style={styles.stepText}>⏳ Preparing your feed</Text>
        </View>

        {/* Animated Dots */}
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dotAnim1,
                transform: [
                  {
                    scale: dotAnim1.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dotAnim2,
                transform: [
                  {
                    scale: dotAnim2.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: dotAnim3,
                transform: [
                  {
                    scale: dotAnim3.interpolate({
                      inputRange: [0.3, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by AI</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196f3',
    borderRadius: 2,
  },
  stepsContainer: {
    alignItems: 'flex-start',
    marginBottom: 48,
  },
  stepText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'left',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196f3',
    marginHorizontal: 6,
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});