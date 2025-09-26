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

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Start entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Check auth status and navigate after delay
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Implement actual auth check
      // For now, simulate checking authentication
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if user is authenticated (stub)
      const isAuthenticated = false; // Replace with actual auth check

      if (isAuthenticated) {
        router.replace('/feed');
      } else {
        router.replace('/signin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, default to sign in
      router.replace('/signin');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Main Logo */}
          <Text style={styles.title}>FRONT PAGE</Text>

          {/* Tagline */}
          <Text style={styles.tagline}>Your personalized news feed</Text>

          {/* Loading indicator */}
          <View style={styles.loadingContainer}>
            <View style={styles.loadingDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </Animated.View>
      </View>

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
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: -2,
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  loadingContainer: {
    marginTop: 32,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4285f4',
    marginHorizontal: 4,
  },
  dot1: {
    animationDelay: '0ms',
  },
  dot2: {
    animationDelay: '150ms',
  },
  dot3: {
    animationDelay: '300ms',
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

// Add pulsing animation for dots
const DotAnimationStyles = StyleSheet.create({
  '@keyframes pulse': {
    '0%, 80%, 100%': {
      transform: [{ scale: 0 }],
      opacity: 1,
    },
    '40%': {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
  },
});