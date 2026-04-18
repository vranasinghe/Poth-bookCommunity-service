import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getBlogById, updateBlog } from '../../src/api/blogApi';

export default function EditBlog() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await getBlogById(id);
                setTitle(response.data.title);
                setContent(response.data.content);
                setAuthor(response.data.author);
            } catch (error) {
                console.error('Error fetching blog details', error);
                alert('Could not fetch blog details');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id]);

    const handleUpdate = async () => {
        if (!title || !content || !author) {
            alert('Please fill all fields');
            return;
        }

        setUpdating(true);
        try {
            await updateBlog(id, { title, content, author });
            alert('Blog updated successfully!');
            router.back();
        } catch (error) {
            console.error('Error updating blog:', error);
            alert('Failed to update blog');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Edit Blog</Text>
            
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Author" value={author} onChangeText={setAuthor} />
            <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Content" 
                value={content} 
                onChangeText={setContent} 
                multiline 
                numberOfLines={6}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate} disabled={updating}>
                {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Update</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
    textArea: { height: 120, textAlignVertical: 'top' },
    submitBtn: { backgroundColor: '#2196F3', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
