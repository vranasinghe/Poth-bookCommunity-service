import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../src/theme/ThemeContext';

interface BookCardProps {
  id?: string;
  title: string;
  author: string;
  rating: number;
  image: string;
  onPress: () => void;
  width?: number;
}

export const BookCard = ({ id, title, author, rating, image, onPress, width = 200 }: BookCardProps) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { width, borderRadius: theme.radii.lg, ...theme.shadows.medium }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={{ borderRadius: theme.radii.lg }}>
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>

        <View style={[styles.infoContainer, { borderRadius: theme.radii.md }]}>
          <BlurView intensity={30} style={styles.blurOverlay} tint="dark">
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <View style={styles.authorRow}>
              <Text style={styles.author} numberOfLines={1}>{author}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={theme.colors.accent} />
                <Text style={[styles.rating, { color: theme.colors.accent }]}>{rating}</Text>
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    marginRight: 20,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  heartButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    overflow: 'hidden',
  },
  blurOverlay: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
