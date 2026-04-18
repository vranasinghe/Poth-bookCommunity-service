import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator,
    KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../src/context/AuthContext';

const API_URL = 'http://10.0.2.2:5001/api/users/login';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(API_URL, { email, password });
            await login(response.data); // Stores user in context + AsyncStorage
            router.replace('/'); // Go to Home
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Login failed. Check your credentials.';
            Alert.alert('Login Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.logoSection}>
                    <View style={styles.logoCircle}>
                        <MaterialIcons name="menu-book" size={40} color="#fff" />
                    </View>
                    <Text style={styles.appName}>Poth Community</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="email" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#aaa"
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="lock" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginBtnText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.registerLink}>Register Here</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F7F9FA' },
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
    logoSection: { alignItems: 'center', marginBottom: 40 },
    logoCircle: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: '#007BFF',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 14, elevation: 6,
        shadowColor: '#007BFF', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8
    },
    appName: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', letterSpacing: 0.5 },
    subtitle: { fontSize: 15, color: '#777', marginTop: 6 },
    form: { gap: 14 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E8',
        paddingHorizontal: 14, height: 54,
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4,
    },
    inputIcon: { marginRight: 10 },
    eyeIcon: { position: 'absolute', right: 14 },
    input: { flex: 1, fontSize: 16, color: '#333' },
    loginBtn: {
        backgroundColor: '#007BFF', height: 54, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginTop: 6,
        elevation: 4, shadowColor: '#007BFF', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8,
    },
    loginBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 },
    registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
    registerText: { color: '#666', fontSize: 15 },
    registerLink: { color: '#007BFF', fontWeight: '700', fontSize: 15 },
});
