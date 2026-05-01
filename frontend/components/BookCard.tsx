import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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
  return (
    <TouchableOpacity style={[styles.container, { width }]} onPress={onPress}>
      <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={styles.imageStyle}>
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color="white" />
        </TouchableOpacity>
        
        <View style={styles.infoContainer}>
            <BlurView intensity={30} style={styles.blurOverlay} tint="dark">
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <View style={styles.authorRow}>
                    <Text style={styles.author} numberOfLines={1}>{author}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#FFC107" />
                        <Text style={styles.rating}>{rating}</Text>
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
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  image: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  imageStyle: {
    borderRadius: 24,
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
    borderRadius: 16,
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
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#FFC107',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
