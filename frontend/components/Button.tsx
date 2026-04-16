import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button = ({ title, onPress, variant = 'primary', icon, loading, disabled, style, textStyle }: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return { container: styles.darkContainer, text: styles.darkText };
      case 'secondary':
        return { container: styles.secondaryContainer, text: styles.secondaryText };
      case 'outline':
        return { container: styles.outlineContainer, text: styles.outlineText };
      default:
        return { container: styles.primaryContainer, text: styles.primaryText };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <TouchableOpacity 
      style={[styles.baseContainer, vStyles.container, style, disabled && { opacity: 0.6 }]} 
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={vStyles.text.color as string} />
      ) : (
        <>
          <Text style={[styles.baseText, vStyles.text, textStyle]}>{title}</Text>
          {icon && <Ionicons name={icon} size={20} color={vStyles.text.color as string} style={styles.icon} />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  baseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryContainer: {
    backgroundColor: Colors.light.primary,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#1A1A1A',
  },
  darkText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: '#F3F4F6',
  },
  secondaryText: {
    color: '#1A1A1A',
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  outlineText: {
    color: '#1A1A1A',
  },
  icon: {
    marginLeft: 8,
  },
});
