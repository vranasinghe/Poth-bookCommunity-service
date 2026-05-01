import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function UpdateStockSelectionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update Stock</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Choose an option to manage your inventory</Text>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/owner/manage-stock' as any)}
        >
          <View style={[styles.iconBox, { backgroundColor: '#EBF4FF' }]}>
            <Ionicons name="list-outline" size={32} color="#003D71" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Existing stock update</Text>
            <Text style={styles.cardDesc}>Update stock levels or details for books already in your shops</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BBB" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/owner/register-book' as any)}
        >
          <View style={[styles.iconBox, { backgroundColor: '#F0FFF4' }]}>
            <Ionicons name="add-circle-outline" size={32} color="#2F855A" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Create a new stock update</Text>
            <Text style={styles.cardDesc}>Register a completely new book to your inventory</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#BBB" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    paddingHorizontal: 25,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
  },
});
