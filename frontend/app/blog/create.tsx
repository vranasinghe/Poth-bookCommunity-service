import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createBlog } from '../../src/api/blogApi';

export default function CreateBlog() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title || !content || !author) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await createBlog({ title, content, author });
            alert('Blog created successfully!');
            router.back();
        } catch (error) {
            console.error('Error creating blog:', error);
            alert('Failed to create blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Create New Blog</Text>
            
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

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Submit</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
    textArea: { height: 120, textAlignVertical: 'top' },
    submitBtn: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
