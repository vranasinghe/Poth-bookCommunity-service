import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { BookCard } from '../../components/BookCard';
import { AuthContext } from '../../src/context/AuthContext';
import { getBooksAPI } from '../../src/api/bookApi';

const { width } = Dimensions.get('window');
const CATEGORIES = ['All Stocks', 'Nearly coming', 'Out of stock'];

export default function CustomerDashboard() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [activeCategory, setActiveCategory] = useState(0);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const theme = useTheme();
  const styles = createStyles(theme);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: '/search' as any, params: { q: searchQuery } });
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
        try {
            const res = await getBooksAPI();
            setBooks(res.data);
        } catch (error) {
            console.error("Failed to load books", error);
        } finally {
            setLoading(false);
        }
    };
    fetchBooks();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {user?.firstName || 'Reader'} 👋</Text>
            <Text style={styles.subGreeting}>Explore the habit of reading</Text>
          </View>
          <Image 
            source={{ uri: `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random` }} 
            style={styles.avatar} 
          />
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <TextInput 
              placeholder="Search books/shops" 
              style={styles.searchInput}
              placeholderTextColor={theme.colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <View style={styles.verticalDivider} />
            <TouchableOpacity style={styles.filterButton} onPress={handleSearch}>
              <Ionicons name="search-outline" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Discovery Buttons */}
        <View style={styles.discoveryRow}>
          <TouchableOpacity 
            style={[styles.discoveryCard, { backgroundColor: theme.colors.pastelBlue }]}
            onPress={() => router.push('/discover/books' as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="book" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.discoveryTitle}>Discover books</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.discoveryCard, { backgroundColor: theme.colors.pastelLavender }]}
            onPress={() => router.push('/discover/shops' as any)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="storefront" size={24} color={theme.colors.secondary} />
            </View>
            <Text style={styles.discoveryTitle}>Discover Shops</Text>
          </TouchableOpacity>
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
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Available Books</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.booksGrid}>
          {loading ? (
             <ActivityIndicator size="large" color={theme.colors.primary} style={{ margin: 20 }} />
          ) : (
             books.map(book => (
               <BookCard 
                 key={book._id}
                 id={book._id}
                 title={book.title}
                 author={book.author}
                 rating={book.averageRating}
                 image={book.imageUrl}
                 onPress={() => router.push({ pathname: '/book/[id]' as any, params: { id: book._id } })}
               />
             ))
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.h2.fontSize,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  subGreeting: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  searchSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: 20,
    height: 56,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.subtle,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.body.fontSize,
    color: theme.colors.textPrimary,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
    marginHorizontal: 15,
  },
  filterButton: {
    padding: 5,
  },
  discoveryRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  discoveryCard: {
    width: (width - (theme.spacing.lg * 2) - theme.spacing.md) / 2,
    padding: 20,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.subtle,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  discoveryTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.bodySmall.fontSize,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  categorySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.h3.fontSize,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  viewAll: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  categoryScroll: {
    paddingLeft: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.surfaceMuted,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.bodySmall.fontSize,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: theme.colors.surface,
  },
  booksGrid: {
    paddingLeft: theme.spacing.lg,
    paddingRight: 5,
  },
});
