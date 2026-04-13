import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../constants/theme';
import { BookCard } from '../../components/BookCard';

const CATEGORIES = ['Stocks Available', 'Nearly coming', 'Out of stock'];

const FEATURED_BOOKS = [
  {
    id: '1',
    title: 'Madol Duwa',
    author: 'Martin Wickramasinghe',
    rating: 4.8,
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1321484161i/13010468.jpg',
  },
  {
    id: '2',
    title: 'The Art of War',
    author: 'Sun Tzu',
    rating: 4.7,
    image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1630560184i/10534.jpg',
  },
];

export default function CustomerDashboard() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = React.useState(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, David 👋</Text>
            <Text style={styles.subGreeting}>Explore the habit of reading</Text>
          </View>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?u=david' }} 
            style={styles.avatar} 
          />
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput 
              placeholder="Search books/shops" 
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
            <View style={styles.verticalDivider} />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Your alerted books</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity 
              key={cat} 
              style={[
                styles.categoryChip, 
                activeCategory === index && styles.categoryChipActive
              ]}
              onPress={() => setActiveCategory(index)}
            >
              <Text style={[
                styles.categoryText, 
                activeCategory === index && styles.categoryTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Books Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksGrid}>
          {FEATURED_BOOKS.map(book => (
            <BookCard 
              key={book.id}
              {...book}
              onPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  searchSection: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 64,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 15,
  },
  filterButton: {
    padding: 5,
  },
  categorySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  viewAll: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryScroll: {
    paddingLeft: 25,
    marginBottom: 30,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#F7F7F7',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#2D3436',
  },
  categoryText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  booksGrid: {
    paddingLeft: 25,
    paddingRight: 5,
  },
});
