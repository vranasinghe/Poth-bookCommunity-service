import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator,
    ScrollView, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Alert, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getBlogById, toggleLike, getComments, addComment } from '../../src/api/blogApi';
import { useAuth } from '../../src/context/AuthContext';

interface Blog {
    _id: string;
    title: string;
    content: string;
    author: string;
    coverImage?: string;
    likes?: string[];
    createdAt?: string;
}

interface Comment {
    _id: string;
    userName: string;
    text: string;
    createdAt: string;
}

export default function ViewBlog() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user } = useAuth();

    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchBlog();
            fetchComments();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const blogId = Array.isArray(id) ? id[0] : id;
            const response = await getBlogById(blogId as string);
            const data = response.data;
            setBlog(data);
            setLikeCount(data.likes?.length || 0);
            // Check if current user already liked
            if (user && data.likes) {
                setLiked(data.likes.includes(user._id));
            }
        } catch (error) {
            Alert.alert('Error', 'Could not fetch blog');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const blogId = Array.isArray(id) ? id[0] : id;
            const res = await getComments(blogId as string);
            setComments(res.data);
        } catch (e) {
            console.error('Failed to fetch comments', e);
        }
    };

    const handleLike = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to like this blog.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/login') }
            ]);
            return;
        }
        setLikeLoading(true);
        try {
            const blogId = Array.isArray(id) ? id[0] : id;
            const res = await toggleLike(blogId as string);
            setLikeCount(res.data.likes);
            setLiked(res.data.liked);
        } catch (e) {
            Alert.alert('Error', 'Could not update like');
        } finally {
            setLikeLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to comment.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/login') }
            ]);
            return;
        }
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            const blogId = Array.isArray(id) ? id[0] : id;
            const res = await addComment(blogId as string, newComment.trim());
            setComments(prev => [...prev, res.data]);
            setNewComment('');
        } catch (e) {
            Alert.alert('Error', 'Could not post comment');
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </SafeAreaView>
        );
    }

    if (!blog) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>Blog not found.</Text>
            </SafeAreaView>
        );
    }

    const dateString = blog.createdAt
        ? new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Recently Published';

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <MaterialIcons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Article</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={80}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Cover Image */}
                    {blog.coverImage && (
                        <Image
                            source={{ uri: `http://10.0.2.2:5001/uploads/${blog.coverImage}` }}
                            style={styles.coverImage}
                            resizeMode="cover"
                        />
                    )}

                    {/* Title & Meta */}
                    <Text style={styles.title}>{blog.title}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.authorBadge}>
                            <MaterialIcons name="person" size={14} color="#007BFF" />
                            <Text style={styles.authorText}>{blog.author}</Text>
                        </View>
                        <Text style={styles.dateText}>{dateString}</Text>
                    </View>

                    {/* Like Button */}
                    <View style={styles.likeRow}>
                        <TouchableOpacity
                            style={[styles.likeBtn, liked && styles.likeBtnActive]}
                            onPress={handleLike}
                            disabled={likeLoading}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons
                                name={liked ? 'favorite' : 'favorite-border'}
                                size={20}
                                color={liked ? '#fff' : '#E53935'}
                            />
                            <Text style={[styles.likeBtnText, liked && styles.likeBtnTextActive]}>
                                {likeLoading ? '...' : `${likeCount} ${likeCount === 1 ? 'Like' : 'Likes'}`}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.commentCount}>
                            <MaterialIcons name="chat-bubble-outline" size={18} color="#888" />
                            <Text style={styles.commentCountText}>{comments.length}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Content */}
                    <Text style={styles.content}>{blog.content}</Text>

                    <View style={styles.divider} />

                    {/* Comments Section */}
                    <Text style={styles.commentsTitle}>
                        <MaterialIcons name="forum" size={18} color="#333" /> Comments ({comments.length})
                    </Text>

                    {comments.length === 0 ? (
                        <View style={styles.noComments}>
                            <MaterialIcons name="chat-bubble-outline" size={40} color="#DDD" />
                            <Text style={styles.noCommentsText}>No comments yet. Be the first!</Text>
                        </View>
                    ) : (
                        comments.map((c, i) => (
                            <View key={c._id || i} style={styles.commentCard}>
                                <View style={styles.commentHeader}>
                                    <View style={styles.commentAvatar}>
                                        <Text style={styles.commentAvatarText}>{c.userName?.[0]?.toUpperCase()}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.commentUser}>{c.userName}</Text>
                                        <Text style={styles.commentDate}>
                                            {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.commentText}>{c.text}</Text>
                            </View>
                        ))
                    )}

                    {/* Add Comment */}
                    <View style={styles.addCommentBox}>
                        <Text style={styles.addCommentTitle}>
                            {user ? `Commenting as ${user.firstName}` : 'Login to comment'}
                        </Text>
                        <View style={styles.commentInputRow}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder={user ? "Write a comment..." : "Login to leave a comment"}
                                value={newComment}
                                onChangeText={setNewComment}
                                multiline
                                editable={!!user}
                                placeholderTextColor="#aaa"
                            />
                            <TouchableOpacity
                                style={[styles.sendBtn, (!newComment.trim() || !user) && styles.sendBtnDisabled]}
                                onPress={handleAddComment}
                                disabled={!newComment.trim() || !user || commentLoading}
                            >
                                {commentLoading
                                    ? <ActivityIndicator color="#fff" size="small" />
                                    : <MaterialIcons name="send" size={20} color="#fff" />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    coverImage: { width: '100%', height: 220, borderRadius: 0, marginBottom: 20 },
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15,
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    backBtn: { padding: 5 },
    headerText: { fontSize: 16, fontWeight: 'bold', color: '#333', letterSpacing: 1, textTransform: 'uppercase' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
    title: { fontSize: 26, fontWeight: '900', color: '#111', lineHeight: 34, marginBottom: 14 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    authorBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF',
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4
    },
    authorText: { fontSize: 13, color: '#007BFF', fontWeight: '700' },
    dateText: { fontSize: 12, color: '#888' },
    // Like button
    likeRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
    likeBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        borderWidth: 1.5, borderColor: '#E53935', borderRadius: 24,
        paddingHorizontal: 14, paddingVertical: 8,
    },
    likeBtnActive: { backgroundColor: '#E53935', borderColor: '#E53935' },
    likeBtnText: { fontSize: 14, color: '#E53935', fontWeight: '700' },
    likeBtnTextActive: { color: '#fff' },
    commentCount: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    commentCountText: { fontSize: 14, color: '#888', fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#EAEAEA', marginVertical: 20 },
    content: { fontSize: 16, color: '#333', lineHeight: 26, letterSpacing: 0.2 },
    // Comments
    commentsTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 16 },
    noComments: { alignItems: 'center', paddingVertical: 24 },
    noCommentsText: { fontSize: 14, color: '#aaa', marginTop: 8 },
    commentCard: {
        backgroundColor: '#F8F9FA', borderRadius: 12, padding: 14,
        marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0'
    },
    commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    commentAvatar: {
        width: 34, height: 34, borderRadius: 17,
        backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center'
    },
    commentAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    commentUser: { fontSize: 14, fontWeight: '700', color: '#222' },
    commentDate: { fontSize: 12, color: '#999' },
    commentText: { fontSize: 14, color: '#444', lineHeight: 21 },
    // Add comment
    addCommentBox: { marginTop: 8 },
    addCommentTitle: { fontSize: 14, color: '#888', marginBottom: 10, fontWeight: '600' },
    commentInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
    commentInput: {
        flex: 1, borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 12, fontSize: 15,
        maxHeight: 100, backgroundColor: '#F8F9FA', color: '#333'
    },
    sendBtn: {
        backgroundColor: '#007BFF', borderRadius: 12, padding: 12,
        justifyContent: 'center', alignItems: 'center'
    },
    sendBtnDisabled: { backgroundColor: '#B0C4DE' },
});
