import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getBlogs, deleteBlog } from '../../src/api/blogApi';
import { useAuth } from '../../src/context/AuthContext';

export default function BlogList() {
    const router = useRouter();
    const { isShopOwner } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Guard: redirect non-Shop-Owners away
    useEffect(() => {
        if (!isShopOwner) {
            Alert.alert('Access Denied', 'Only registered Shop Owners can manage blogs.', [
                { text: 'OK', onPress: () => router.replace('/') }
            ]);
        }
    }, [isShopOwner, router]);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getBlogs();
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isShopOwner) fetchBlogs();
    }, [isShopOwner, fetchBlogs]);

    const handleDelete = async (id: string) => {
        Alert.alert('Delete Blog', 'Are you sure you want to delete this blog?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteBlog(id);
                        fetchBlogs();
                    } catch (error) {
                        console.error('Delete error:', error);
                        Alert.alert('Error', 'Failed to delete blog.');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>By: {item.author}</Text>
            <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => router.push(`/blog/edit?id=${item._id}`)}
                >
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => handleDelete(item._id)}
                >
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Blog Management</Text>
                <TouchableOpacity 
                    style={styles.createBtn}
                    onPress={() => router.push('/blog/create')}
                >
                    <Text style={styles.btnText}>+ Create</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={blogs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>No blogs available.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    createBtn: { backgroundColor: '#4CAF50', padding: 10, borderRadius: 8 },
    card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    author: { fontSize: 14, color: '#666', marginBottom: 8 },
    content: { fontSize: 14, color: '#333', marginBottom: 16 },
    buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    editBtn: { backgroundColor: '#2196F3', padding: 8, borderRadius: 6 },
    deleteBtn: { backgroundColor: '#f44336', padding: 8, borderRadius: 6 },
    btnText: { color: '#fff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' }
});
