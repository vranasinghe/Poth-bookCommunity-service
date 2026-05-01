import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors } from '../../constants/theme';
import { AuthContext } from '../../src/context/AuthContext';
import { getShopByIdAPI, updateShopAPI, deleteShopAPI } from '../../src/api/shopApi';
import { getReviewsAPI, addReviewAPI } from '../../src/api/reviewApi';
import { Button } from '../../components/Button';

const { height } = Dimensions.get('window');

export default function ShopDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('Overview');
  const [shop, setShop] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editedShop, setEditedShop] = useState({
      name: '',
      description: '',
      contactNumber: ''
  });
  const [newShopImage, setNewShopImage] = useState<string | null>(null);

  const isOwner = user?._id === shop?.shopOwner?._id || user?._id === shop?.shopOwner;

  const pickShopImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
    });
    if (!result.canceled) setNewShopImage(result.assets[0].uri);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow photo library access to attach images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopRes = await getShopByIdAPI(id);
        setShop(shopRes.data);
        setEditedShop({
            name: shopRes.data.name,
            description: shopRes.data.description,
            contactNumber: shopRes.data.contactNumber
        });
        const reviewsRes = await getReviewsAPI(id);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to load shop or reviews", error);
        Alert.alert("Error", "Could not load shop details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
      if (!user?.token) return;
      setEditLoading(true);
      try {
          const formData = new FormData();
          formData.append('name', editedShop.name);
          formData.append('description', editedShop.description);
          formData.append('contactNumber', editedShop.contactNumber);
          
          if (newShopImage) {
              const filename = newShopImage.split('/').pop() || 'photo.jpg';
              const match = /\.([a-zA-Z]+)$/.exec(filename);
              const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
              formData.append('image', { uri: newShopImage, name: filename, type } as any);
          }

          const response = await updateShopAPI(id as string, formData, user.token);
          setShop(response.data);
          setIsEditing(false);
          setNewShopImage(null);
          Alert.alert("Success", "Shop updated successfully");
      } catch (error: any) {
          Alert.alert("Error", error.response?.data?.message || "Update failed");
      } finally {
          setEditLoading(false);
      }
  };

  const handleDelete = () => {
    console.log("Delete button pressed!");
    if (Platform.OS === 'web') {
      window.alert("Diagnostic: Delete button clicked");
      if (window.confirm("Are you sure you want to delete this shop? This action cannot be undone.")) {
        confirmDelete();
      }
    } else {
      Alert.alert("Diagnostic", "Delete button clicked");
      Alert.alert(
        "Delete Shop",
        "Are you sure you want to delete this shop? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: confirmDelete }
        ]
      );
    }
  };

  const confirmDelete = async () => {
      if (!user?.token || !id) {
          Alert.alert("Error", "Missing authentication or shop ID");
          return;
      }
      try {
          console.log(`Frontend: Attempting to delete shop ${id}`);
          const response = await deleteShopAPI(id as string, user.token);
          console.log("Frontend: Delete success", response.data);
          router.replace({
              pathname: '/owner/dashboard',
              params: { deletedMessage: `${shop?.name || 'The shop'} was deleted` }
          } as any);
      } catch (error: any) {
          console.error("Frontend: Delete error", error);
          const msg = error.response?.data?.message || error.message || "Delete failed";
          Alert.alert("Error", msg);
      }
  };

  const handleSubmitReview = async () => {
      if (!user?.token) {
          Alert.alert("Authentication Required", "Please login to leave a review.");
          return;
      }
      if (!comment.trim()) {
          Alert.alert("Error", "Please write a comment.");
          return;
      }
      setSubmittingReview(true);
      try {
          const formData = new FormData();
          formData.append('targetId', id as string);
          formData.append('targetModel', 'Shop');
          formData.append('rating', String(rating));
          formData.append('comment', comment);
          if (selectedImage) {
              const filename = selectedImage.split('/').pop() || 'photo.jpg';
              const match = /\.([a-zA-Z]+)$/.exec(filename);
              const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';
              formData.append('image', { uri: selectedImage, name: filename, type } as any);
          }
          await addReviewAPI(formData, user.token);
          const reviewsRes = await getReviewsAPI(id);
          setReviews(reviewsRes.data);
          setComment('');
          setSelectedImage(null);
          Alert.alert("Success", "Review submitted!");
      } catch (error: any) {
          Alert.alert("Error", error.response?.data?.message || "Failed to submit review");
      } finally {
          setSubmittingReview(false);
      }
  };

  if (loading) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center'}]}>
              <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
      );
  }

  if (!shop) return <View style={styles.container}><Text>Shop not found</Text></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Top Image & Overlay */}
      <ImageBackground source={{ uri: newShopImage || shop.imageUrl }} style={styles.topImage}>
        <SafeAreaView>
          <View style={styles.topNav}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            {!isEditing && isOwner && (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <Ionicons name="create-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.editButton, {backgroundColor: 'rgba(231, 76, 60, 0.7)'}]} onPress={handleDelete}>
                        <Ionicons name="trash-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            )}
            {!isEditing && !isOwner && (
                <TouchableOpacity style={styles.bookmarkButton}>
                  <Ionicons name="heart-outline" size={24} color="white" />
                </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>

        <View style={styles.glassContainer}>
          <BlurView intensity={30} style={styles.glassBlur} tint="dark">
             <View style={styles.shopInfoRow}>
                <View style={styles.mainInfo}>
                   {isEditing ? (
                       <TextInput 
                        style={styles.editTitleInput}
                        value={editedShop.name}
                        onChangeText={t => setEditedShop({...editedShop, name: t})}
                        placeholder="Shop Name"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                       />
                   ) : (
                       <Text style={styles.title}>{shop.name}</Text>
                   )}
                   <View style={styles.authorRow}>
                      <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.authorText}>{shop.location}</Text>
                   </View>
                </View>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={24} color="#FFC107" />
                    <Text style={styles.ratingValue}>{shop.averageRating?.toFixed(1) || 0}</Text>
                </View>
             </View>
          </BlurView>
        </View>
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setActiveTab('Overview')}>
            <Text style={[styles.tabText, activeTab === 'Overview' && styles.tabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Reviews')}>
            <Text style={[styles.tabText, activeTab === 'Reviews' && styles.tabTextActive]}>Reviews ({reviews.length})</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Overview' && (
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.metaRow}>
                <View style={styles.statusBadge}>
                    <Ionicons name="call-outline" size={18} color="#666" />
                    {isEditing ? (
                        <TextInput 
                            style={styles.editInputInline}
                            value={editedShop.contactNumber}
                            onChangeText={t => setEditedShop({...editedShop, contactNumber: t})}
                            placeholder="Contact Number"
                        />
                    ) : (
                        <Text style={styles.statusText}>{shop.contactNumber}</Text>
                    )}
                </View>
                {isEditing && (
                    <TouchableOpacity style={styles.changeImgBtn} onPress={pickShopImage}>
                        <Ionicons name="camera" size={18} color="#007bff" />
                        <Text style={{color: '#007bff', fontWeight: 'bold'}}>Image</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {isEditing ? (
                <TextInput 
                    style={[styles.description, styles.editTextArea]}
                    value={editedShop.description}
                    onChangeText={t => setEditedShop({...editedShop, description: t})}
                    multiline
                    placeholder="Description"
                />
            ) : (
                <Text style={styles.description}>
                    {shop.description}
                </Text>
            )}

            {isEditing && (
                <View style={styles.editActions}>
                    <Button title={editLoading ? "Saving..." : "Save Changes"} onPress={handleUpdate} disabled={editLoading} />
                    <TouchableOpacity onPress={() => { setIsEditing(false); setNewShopImage(null); }} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
            
            <View style={{ height: 100 }} />
            </ScrollView>
        )}

        {activeTab === 'Reviews' && (
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Submit Review Form */}
                <View style={styles.reviewForm}>
                    <Text style={styles.reviewFormTitle}>Leave a Review</Text>
                    <View style={styles.starSelection}>
                        {[1,2,3,4,5].map(star => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Ionicons name={star <= rating ? "star" : "star-outline"} size={30} color="#FFC107" />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput 
                        style={styles.reviewInput} 
                        placeholder="Write your thoughts..." 
                        multiline 
                        numberOfLines={3} 
                        value={comment}
                        onChangeText={setComment}
                    />
                    {/* Image Picker */}
                    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={20} color="#007bff" />
                        <Text style={styles.imagePickerText}>
                            {selectedImage ? 'Change Photo' : 'Add Photo'}
                        </Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setSelectedImage(null)}>
                                <Ionicons name="close-circle" size={24} color="#ff4444" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <Button title={submittingReview ? "Submitting..." : "Submit Review"} onPress={handleSubmitReview} disabled={submittingReview} />
                </View>

                {/* Review List */}
                <View style={{ marginTop: 30, paddingBottom: 100 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Community Reviews</Text>
                    {reviews.length === 0 ? (
                        <Text style={{ color: '#999' }}>No reviews yet. Be the first!</Text>
                    ) : (
                        reviews.map(review => (
                            <View key={review._id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewAvatar}>
                                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{review.user?.firstName?.charAt(0) || 'U'}</Text>
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={{ fontWeight: 'bold' }}>{review.user?.firstName || 'Unknown'} {review.user?.lastName || ''}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Ionicons key={i} name={i < review.rating ? "star" : "star-outline"} size={12} color="#FFC107" />
                                            ))}
                                        </View>
                                    </View>
                                    <Text style={{ marginLeft: 'auto', color: '#999', fontSize: 12 }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                <Text style={{ marginTop: 10, color: '#333', lineHeight: 22 }}>{review.comment}</Text>
                                {review.imageUrl && (
                                    <Image
                                        source={{ uri: review.imageUrl }}
                                        style={styles.reviewImage}
                                        resizeMode="cover"
                                    />
                                )}
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topImage: {
    height: height * 0.45,
    width: '100%',
    justifyContent: 'space-between',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassContainer: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
  },
  glassBlur: {
    padding: 24,
  },
  shopInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainInfo: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 6,
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFFFFF',
    marginTop: -30,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 20,
  },
  tabText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#CCCCCC',
  },
  tabTextActive: {
    color: '#1A1A1A',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    color: '#999',
  },
  reviewForm: {
      backgroundColor: '#f9f9f9',
      padding: 20,
      borderRadius: 16,
      marginTop: 10
  },
  reviewFormTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10
  },
  starSelection: {
      flexDirection: 'row',
      marginBottom: 15,
      gap: 5
  },
  reviewInput: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 12,
      padding: 15,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: 15,
      fontSize: 16
  },
  reviewCard: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#F0F0F0',
      padding: 20,
      borderRadius: 16,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2
  },
  reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center'
  },
  reviewAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.light.primary,
      justifyContent: 'center',
      alignItems: 'center'
  },
  imagePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#EBF4FF',
      borderWidth: 1.5,
      borderColor: '#007bff',
      borderStyle: 'dashed',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 12,
  },
  imagePickerText: {
      color: '#007bff',
      fontWeight: '600',
      fontSize: 15,
  },
  imagePreviewContainer: {
      position: 'relative',
      marginBottom: 12,
      borderRadius: 12,
      overflow: 'hidden',
  },
  imagePreview: {
      width: '100%',
      height: 180,
      borderRadius: 12,
  },
  removeImageBtn: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'white',
      borderRadius: 12,
  },
  reviewImage: {
      width: '100%',
      height: 180,
      borderRadius: 10,
      marginTop: 12,
  },
  editButton: {
      width: 44,
      height: 44,
      backgroundColor: 'rgba(52, 152, 219, 0.7)',
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
  },
  editTitleInput: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.3)',
      marginBottom: 8,
      padding: 0,
  },
  editInputInline: {
      fontSize: 16,
      color: '#333',
      fontWeight: '600',
      borderBottomWidth: 1,
      borderBottomColor: '#CCC',
      padding: 0,
      minWidth: 150,
  },
  changeImgBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: '#EBF4FF',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
  },
  editTextArea: {
      backgroundColor: '#F9F9F9',
      borderWidth: 1,
      borderColor: '#DDD',
      borderRadius: 12,
      padding: 10,
      minHeight: 120,
      textAlignVertical: 'top',
  },
  editActions: {
      marginTop: 20,
      gap: 10,
  },
  cancelBtn: {
      alignItems: 'center',
      paddingVertical: 12,
  },
  cancelText: {
      color: '#E74C3C',
      fontWeight: 'bold',
      fontSize: 16,
  },
});
