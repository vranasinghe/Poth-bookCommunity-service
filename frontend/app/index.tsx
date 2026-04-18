import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getBlogs } from '../src/api/blogApi';
import { useAuth } from '../src/context/AuthContext';

const { width } = Dimensions.get('window');

export default function Home() {
    const router = useRouter();
    const { user, isShopOwner, logout } = useAuth();
    const [blogs, setBlogs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useFocusEffect(
        React.useCallback(() => {
            fetchBlogs();
        }, [])
    );

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await getBlogs();
            setBlogs(response.data.slice(0, 10));
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out', style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/login');
                }
            }
        ]);
    };

    const renderBlogCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/blog/view?id=${item._id}`)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            </View>
            <Text style={styles.cardAuthor}>By {item.author}</Text>
            <Text style={styles.cardContent} numberOfLines={3}>{item.content}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.readMore}>Read Full Article</Text>
                <MaterialIcons name="arrow-forward" size={16} color="#007BFF" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>
                        {user ? `Hello, ${user.firstName}` : 'Welcome'}
                    </Text>
                    <Text style={styles.appName}>Poth Community</Text>
                </View>
                <View style={styles.headerActions}>
                    {/* Only show Manage button if user is a Shop Owner */}
                    {isShopOwner && (
                        <TouchableOpacity
                            style={styles.manageBtn}
                            onPress={() => router.push('/blog')}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="edit" size={18} color="#fff" />
                            <Text style={styles.manageBtnText}>Manage</Text>
                        </TouchableOpacity>
                    )}

                    {/* Login or Logout button */}
                    {user ? (
                        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                            <MaterialIcons name="logout" size={20} color="#E53935" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')} activeOpacity={0.7}>
                            <Text style={styles.loginBtnText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* User Type Badge */}
            {user && (
                <View style={styles.badgeRow}>
                    <View style={[styles.badge, isShopOwner ? styles.shopBadge : styles.customerBadge]}>
                        <MaterialIcons name={isShopOwner ? 'store' : 'person'} size={14} color="#fff" />
                        <Text style={styles.badgeText}>{user.userType}</Text>
                    </View>
                </View>
            )}

            <Text style={styles.sectionTitle}>Latest Blogs</Text>

            {loading ? (
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            ) : (
                <FlatList
                    data={blogs}
                    keyExtractor={(item) => item._id}
                    renderItem={renderBlogCard}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="article" size={60} color="#CCC" />
                            <Text style={styles.emptyText}>No blogs yet.</Text>
                            <Text style={styles.emptySubText}>
                                {isShopOwner ? 'Click Manage to create one!' : 'Check back soon!'}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F7F9FA' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
        backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EAEAEA'
    },
    greeting: { fontSize: 13, color: '#777', textTransform: 'uppercase', letterSpacing: 0.8 },
    appName: { fontSize: 24, fontWeight: '900', color: '#1A1A1A' },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    manageBtn: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#007BFF',
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, gap: 5
    },
    manageBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    logoutBtn: {
        padding: 8, borderRadius: 20, backgroundColor: '#FFF0F0',
        borderWidth: 1, borderColor: '#FFCDD2'
    },
    loginBtn: {
        backgroundColor: '#1A1A1A', paddingVertical: 8, paddingHorizontal: 14,
        borderRadius: 20
    },
    loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    badgeRow: { paddingHorizontal: 20, paddingTop: 10 },
    badge: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 5
    },
    shopBadge: { backgroundColor: '#FF8F00' },
    customerBadge: { backgroundColor: '#43A047' },
    badgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
    sectionTitle: {
        fontSize: 20, fontWeight: 'bold', color: '#333',
        paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10,
    },
    listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
    card: {
        backgroundColor: '#fff', padding: 18, borderRadius: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
        borderWidth: 1, borderColor: '#F0F0F0'
    },
    cardHeader: { marginBottom: 4 },
    cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1A1A', width: width * 0.8 },
    cardAuthor: { fontSize: 13, color: '#007BFF', fontWeight: '600', marginBottom: 8 },
    cardContent: { fontSize: 14, color: '#555', lineHeight: 21, marginBottom: 12 },
    cardFooter: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F5F5F5'
    },
    readMore: { fontSize: 13, color: '#007BFF', fontWeight: '600' },
    centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginTop: 14 },
    emptySubText: { fontSize: 14, color: '#999', marginTop: 8 },
});
