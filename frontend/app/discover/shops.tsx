import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { getShopsAPI } from '../../src/api/shopApi';

export default function DiscoverShops() {
  const router = useRouter();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShops = async () => {
    try {
      const res = await getShopsAPI();
      setShops(res.data);
    } catch (error) {
      console.error("Failed to fetch shops", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShops();
  };

  const renderShopItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.shopCard}
      onPress={() => router.push({ pathname: '/shop/[id]', params: { id: item._id } })}
    >
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.averageRating.toFixed(1)} ({item.numReviews} reviews)</Text>
        </View>
      </View>
      <View style={styles.circleArrow}>
        <Ionicons name="chevron-forward" size={20} color="#333" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>All Bookshops</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={shops}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={renderShopItem}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[Colors.light.primary]} 
              tintColor={Colors.light.primary} 
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No shops found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  shopCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 6,
  },
  circleArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
