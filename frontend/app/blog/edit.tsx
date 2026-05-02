import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Image, ScrollView, Alert, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getBlogById, updateBlog } from '../../src/api/blogApi';

const IMAGE_BASE = 'http://10.0.2.2:5001/uploads/';

interface SelectedImage {
    uri: string;
    name: string;
    type: string;
}

export default function EditBlog() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [penName, setPenName] = useState('');
    const [existingImage, setExistingImage] = useState(null); // filename from server
    const [newImage, setNewImage] = useState<SelectedImage | null>(null);           // newly picked local image
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogId = Array.isArray(id) ? id[0] : id;
                const response = await getBlogById(blogId as string);
                setTitle(response.data.title);
                setContent(response.data.content);
                setPenName(response.data.penName || '');
                setExistingImage(response.data.coverImage || null);
            } catch (error) {
                console.error('Fetch blog error:', error);
                Alert.alert('Error', 'Could not fetch blog details');
                router.back();
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBlog();
    }, [id, router]);

    const handleImageSelect = () => {
        Alert.alert('Change Cover Image', 'Choose a source', [
            { text: '📷 Take Photo', onPress: openCamera },
            { text: '🖼️ Choose from Gallery', onPress: openGallery },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow camera access.');
            return;
        }
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 0.8,
            });
            if (!result.canceled && result.assets?.length > 0) processImage(result.assets[0]);
        } catch (e) { Alert.alert('Camera Error', String(e)); }
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow photo library access.');
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,  // Skip crop screen entirely
                quality: 0.8,
            });
            if (!result.canceled && result.assets?.length > 0) processImage(result.assets[0]);
        } catch (e) { Alert.alert('Gallery Error', String(e)); }
    };

    const processImage = (asset: ImagePicker.ImagePickerAsset) => {
        const fileName = asset.uri.split('/').pop() || 'image.jpg';
        const fileType = asset.mimeType || 'image/jpeg';
        setNewImage({ uri: asset.uri, name: fileName, type: fileType });
        setExistingImage(null); // Hide old image preview
    };

    const handleUpdate = async () => {
        if (!title || !content) {
            Alert.alert('Missing Fields', 'Please fill in title and content.');
            return;
        }
        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (penName) formData.append('penName', penName);
            if (newImage) {
                if (Platform.OS === 'web') {
                    const response = await fetch(newImage.uri);
                    const blob = await response.blob();
                    formData.append('coverImage', blob, newImage.name);
                } else {
                    formData.append('coverImage', {
                        uri: newImage.uri,
                        name: newImage.name,
                        type: newImage.type,
                    } as any);
                }
            }
            const blogId = Array.isArray(id) ? id[0] : id;
            await updateBlog(blogId as string, formData);
            Alert.alert('Success ✅', 'Blog updated successfully!');
            router.back();
        } catch (error: any) {
            console.error('Error updating blog:', error?.response?.data || error.message);
            Alert.alert('Error', 'Failed to update blog.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    // Determine what image preview to show
    const previewUri = newImage?.uri
        ? newImage.uri
        : existingImage
            ? `${IMAGE_BASE}${existingImage}`
            : null;

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.headerTitle}>Edit Blog</Text>

            {/* Cover Image Picker */}
            <TouchableOpacity style={styles.imagePicker} onPress={handleImageSelect} activeOpacity={0.8}>
                {previewUri ? (
                    <Image source={{ uri: previewUri }} style={styles.previewImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <MaterialIcons name="add-photo-alternate" size={44} color="#007BFF" />
                        <Text style={styles.imagePlaceholderText}>Tap to add cover image</Text>
                        <Text style={styles.imagePlaceholderSub}>Camera or Gallery</Text>
                    </View>
                )}
            </TouchableOpacity>

            {previewUri && (
                <View style={styles.imageActions}>
                    <TouchableOpacity style={styles.changeImageBtn} onPress={handleImageSelect}>
                        <MaterialIcons name="edit" size={14} color="#007BFF" />
                        <Text style={styles.changeImageText}>Change Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeImageBtn} onPress={() => { setNewImage(null); setExistingImage(null); }}>
                        <MaterialIcons name="close" size={14} color="#E53935" />
                        <Text style={styles.removeImageText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <TextInput style={styles.input} placeholder="Pen Name (Optional)" value={penName} onChangeText={setPenName} />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Content"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={6}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate} disabled={updating} activeOpacity={0.85}>
                {updating
                    ? <ActivityIndicator color="#fff" />
                    : (
                        <View style={styles.btnInner}>
                            <MaterialIcons name="save" size={20} color="#fff" />
                            <Text style={styles.btnText}>Save Changes</Text>
                        </View>
                    )
                }
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
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
        backgroundColor: '#2196F3', padding: 16, borderRadius: 12,
        alignItems: 'center', marginTop: 6, elevation: 3
    },
    btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
