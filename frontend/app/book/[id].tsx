import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/theme';
import { Button } from '../../components/Button';

const { height, width } = Dimensions.get('window');

const BOOK_DATA = {
  title: 'Madol Duwa',
  author: 'Martin Wickramasinghe',
  price: 50,
  rating: 4.5,
  status: 'In stock',
  description: 'Madol Duwa (Mangrove Island) is a classic Sri Lankan adventure novel written by the renowned author Martin Wickramasinghe in 1947. It is widely considered a masterpiece of children\'s literature in South Asia.',
  image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1321484161i/13010468.jpg',
};

export default function BookDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <View style={styles.container}>
      {/* Top Image & Overlay */}
      <ImageBackground source={{ uri: BOOK_DATA.image }} style={styles.topImage}>
        <SafeAreaView>
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookmarkButton}>
              <Ionicons name="bookmark-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.glassContainer}>
          <BlurView intensity={30} style={styles.glassBlur} tint="dark">
             <View style={styles.bookInfoRow}>
                <View style={styles.mainInfo}>
                   <Text style={styles.title}>{BOOK_DATA.title}</Text>
                   <View style={styles.authorRow}>
                      <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.authorText}>{BOOK_DATA.author}</Text>
                   </View>
                </View>
                <View style={styles.priceContainer}>
                   <Text style={styles.priceLabel}>Price</Text>
                   <Text style={styles.priceValue}>${BOOK_DATA.price}</Text>
                </View>
             </View>
          </BlurView>
        </View>
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setActiveTab('Overview')}>
            <Text style={[styles.tabText, activeTab === 'Overview' && styles.tabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Details')}>
            <Text style={[styles.tabText, activeTab === 'Details' && styles.tabTextActive]}>Details</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.statusBadge}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.statusText}>{BOOK_DATA.status}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={18} color="#FFC107" />
            <Text style={styles.ratingText}>{BOOK_DATA.rating}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.description}>
            {BOOK_DATA.description}
          </Text>
        </ScrollView>
      </View>

      {/* Footer Buffer for Floating Button */}
      <View style={{ height: 100 }} />
      
      {/* Floating Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookNowButton}>
          <Text style={styles.bookNowText}>Book Now</Text>
          <Ionicons name="paper-plane-outline" size={20} color="white" style={styles.bookNowIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topImage: {
    height: height * 0.55,
    width: '100%',
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
  },
  glassBlur: {
    padding: 24,
  },
  bookInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 6,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFFFFF',
    marginTop: -30,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  tabText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#CCCCCC',
  },
  tabTextActive: {
    color: '#1A1A1A',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    color: '#999',
    paddingBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 25,
    right: 25,
  },
  bookNowButton: {
    backgroundColor: '#1A1A1A',
    height: 70,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookNowIcon: {
    marginLeft: 10,
    transform: [{ rotate: '45deg' }],
  },
});
