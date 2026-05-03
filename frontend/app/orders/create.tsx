import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../src/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { createOrderAPI } from '../../src/api/orderApi';
import { getBookByIdAPI } from '../../src/api/bookApi';

export default function CreateOrderScreen() {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const params = useLocalSearchParams();

    const bookId = (Array.isArray(params.bookId) ? params.bookId[0] : params.bookId) || "64a2b9f0d11c7b8c8d839222";
    const shopId = (Array.isArray(params.shopId) ? params.shopId[0] : params.shopId) || "64a2b9f0d11c7b8c8d839211";
    const [bookDetails, setBookDetails] = useState<any>(null);

    const [quantity, setQuantity] = useState('1');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [image, setImage] = useState<any>(null);

    React.useEffect(() => {
        const fetchBook = async () => {
            try {
                if (bookId) {
                    const res = await getBookByIdAPI(bookId);
                    setBookDetails(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch book in order creation:", err);
            }
        };
        fetchBook();
    }, [bookId]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleCreateOrder = async () => {
        if (!address || !city || !phone || !image) {
            if (Platform.OS === 'web') { window.alert("Please fill all details and upload payment slip"); }
            else { Alert.alert("Error", "Please fill all details and upload payment slip"); }
            return;
        }

        const pricePerItem = bookDetails ? bookDetails.price : 2000;

        const formData = new FormData();
        formData.append('reader', user?._id || '');
        formData.append('shop', shopId);
        formData.append('book', bookId);
        formData.append('quantity', quantity);
        formData.append('totalPrice', String(Number(quantity) * pricePerItem));
        formData.append('deliveryDetails', JSON.stringify({ address, city, phone }));

        if (image) {
            if (Platform.OS === 'web') {
                const response = await fetch(image.uri);
                const blob = await response.blob();
                formData.append('paymentSlip', blob, 'paymentSlip.jpg');
            } else {
                const uri = image.uri;
                const name = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(name || '');
                const type = match ? `image/${match[1]}` : `image`;

                // @ts-ignore
                formData.append('paymentSlip', {
                    uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
                    name: name,
                    type: type,
                });
            }
        }

        try {
            await createOrderAPI(formData);
            if (Platform.OS === 'web') {
                window.alert("Test Order Created Successfully!");
                router.replace('/orders');
            } else {
                Alert.alert("Success", "Test Order Created Successfully!", [
                    { text: "OK", onPress: () => router.replace('/orders') }
                ]);
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to create order";
            if (Platform.OS === 'web') { window.alert(`Error: ${errorMsg}`); }
            else { Alert.alert("Error", errorMsg); }
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Create Test Order</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.mockInfoCard}>
                    <Text style={styles.mockTitle}>Checkout Details:</Text>
                    <Text style={styles.mockItem}>Book: {bookDetails ? bookDetails.title : "Loading..."} (Rs. {bookDetails ? bookDetails.price : 2000})</Text>
                </View>

                <Text style={styles.label}>Quantity</Text>
                <View style={styles.qtyContainer}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setQuantity(String(Math.max(1, Number(quantity) - 1)))}>
                        <Ionicons name="remove" size={20} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => setQuantity(String(Number(quantity) + 1))}>
                        <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.headerTitle}>Delivery Details</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.input}
                    placeholder="City"
                    value={city}
                    onChangeText={setCity}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={phone}
                    keyboardType="phone-pad"
                    onChangeText={setPhone}
                />

                <Text style={styles.headerTitle}>Payment Slip</Text>
                <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                    <Ionicons name="camera" size={24} color="#666" />
                    <Text style={styles.imageBtnText}>{image ? "Change Slip Photo" : "Upload Payment Slip"}</Text>
                </TouchableOpacity>

                {image && (
                    <View style={styles.previewContainer}>
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                        <Text style={styles.previewText}>Slip attached successfully</Text>
                    </View>
                )}

                <TouchableOpacity style={styles.submitBtn} onPress={handleCreateOrder}>
                    <Text style={styles.submitBtnText}>Place Order (Rs. {Number(quantity) * (bookDetails ? bookDetails.price : 2000)})</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
    title: { fontSize: 20, fontWeight: 'bold' },
    backBtn: { padding: 5 },
    content: { padding: 20 },
    mockInfoCard: { backgroundColor: '#f0f8ff', padding: 15, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#b0d4ff' },
    mockTitle: { fontWeight: 'bold', marginBottom: 5, color: '#0056b3' },
    mockItem: { color: '#333', fontSize: 14 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    qtyContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    qtyBtn: { backgroundColor: Colors.light.primary, padding: 10, borderRadius: 8 },
    qtyText: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
    imageBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' },
    imageBtnText: { marginLeft: 10, color: '#666', fontSize: 16 },
    previewContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: '#e8f5e9', padding: 10, borderRadius: 8 },
    previewText: { marginLeft: 10, color: '#2e7d32', fontWeight: '500' },
    submitBtn: { backgroundColor: Colors.light.primary, padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
