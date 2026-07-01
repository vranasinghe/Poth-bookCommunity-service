import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';

export default function UpdateStockSelectionScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.colors.surfaceMuted, ...theme.shadows.subtle }]}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>Update Stock</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Choose an option to manage your inventory</Text>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]} onPress={() => router.push('/owner/manage-stock' as any)}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primaryLight }]}>
            <Ionicons name="list-outline" size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Existing stock update</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]}>Update stock levels or details for books already in your shops</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface, ...theme.shadows.medium }]} onPress={() => router.push('/owner/register-book' as any)}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.accentLight }]}>
            <Ionicons name="add-circle-outline" size={32} color={theme.colors.accent} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Create a new stock update</Text>
            <Text style={[styles.cardDesc, { color: theme.colors.textMuted }]}>Register a completely new book to your inventory</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, gap: 15, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  content: { paddingHorizontal: 25, marginTop: 20 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginBottom: 20 },
  iconBox: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 15, marginRight: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardDesc: { fontSize: 14, lineHeight: 20 },
});
