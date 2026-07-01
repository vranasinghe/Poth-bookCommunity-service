import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  RefreshControl,
  TextInput,
  Modal
} from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../src/context/AuthContext';
import { getMyReviewsAPI, updateReviewAPI, deleteReviewAPI } from '../../src/api/reviewApi';

export default function ReviewsScreen() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(0);

  const fetchReviews = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await getMyReviewsAPI(user.token);
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReviews();
  };

  const handleEdit = (review: any) => {
    setSelectedReview(review);
    setEditComment(review.comment);
    setEditRating(review.rating);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!user?.token || !selectedReview) return;
    try {
      await updateReviewAPI(selectedReview._id, {
        comment: editComment,
        rating: editRating
      }, user.token);
      setEditModalVisible(false);
      fetchReviews();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update review");
    }
  };

  const handleDelete = (id: string) => {
    const performDelete = async () => {
      if (!user?.token) return;
      try {
        await deleteReviewAPI(id, user.token);
        fetchReviews();
      } catch (error) {
        console.error("Delete error:", error);
        Alert.alert("Error", "Failed to delete review");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this review?")) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Delete Review",
        "Are you sure you want to delete this review? This will also update the average rating of the book/shop.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: performDelete }
        ]
      );
    }
  };

  const renderStars = (rating: number, onRate?: (val: number) => void) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onRate && onRate(star)}
            disabled={!onRate}
          >
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={onRate ? 32 : 16}
              color={star <= rating ? "#FFD700" : "#CCC"}
              style={onRate ? { marginHorizontal: 5 } : { marginRight: 2 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }: { item: any }) => (
    <View style={styles.reviewCard}>
      <View style={styles.cardHeader}>
        <View style={styles.targetInfo}>
          <Text style={styles.targetText}>{item.targetModel.toUpperCase()}</Text>
          <Text style={styles.targetName}>{item.targetId?.title || item.targetId?.name || 'Deleted Target'}</Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.iconBtn}>
            <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={20} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      </View>

      {renderStars(item.rating)}
      <Text style={styles.commentText}>{item.comment}</Text>
      <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reviews</Text>
        <Text style={styles.subtitle}>Curate and manage your literary feedback.</Text>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderReviewItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#EEE" />
            <Text style={styles.emptyText}>You haven&apos;t written any reviews yet.</Text>
          </View>
        }
      />

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Review</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.label}>Your Rating</Text>
              {renderStars(editRating, setEditRating)}

              <Text style={[styles.label, { marginTop: 20 }]}>Your Feedback</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                value={editComment}
                onChangeText={setEditComment}
                placeholder="Tell us what you thought..."
              />

              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 25,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F3D63',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  targetInfo: {
    flex: 1,
  },
  targetText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#BBB',
    letterSpacing: 1,
    marginBottom: 4,
  },
  targetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    padding: 5,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  commentText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#BBB',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#BBB',
    marginTop: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 25,
  },
  saveBtn: {
    backgroundColor: '#0F3D63',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
