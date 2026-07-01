import React, { useState, useContext } from 'react';
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
import { useTheme } from '../../src/theme/ThemeContext';
import { AuthContext } from '../../src/context/AuthContext';
import { createShopAPI } from '../../src/api/shopApi';
import { Button } from '../../components/Button';

export default function RegisterShopScreen() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [contactNumberError, setContactNumberError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    contactNumber: '',
  });

  const handleContactNumber = (val: string) => {
    // Strip everything that is not a digit
    const digits = val.replace(/[^0-9]/g, '');
    // Cap at 10 digits
    const capped = digits.slice(0, 10);
    setFormData({ ...formData, contactNumber: capped });
    if (capped.length > 0 && capped.length < 10) {
      setContactNumberError('Contact number must be exactly 10 digits');
    } else {
      setContactNumberError('');
    }
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
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    const { name, description, location, contactNumber } = formData;

    if (!name || !description || !location || !contactNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (contactNumber.length !== 10) {
      setContactNumberError('Contact number must be exactly 10 digits');
      Alert.alert('Validation Error', 'Contact number must be exactly 10 digits (numbers only)');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', name);
      data.append('description', description);
      data.append('location', location);
      data.append('contactNumber', contactNumber);

      if (image) {
        const filename = image.split('/').pop() || 'photo.jpg';
        const match = /\.([a-zA-Z]+)$/.exec(filename);
        const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
        data.append('image', { uri: image, name: filename, type } as any);
      }

      await createShopAPI(data, user?.token);
      Alert.alert('Success', 'Shop registered successfully!', [
        { text: 'OK', onPress: () => router.replace('/owner') }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.headerTitle}>Register New Shop</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Shop Name</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. The Reading Nook"
              value={formData.name}
              onChangeText={(val) => setFormData({...formData, name: val})}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Tell customers about your shop..."
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(val) => setFormData({...formData, description: val})}
            />

            <Text style={styles.label}>Location / Nearest City</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. Colombo 07"
              value={formData.location}
              onChangeText={(val) => setFormData({...formData, location: val})}
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput 
              style={[styles.input, contactNumberError ? styles.inputError : null]}
              placeholder="10-digit number (e.g. 0771234567)"
              keyboardType="numeric"
              maxLength={10}
              value={formData.contactNumber}
              onChangeText={handleContactNumber}
            />
            {contactNumberError ? (
              <Text style={styles.errorText}>{contactNumberError}</Text>
            ) : (
              <Text style={styles.hintText}>{formData.contactNumber.length}/10 digits</Text>
            )}

            <Text style={styles.label}>Shop Image</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#999" />
                  <Text style={styles.placeholderText}>Select a beautiful cover photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Button 
                title={loading ? "Registering..." : "Register Shop"}
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
  inputError: {
    borderColor: '#E74C3C',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
    fontWeight: '600',
  },
  hintText: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    marginTop: 10,
    height: 200,
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
});
