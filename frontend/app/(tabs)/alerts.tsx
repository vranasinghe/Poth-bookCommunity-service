import React, { useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';
import { AuthContext } from '../../src/context/AuthContext';
import { getMyReportsAPI } from '../../src/api/reportApi';

export default function AlertsScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getMyReportsAPI(user.token);
      setReports(res.data);
    } catch (error) {
      console.error('Failed to load alerts', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchReports();
    }, [fetchReports])
  );

  const renderReport = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.shopBadge}>
          <Ionicons name="storefront" size={14} color="#FFF" />
          <Text style={styles.shopBadgeText}>{item.shopName}</Text>
        </View>
        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>

      {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}

      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.reportImage} />
      ) : null}

      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Stock Details:</Text>
        {item.breakdown?.slice(0, 3).map((b: any, index: number) => (
          <View key={index} style={styles.breakdownRow}>
            <Text style={styles.bookName} numberOfLines={1}>{b.bookName}</Text>
            <Text style={styles.stockAmount}>{b.stockAmount} left</Text>
          </View>
        ))}
        {item.breakdown?.length > 3 && (
          <Text style={styles.moreText}>+ {item.breakdown.length - 3} more items...</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.viewShopBtn}
        onPress={() => router.push(`/shop/${item.shopId}` as any)}
      >
        <Text style={styles.viewShopText}>View Shop</Text>
        <Ionicons name="arrow-forward" size={16} color="#007bff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop Alerts</Text>
        <Text style={styles.headerSubtitle}>Stock updates from shops you follow</Text>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : reports.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="notifications-off-outline" size={64} color="#DDD" />
          <Text style={styles.emptyTitle}>No Alerts Yet</Text>
          <Text style={styles.emptySub}>Follow shops to receive stock notifications.</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={item => item._id}
          renderItem={renderReport}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003D71',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 15,
  },
  emptySub: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  listContent: {
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003D71',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  shopBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    maxWidth: 150,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  notes: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 15,
  },
  breakdownContainer: {
    backgroundColor: '#F8F9FB',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#003D71',
    marginBottom: 15,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bookName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  stockAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  moreText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  viewShopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 12,
    marginTop: 5,
  },
  viewShopText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 15,
  }
});
