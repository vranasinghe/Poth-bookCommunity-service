import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../src/theme/ThemeContext';

interface GlassBoxProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export const GlassBox = ({ children, style, intensity = 40 }: GlassBoxProps) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: theme.radii.lg,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          ...theme.shadows.subtle,
        },
        style,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView intensity={intensity} style={StyleSheet.absoluteFill} tint="light" />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.surface + 'B3' }]} />
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
  },
  content: {
    padding: 20,
  },
});
