import React from 'react';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input = ({ label, icon, rightIcon, onRightIconPress, containerStyle, ...props }: InputProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { 
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.scale.caption.fontSize,
            lineHeight: theme.typography.scale.caption.lineHeight,
          }
        ]}>
          {label.toUpperCase()}
        </Text>
      )}
      <View style={[
        styles.inputWrapper, 
        { 
          backgroundColor: theme.colors.surfaceMuted,
          borderRadius: theme.radii.md,
          borderColor: theme.colors.border,
        }
      ]}>
        <TextInput 
          style={[
            styles.input, 
            { 
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.scale.body.fontSize,
            }
          ]} 
          placeholderTextColor={theme.colors.textMuted}
          {...props} 
        />
        {rightIcon && (
          <Ionicons 
            name={rightIcon} 
            size={22} 
            color={theme.colors.textMuted} 
            onPress={onRightIconPress}
            style={styles.rightIcon}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
  },
  input: {
    flex: 1,
  },
  rightIcon: {
    marginLeft: 10,
  },
});
