import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

// const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading/splash time
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={Colors.light.gradient}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Poth</Text>
          <Ionicons name="globe-outline" size={40} color="white" style={styles.logoIcon} />
        </View>
        <Text style={styles.headline}>
          Connecting Book Lovers{"\n"}with Their Next Great Read.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 72,
    color: 'white',
    fontWeight: '900',
    fontStyle: 'italic',
    marginRight: 10,
  },
  logoIcon: {
    marginTop: 10,
  },
  headline: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    lineHeight: 34,
    fontWeight: '400',
    opacity: 0.9,
  },
});
