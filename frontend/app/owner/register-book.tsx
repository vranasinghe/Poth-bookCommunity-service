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
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import { AuthContext } from '../../src/context/AuthContext';
import { createBookAPI } from '../../src/api/bookApi';
import { getShopsByOwnerAPI } from '../../src/api/shopApi';
import { Button } from '../../components/Button';
import { Picker } from '@react-native-picker/picker';

export default function RegisterBookScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [shops, setShops] = useState<any[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    category: '',
    stockCount: '1',
    shop: '',
  });

  const fetchShops = useCallback(async () => {
    if (!user?.token) return;
    try {
      const response = await getShopsByOwnerAPI(user.token);
      setShops(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, shop: response.data[0]._id }));
      }
    } catch (error) {
      console.error("Failed to fetch shops", error);
      Alert.alert("Error", "Could not load your shops. Please register a shop first.");
    } finally {
      setShopsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

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
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    const { title, author, description, price, category, stockCount, shop } = formData;

    if (!title || !author || !description || !price || !category || !stockCount || !shop) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('author', author);
      data.append('description', description);
      data.append('price', price);
      data.append('category', category);
      data.append('stockCount', stockCount);
      data.append('shop', shop);

      if (image) {
          if (Platform.OS === 'web') {
              const res = await fetch(image);
              const blob = await res.blob();
              data.append('image', blob, 'book.jpg');
          } else {
              const filename = image.split('/').pop() || 'photo.jpg';
              const match = /\.([a-zA-Z]+)$/.exec(filename);
              const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
              data.append('image', { uri: image, name: filename, type } as any);
          }
      }

      await createBookAPI(data, user?.token);
      Alert.alert('Success', 'Book registered successfully!', [
        { text: 'OK', onPress: () => router.replace('/owner') }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to register book');
    } finally {
      setLoading(false);
    }
  };

  if (shopsLoading) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
      );
  }

  if (shops.length === 0) {
      return (
          <SafeAreaView style={styles.container}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Register New Book</Text>
              </View>
              <View style={styles.emptyContent}>
                  <Ionicons name="business-outline" size={80} color="#DDD" />
                  <Text style={styles.emptyText}>You need to register a shop before adding books.</Text>
                  <Button title="Register a Shop" onPress={() => router.push('/owner/register-shop')} />
              </View>
          </SafeAreaView>
      )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register New Book</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Select Shop</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.shop}
                    onValueChange={(itemValue) => setFormData({...formData, shop: itemValue})}
                    style={styles.picker}
                >
                    {shops.map(shop => (
                        <Picker.Item key={shop._id} label={shop.name} value={shop._id} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Book Title</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. The Great Gatsby"
              value={formData.title}
              onChangeText={(val) => setFormData({...formData, title: val})}
            />

            <Text style={styles.label}>Author Name</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. F. Scott Fitzgerald"
              value={formData.author}
              onChangeText={(val) => setFormData({...formData, author: val})}
            />

            <Text style={styles.label}>Category</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Fiction / Classic"
              value={formData.category}
              onChangeText={(val) => setFormData({...formData, category: val})}
            />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Price (Rs.)</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="1500"
                        keyboardType="numeric"
                        value={formData.price}
                        onChangeText={(val) => setFormData({...formData, price: val})}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.label}>Stock Count</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="10"
                        keyboardType="numeric"
                        value={formData.stockCount}
                        onChangeText={(val) => setFormData({...formData, stockCount: val})}
                    />
                </View>
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Brief summary of the book..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(val) => setFormData({...formData, description: val})}
            />

            <Text style={styles.label}>Cover Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#999" />
                  <Text style={styles.placeholderText}>Upload a clear cover photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Button 
                title={loading ? "Registering..." : "Register Book"}
                onPress={handleRegister}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContent: {
    paddingBottom: 40,
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
  form: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  imagePicker: {
    marginTop: 10,
    height: 250,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: 10,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  footer: {
    marginTop: 40,
  },
  emptyContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
  },
  emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
      marginBottom: 30,
      marginTop: 20,
  }
});
