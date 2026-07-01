import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';

export default function ViewSlipScreen() {
    const { url } = useLocalSearchParams();
    const router = useRouter();
    const theme = useTheme();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Payment Slip</Text>
                <View style={{ width: 28 }} />
            </View>
            
            <View style={styles.imageContainer}>
                {url ? (
                    <Image 
                        source={{ uri: Array.isArray(url) ? url[0] : url }} 
                        style={styles.image} 
                        resizeMode="contain" 
                    />
                ) : (
                    <Text>No image found</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 20, 
        backgroundColor: '#fff' 
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    backBtn: { padding: 5 },
    imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: '100%' }
});
