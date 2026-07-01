import React, { useState, useContext, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Image, 
  Alert, 
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { AuthContext } from '../../src/context/AuthContext';
import { getBooksByOwnerAPI, updateBookAPI, deleteBookAPI } from '../../src/api/bookApi';
import { Button } from '../../components/Button';

export default function ManageStockScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    price: '',
    description: '',
    category: '',
    stockCount: '',
  });
  const [editImage, setEditImage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchBooks = useCallback(async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const response = await getBooksByOwnerAPI(user.token);
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch owner books", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleEdit = (book: any) => {
    setSelectedBook(book);
    setEditFormData({
      price: book.price.toString(),
      description: book.description,
      category: book.category,
      stockCount: book.stockCount.toString(),
    });
    setEditImage(book.imageUrl);
    setEditModalVisible(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your gallery.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) {
      setEditImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!user?.token || !selectedBook) return;
    
    setUpdating(true);
    try {
      const data = new FormData();
      data.append('price', editFormData.price);
      data.append('description', editFormData.description);
      data.append('category', editFormData.category);
      data.append('stockCount', editFormData.stockCount);

      if (editImage && editImage !== selectedBook.imageUrl) {
        if (Platform.OS === 'web') {
            const res = await fetch(editImage);
            const blob = await res.blob();
            data.append('image', blob, 'book.jpg');
        } else {
            const filename = editImage.split('/').pop() || 'photo.jpg';
            const match = /\.([a-zA-Z]+)$/.exec(filename);
            const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
            data.append('image', { uri: editImage, name: filename, type } as any);
        }
      }

      await updateBookAPI(selectedBook._id, data, user.token);
      Alert.alert("Success", "Book updated successfully");
      setEditModalVisible(false);
      fetchBooks();
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update book");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = (bookId: string) => {
    const performDelete = async () => {
      try {
        await deleteBookAPI(bookId, user?.token);
        Alert.alert("Deleted", "Book removed from inventory");
        fetchBooks();
      } catch (error: any) {
        console.error("Delete book error:", error);
        Alert.alert("Error", "Failed to delete book");
      }
    };

    if (Platform.OS === 'web') {
        if (window.confirm("Are you sure you want to delete this book?")) {
            performDelete();
        }
    } else {
        Alert.alert(
            "Delete Book",
            "Are you sure you want to remove this book from your inventory?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: performDelete }
            ]
        );
    }
  };

  const renderBookItem = ({ item }: { item: any }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.shopBadge}>
          <Text style={styles.shopText}>{item.shop?.name}</Text>
        </View>
        <View style={styles.stockRow}>
            <Text style={[styles.stockText, item.stockCount < 5 && { color: '#E74C3C' }]}>
                {item.stockCount} in stock
            </Text>
            <Text style={styles.priceText}>Rs.{item.price}</Text>
        </View>
        <View style={styles.cardActions}>
            <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                <Ionicons name="create-outline" size={18} color="#003D71" />
                <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id)}>
                <Ionicons name="trash-outline" size={18} color="#E74C3C" />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Stock</Text>
        <TouchableOpacity onPress={fetchBooks} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={20} color="#003D71" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : books.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="book-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>No books found in your shops.</Text>
          <Button title="Register First Book" onPress={() => router.push('/owner/register-book')} />
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          onRefresh={() => { setRefreshing(true); fetchBooks(); }}
          refreshing={refreshing}
        />
      )}

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContent}
            >
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Update Book Details</Text>
                    <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                        <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.readOnlyLabel}>Title: <Text style={styles.readOnlyValue}>{selectedBook?.title}</Text></Text>
                    <Text style={styles.readOnlyLabel}>Author: <Text style={styles.readOnlyValue}>{selectedBook?.author}</Text></Text>

                    <Text style={styles.label}>Price (Rs.)</Text>
                    <TextInput 
                        style={styles.input}
                        value={editFormData.price}
                        keyboardType="numeric"
                        onChangeText={(val) => setEditFormData({...editFormData, price: val})}
                    />

                    <Text style={styles.label}>Stock Count</Text>
                    <TextInput 
                        style={styles.input}
                        value={editFormData.stockCount}
                        keyboardType="numeric"
                        onChangeText={(val) => setEditFormData({...editFormData, stockCount: val})}
                    />

                    <Text style={styles.label}>Category</Text>
                    <TextInput 
                        style={styles.input}
                        value={editFormData.category}
                        onChangeText={(val) => setEditFormData({...editFormData, category: val})}
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]}
                        value={editFormData.description}
                        multiline
                        numberOfLines={4}
                        onChangeText={(val) => setEditFormData({...editFormData, description: val})}
                    />

                    <Text style={styles.label}>Update Cover</Text>
                    <TouchableOpacity style={styles.modalImagePicker} onPress={pickImage}>
                        <Image source={{ uri: editImage || '' }} style={styles.modalPreviewImage} />
                        <View style={styles.imageOverlay}>
                            <Ionicons name="camera" size={24} color="white" />
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 20, paddingBottom: 20 }}>
                        <Button 
                            title={updating ? "Updating..." : "Save Changes"} 
                            onPress={handleUpdate} 
                            disabled={updating}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
      </Modal>
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
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  refreshBtn: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  bookImage: {
    width: 90,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#EEE',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  shopBadge: {
    backgroundColor: '#F0F7FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  shopText: {
    fontSize: 10,
    color: '#003D71',
    fontWeight: 'bold',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27AE60',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EDF2',
    height: 36,
    borderRadius: 8,
    gap: 5,
  },
  editBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#003D71',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 15,
  },
  readOnlyLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  readOnlyValue: {
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalImagePicker: {
    marginTop: 10,
    height: 150,
    width: 110,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  modalPreviewImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderTopLeftRadius: 12,
  },
});
