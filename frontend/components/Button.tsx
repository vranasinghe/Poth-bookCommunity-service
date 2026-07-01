import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../src/theme/ThemeContext';
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
  const theme = useTheme();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          container: { backgroundColor: theme.colors.primaryDark },
          text: { color: theme.colors.surface },
        };
      case 'secondary':
        return {
          container: { backgroundColor: theme.colors.pastelBlue },
          text: { color: theme.colors.primary },
        };
      case 'outline':
        return {
          container: { 
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
          },
          text: { color: theme.colors.primary },
        };
      default:
        return {
          container: { backgroundColor: theme.colors.primary },
          text: { color: theme.colors.surface },
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <TouchableOpacity 
      style={[
        styles.baseContainer, 
        { borderRadius: theme.radii.md },
        vStyles.container, 
        style, 
        disabled && { opacity: 0.6 }
      ]} 
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={vStyles.text.color as string} />
      ) : (
        <>
          <Text style={[
            styles.baseText, 
            { 
              fontFamily: theme.typography.fontFamily,
              ...theme.typography.scale.button 
            }, 
            vStyles.text, 
            textStyle
          ]}>
            {title}
          </Text>
          {icon && (
            <Ionicons 
              name={icon} 
              size={20} 
              color={vStyles.text.color as string} 
              style={styles.icon} 
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  baseText: {
    letterSpacing: 0.5,
  },
  icon: {
    marginLeft: 8,
  },
});
