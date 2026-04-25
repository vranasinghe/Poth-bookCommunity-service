import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Image, ScrollView, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createBlog } from '../../src/api/blogApi';

export default function CreateBlog() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageSelect = () => {
        Alert.alert(
            'Add Cover Image',
            'Choose a source',
            [
                {
                    text: '📷 Take Photo',
                    onPress: openCamera,
                },
                {
                    text: '🖼️ Choose from Gallery',
                    onPress: openGallery,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow camera access to take a photo.');
            return;
        }
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,  // Skip crop screen
                quality: 0.8,
            });
            if (!result.canceled && result.assets?.length > 0) {
                processImage(result.assets[0]);
            }
        } catch (e) {
            Alert.alert('Camera Error', String(e));
        }
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photo library.');
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,  // Skip crop screen entirely
                quality: 0.8,
            });
            if (!result.canceled && result.assets?.length > 0) {
                processImage(result.assets[0]);
            }
        } catch (e) {
            Alert.alert('Gallery Error', String(e));
        }
    };

    const processImage = (asset) => {
        const fileName = asset.uri.split('/').pop();
        const fileType = asset.mimeType || 'image/jpeg';
        setCoverImage({ uri: asset.uri, name: fileName, type: fileType });
    };

    const handleCreate = async () => {
        if (!title || !content || !author) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('author', author);
            if (coverImage) {
                formData.append('coverImage', {
                    uri: coverImage.uri,
                    name: coverImage.name,
                    type: coverImage.type,
                } as any);
            }
            await createBlog(formData);
            Alert.alert('Success ✅', 'Blog published successfully!');
            router.back();
        } catch (error: any) {
            console.error('Error creating blog:', error?.response?.data || error.message);
            Alert.alert('Error', 'Failed to create blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.headerTitle}>Create New Blog</Text>

            {/* Cover Image Picker */}
            <TouchableOpacity style={styles.imagePicker} onPress={handleImageSelect} activeOpacity={0.8}>
                {coverImage ? (
                    <Image source={{ uri: coverImage.uri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <MaterialIcons name="add-photo-alternate" size={44} color="#007BFF" />
                        <Text style={styles.imagePlaceholderText}>Tap to add cover image</Text>
                        <Text style={styles.imagePlaceholderSub}>Camera or Gallery</Text>
                    </View>
                )}
            </TouchableOpacity>

            {coverImage && (
                <View style={styles.imageActions}>
                    <TouchableOpacity style={styles.changeImageBtn} onPress={handleImageSelect}>
                        <MaterialIcons name="edit" size={14} color="#007BFF" />
                        <Text style={styles.changeImageText}>Change Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeImageBtn} onPress={() => setCoverImage(null)}>
                        <MaterialIcons name="close" size={14} color="#E53935" />
                        <Text style={styles.removeImageText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            )}

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

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreate} disabled={loading} activeOpacity={0.85}>
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : (
                        <View style={styles.btnInner}>
                            <MaterialIcons name="publish" size={20} color="#fff" />
                            <Text style={styles.btnText}>Publish Blog</Text>
                        </View>
                    )
                }
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f5f5f5', flexGrow: 1 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
    imagePicker: {
        borderRadius: 14, overflow: 'hidden', marginBottom: 10,
        borderWidth: 2, borderColor: '#C0D8FF', borderStyle: 'dashed',
    },
    previewImage: { width: '100%', height: 200, resizeMode: 'cover' },
    imagePlaceholder: {
        height: 160, backgroundColor: '#EEF5FF',
        justifyContent: 'center', alignItems: 'center', gap: 6
    },
    imagePlaceholderText: { fontSize: 15, color: '#007BFF', fontWeight: '600' },
    imagePlaceholderSub: { fontSize: 12, color: '#888' },
    imageActions: { flexDirection: 'row', gap: 16, marginBottom: 14 },
    changeImageBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    changeImageText: { color: '#007BFF', fontSize: 13, fontWeight: '600' },
    removeImageBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    removeImageText: { color: '#E53935', fontSize: 13, fontWeight: '600' },
    input: {
        backgroundColor: '#fff', padding: 14, borderRadius: 10,
        marginBottom: 14, borderWidth: 1, borderColor: '#ddd', fontSize: 15
    },
    textArea: { height: 140, textAlignVertical: 'top' },
    submitBtn: {
        backgroundColor: '#007BFF', padding: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 6, elevation: 3
    },
    btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
