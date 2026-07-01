import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image, Dimensions, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../../src/context/AuthContext';
import { getShopsByOwnerAPI } from '../../../src/api/shopApi';
import { useTheme } from '../../../src/theme/ThemeContext';

const { width } = Dimensions.get('window');

const ACTIVITY = [
  { id: '1', shop: 'The Midnight Library', action: 'Added 24 copies to "Reading Nook"', time: '2 HOURS AGO' },
  { id: '2', shop: 'Great Expectations', action: 'Stock replenished at "Ink & Parchment"', time: '5 HOURS AGO' },
  { id: '3', shop: 'Wild Botany', action: 'New arrival - 10 First Editions', time: 'YESTERDAY' },
];

export default function OwnerDashboard() {
  const router = useRouter();
  const { logoutContext, user } = useContext(AuthContext);
  const theme = useTheme();
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useLocalSearchParams();

  const fetchShops = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await getShopsByOwnerAPI(user.token);
      setShops(response.data);
    } catch (error) {
      console.error("Failed to fetch owner shops", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchShops();
    if (params?.deletedMessage) {
      Alert.alert("Success", params.deletedMessage as string);
    }
  }, [params?.deletedMessage, fetchShops]);

  const dashboardStats = [
    { label: 'TOTAL SHOPS', value: shops.length.toString().padStart(2, '0'), change: 'Keep it up!', color: theme.colors.primary },
    { label: 'COMPLETED ORDERS', value: '15', change: 'Great job!', color: theme.colors.success },
    { label: 'LOW STOCK ITEMS', value: '00', progress: 0.1, color: theme.colors.accent },
  ];

  const handleLogout = () => {
    const performLogout = async () => { await logoutContext(); };
    if (Platform.OS === 'web') {
      if (window.confirm("Logout: Are you sure you want to log out?")) performLogout();
    } else {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout },
      ]);
    }
  };

  const s = createStyles(theme);

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerTitleRow}>
            <Ionicons name="book-outline" size={24} color={theme.colors.primary} />
            <Text style={s.headerTitle}>{`The Curator's Desk`}</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity onPress={() => router.push('/owner/account' as any)}>
              <View style={s.logoBox}>
                <Text style={s.logoTextSmall}>poth</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={s.logoutBtn}>
              <Ionicons name="log-out-outline" size={28} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Carousel */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.statsScroll} contentContainerStyle={s.statsContent}>
          {dashboardStats.map((stat, idx) => (
            <View key={idx} style={s.statCard}>
              <Text style={s.statLabel}>{stat.label}</Text>
              <Text style={s.statValue}>{stat.value}</Text>
              {stat.change && (
                <View style={s.changeBadge}>
                  <Ionicons name="trending-up" size={12} color={stat.color} />
                  <Text style={s.changeText}>{stat.change}</Text>
                </View>
              )}
              {stat.progress !== undefined && (
                <View style={s.progressBarWrapper}>
                  <View style={[s.progressBar, { width: `${stat.progress * 100}%` as any, backgroundColor: theme.colors.accent }]} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={s.section}>
          <Text style={s.sectionTitle}><Ionicons name="flash" size={20} /> Quick Actions</Text>
          <View style={s.actionsRow}>
            <TouchableOpacity style={s.actionButton} onPress={() => router.push('/owner/register-shop' as any)}>
              <Ionicons name="business" size={20} color="white" />
              <Text style={s.actionText}>Register New Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionButton, s.actionButtonSecondary]} onPress={() => router.push('/owner/update-stock' as any)}>
              <Ionicons name="sync" size={20} color={theme.colors.primary} />
              <Text style={[s.actionText, s.actionTextSecondary]}>Update Stock</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Shops */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>My Shops</Text>
            <TouchableOpacity onPress={fetchShops}>
              <Ionicons name="refresh" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : shops.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>You haven&apos;t registered any shops yet.</Text>
            </View>
          ) : (
            shops.map(shop => (
              <TouchableOpacity key={shop._id} style={s.shopCard} onPress={() => router.push(`/shop/${shop._id}` as any)}>
                <Image source={{ uri: shop.imageUrl }} style={s.shopImage} />
                <View style={s.shopInfo}>
                  <View>
                    <Text style={s.shopName}>{shop.name}</Text>
                    <Text style={s.shopLoc}>{shop.location}</Text>
                  </View>
                  <View style={s.statusBadge}>
                    <Text style={s.statusText}>{shop.contactNumber}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recent Activity */}
        <View style={[s.section, s.activityWrapper]}>
          <Text style={s.sectionTitle}><Ionicons name="stats-chart" size={20} /> Recent Stock Activity</Text>
          {ACTIVITY.map(act => (
            <View key={act.id} style={s.activityItem}>
              <View style={s.activityIcon}>
                <Ionicons name="book" size={24} color={theme.colors.textSecondary} />
              </View>
              <View style={s.activityContent}>
                <Text style={s.activityShop}>{act.shop}</Text>
                <Text style={s.activityAction}>{act.action}</Text>
                <Text style={s.activityTime}>{act.time}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={s.showAllActivity}>
            <Text style={s.showAllText}>Show All Activity</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 25, paddingVertical: 20,
    backgroundColor: theme.colors.surface, marginBottom: 20,
    borderBottomWidth: 1, borderBottomColor: theme.colors.border,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary },
  logoBox: { width: 44, height: 44, backgroundColor: theme.colors.primaryDark, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  logoTextSmall: { color: '#FFF', fontSize: 14, fontWeight: '400' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  logoutBtn: { padding: 5 },
  statsScroll: { marginBottom: 25 },
  statsContent: { paddingLeft: 25, paddingRight: 10 },
  statCard: {
    width: width * 0.7, backgroundColor: theme.colors.surface,
    borderRadius: 24, padding: 24, marginRight: 15, ...theme.shadows.medium,
  },
  statLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.textMuted, letterSpacing: 1, marginBottom: 10 },
  statValue: { fontSize: 48, fontWeight: '900', color: theme.colors.primary, marginBottom: 8 },
  changeBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', gap: 5,
  },
  changeText: { fontSize: 12, fontWeight: 'bold', color: theme.colors.textSecondary },
  progressBarWrapper: { height: 4, backgroundColor: theme.colors.border, borderRadius: 2, marginTop: 20, width: '100%' },
  progressBar: { height: '100%', borderRadius: 2 },
  section: { paddingHorizontal: 25, marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 15 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.colors.primary, height: 56, borderRadius: 16, gap: 8,
  },
  actionButtonSecondary: { backgroundColor: theme.colors.surfaceMuted },
  actionText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  actionTextSecondary: { color: theme.colors.primary },
  shopCard: { backgroundColor: theme.colors.surface, borderRadius: 24, marginBottom: 15, overflow: 'hidden', ...theme.shadows.medium },
  shopImage: { height: 120, width: '100%' },
  shopInfo: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: theme.colors.surfaceMuted },
  shopName: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
  shopLoc: { fontSize: 14, color: theme.colors.textSecondary, fontStyle: 'italic' },
  statusBadge: { backgroundColor: 'rgba(255,255,255,0.4)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border },
  statusText: { fontSize: 10, fontWeight: 'bold', color: theme.colors.textSecondary },
  activityWrapper: { backgroundColor: theme.colors.primaryLight, marginHorizontal: 15, borderRadius: 24, padding: 20, paddingTop: 25 },
  activityItem: { flexDirection: 'row', marginBottom: 20, gap: 15 },
  activityIcon: { width: 60, height: 60, backgroundColor: theme.colors.surface, borderRadius: 16, justifyContent: 'center', alignItems: 'center', ...theme.shadows.subtle },
  activityContent: { flex: 1 },
  activityShop: { fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary },
  activityAction: { fontSize: 12, color: theme.colors.textSecondary, marginVertical: 4 },
  activityTime: { fontSize: 10, color: theme.colors.textMuted, fontWeight: '600' },
  showAllActivity: { alignItems: 'center', paddingVertical: 10, marginTop: 10 },
  showAllText: { color: theme.colors.primary, fontWeight: 'bold' },
  emptyState: { padding: 40, alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 24 },
  emptyText: { color: theme.colors.textSecondary, fontSize: 16, textAlign: 'center' },
});
