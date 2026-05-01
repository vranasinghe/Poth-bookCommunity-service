import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, FlatList, TouchableOpacity, 
    StyleSheet, ActivityIndicator, Alert, Image, 
    SafeAreaView, StatusBar, RefreshControl, Dimensions
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { getBlogs, deleteBlog } from '../../src/api/blogApi';
import { useAuth } from '../../src/context/AuthContext';
import { Colors } from '../../constants/theme';

const { width } = Dimensions.get('window');
const IMAGE_BASE = 'http://10.0.2.2:5001/uploads/';

interface Blog {
    _id: string;
    title: string;
    content: string;
    author: string;
    coverImage?: string;
    createdAt?: string;
}

export default function BlogsScreen() {
    const router = useRouter();
    const { isShopOwner } = useAuth();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBlogs = async () => {
        try {
            const response = await getBlogs();
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBlogs();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBlogs();
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Blog', 'Are you sure you want to delete this blog?', [
            { text: 'Cancel', style: 'cancel' },
            { 
                text: 'Delete', 
                style: 'destructive', 
                onPress: async () => {
                    try {
                        await deleteBlog(id);
                        fetchBlogs();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete blog.');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: Blog }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.95}
            onPress={() => router.push(`/blog/view?id=${item._id}`)}
        >
            {item.coverImage ? (
                <Image source={{ uri: `${IMAGE_BASE}${item.coverImage}` }} style={styles.cardImage} />
            ) : (
                <View style={[styles.cardImage, styles.placeholderImage]}>
                    <Ionicons name="image-outline" size={48} color="#ccc" />
                </View>
            )}
            
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.metaRow}>
                    <Ionicons name="person-outline" size={12} color="#666" />
                    <Text style={styles.cardAuthor}>{item.author}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.dateText}>
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                    </Text>
                </View>
                <Text style={styles.cardSnippet} numberOfLines={2}>{item.content}</Text>
                
                {isShopOwner && (
                    <View style={styles.adminActions}>
                        <TouchableOpacity 
                            style={[styles.actionBtn, styles.editBtn]} 
                            onPress={() => router.push(`/blog/edit?id=${item._id}`)}
                        >
                            <MaterialIcons name="edit" size={18} color="#1976D2" />
                            <Text style={[styles.actionBtnText, styles.editText]}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionBtn, styles.deleteBtn]} 
                            onPress={() => handleDelete(item._id)}
                        >
                            <MaterialIcons name="delete-outline" size={18} color="#D32F2F" />
                            <Text style={[styles.actionBtnText, styles.deleteText]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Poth Blogs</Text>
                    <Text style={styles.headerSubtitle}>Discover community stories</Text>
                </View>
                {isShopOwner && (
                    <TouchableOpacity 
                        style={styles.createBtn}
                        onPress={() => router.push('/blog/create')}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={28} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                    <Text style={styles.loadingText}>Fetching stories...</Text>
                </View>
            ) : (
                <FlatList
                    data={blogs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Ionicons name="document-text-outline" size={40} color="#ccc" />
                            </View>
                            <Text style={styles.emptyText}>No blogs published yet.</Text>
                            <Text style={styles.emptySubtext}>Check back later for new content!</Text>
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
        backgroundColor: '#F8F9FB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: Colors.light.primary,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: -2,
    },
    createBtn: {
        backgroundColor: Colors.light.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    placeholderImage: {
        backgroundColor: '#EEF2F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#1A1A1A',
        lineHeight: 25,
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardAuthor: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
        fontWeight: '600',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#ccc',
        marginHorizontal: 8,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    cardSnippet: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 16,
    },
    adminActions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 4,
    },
    editBtn: {
        backgroundColor: '#E3F2FD',
    },
    deleteBtn: {
        backgroundColor: '#FFEBEE',
    },
    actionBtnText: {
        fontSize: 12,
        fontWeight: '700',
    },
    editText: {
        color: '#1976D2',
    },
    deleteText: {
        color: '#D32F2F',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
});
