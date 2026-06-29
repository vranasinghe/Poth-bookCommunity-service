import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    StyleSheet, ActivityIndicator, Alert, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../src/context/AuthContext';
import { getShopsByOwnerAPI } from '../../../src/api/shopApi';
import { previewReportAPI, createReportAPI } from '../../../src/api/reportApi';
import { Colors } from '../../../constants/theme';

interface SelectedImage {
    uri: string;
    name: string;
    type: string;
}

export default function StockReportScreen() {
    const router = useRouter();
    const { user } = useContext<any>(AuthContext);

    const [shops, setShops] = useState<any[]>([]);
    const [selectedShopId, setSelectedShopId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState<SelectedImage | null>(null);

    const [loadingShops, setLoadingShops] = useState(true);
    const [previewData, setPreviewData] = useState<any>(null);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchShops = async () => {
            if (!user?.token) return;
            try {
                const res = await getShopsByOwnerAPI(user.token);
                setShops(res.data);
                if (res.data.length > 0) {
                    setSelectedShopId(res.data[0]._id);
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to load your shops.');
            } finally {
                setLoadingShops(false);
            }
        };
        fetchShops();
    }, [user]);

    useEffect(() => {
        const fetchPreview = async () => {
            if (!selectedShopId || !user?.token) return;
            setLoadingPreview(true);
            try {
                const res = await previewReportAPI(selectedShopId, user.token);
                setPreviewData(res.data);
                setTitle(`Stock Update - ${res.data.shopName}`);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingPreview(false);
            }
        };
        fetchPreview();
    }, [selectedShopId, user]);

    const handleImageSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow photo library access.');
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 0.8,
            });
            if (!result.canceled && result.assets?.length > 0) {
                const asset = result.assets[0];
                const fileName = asset.uri.split('/').pop() || 'image.jpg';
                const fileType = asset.mimeType || 'image/jpeg';
                setImage({ uri: asset.uri, name: fileName, type: fileType });
            }
        } catch (e) { Alert.alert('Gallery Error', String(e)); }
    };

    const handleSend = async () => {
        if (!selectedShopId || !title) {
            Alert.alert('Missing Info', 'Please provide a report title.');
            return;
        }
        setSending(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('notes', notes);
            if (image) {
                formData.append('image', {
                    uri: image.uri,
                    name: image.name,
                    type: image.type,
                } as any);
            }

            await createReportAPI(selectedShopId, formData, user?.token);
            Alert.alert('Success', 'Stock report sent to followers!');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to send report.');
        } finally {
            setSending(false);
        }
    };

    if (loadingShops) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Generate Stock Report</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Select Shop</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopSelector}>
                    {shops.map(shop => (
                        <TouchableOpacity
                            key={shop._id}
                            style={[styles.shopChip, selectedShopId === shop._id && styles.shopChipActive]}
                            onPress={() => setSelectedShopId(shop._id)}
                        >
                            <Text style={[styles.shopChipText, selectedShopId === shop._id && styles.shopChipTextActive]}>
                                {shop.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.label}>Report Title</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Monthly Stock Update"
                />

                <Text style={styles.label}>Additional Notes (Optional)</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Message to your followers..."
                    multiline
                />

                <Text style={styles.label}>Report Image (Optional)</Text>
                <TouchableOpacity style={styles.imagePicker} onPress={handleImageSelect}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="image-outline" size={32} color="#003D71" />
                            <Text style={styles.imagePlaceholderText}>Add an attractive cover</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {image && (
                    <TouchableOpacity onPress={() => setImage(null)} style={{ alignSelf: 'flex-start', marginBottom: 15 }}>
                        <Text style={{ color: '#E74C3C', fontWeight: 'bold' }}>Remove Image</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.label}>Stock Breakdown Preview</Text>
                {loadingPreview ? (
                    <ActivityIndicator size="small" color={Colors.light.primary} />
                ) : (
                    <View style={styles.previewBox}>
                        {previewData?.breakdown?.map((item: any, index: number) => (
                            <View key={index} style={styles.previewRow}>
                                <Text style={styles.itemTitle}>{item.bookName}</Text>
                                <Text style={styles.itemStock}>Qty: {item.stockAmount}</Text>
                            </View>
                        ))}
                        {previewData?.breakdown?.length === 0 && (
                            <Text style={styles.emptyText}>No books found in this shop.</Text>
                        )}
                    </View>
                )}

                <TouchableOpacity 
                    style={[styles.submitBtn, sending && { opacity: 0.7 }]} 
                    onPress={handleSend}
                    disabled={sending}
                >
                    {sending ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitBtnText}>Send Report to Followers</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#FFF' },
    backBtn: { marginRight: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#003D71' },
    content: { padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8, marginTop: 10 },
    shopSelector: { flexDirection: 'row', marginBottom: 15 },
    shopChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#E8EDF2', marginRight: 10 },
    shopChipActive: { backgroundColor: '#003D71' },
    shopChipText: { color: '#003D71', fontWeight: '600' },
    shopChipTextActive: { color: '#FFF' },
    input: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#DDD', padding: 14, fontSize: 15, marginBottom: 15 },
    textArea: { height: 100, textAlignVertical: 'top' },
    imagePicker: { backgroundColor: '#E8EDF2', borderRadius: 12, overflow: 'hidden', height: 150, justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderStyle: 'dashed', borderColor: '#003D71' },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    imagePlaceholder: { alignItems: 'center' },
    imagePlaceholderText: { color: '#003D71', marginTop: 5, fontWeight: '500' },
    previewBox: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, marginBottom: 30, borderWidth: 1, borderColor: '#EEE' },
    previewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    itemTitle: { fontSize: 14, color: '#333', flex: 1 },
    itemStock: { fontSize: 14, fontWeight: 'bold', color: '#003D71', marginLeft: 10 },
    emptyText: { textAlign: 'center', color: '#888', fontStyle: 'italic', padding: 10 },
    submitBtn: { backgroundColor: '#27ae60', borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
