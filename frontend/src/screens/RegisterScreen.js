import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { registerUserAPI } from '../api/userApi';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        nearestCity: '', phoneNumber: '', userType: 'Customer'
    });

    const handleRegister = async () => {
        try {
            const response = await registerUserAPI(formData);
            if (response.data) {
                Alert.alert("Account creation successfull");
            }
        } catch (error) {
            Alert.alert("Something Went wrong!", error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Create a new Account</Text>

            <TextInput placeholder="First Name" style={styles.input} onChangeText={(text) => setFormData({ ...formData, firstName: text })} />

            <TextInput placeholder="Last Name" style={styles.input} onChangeText={(text) => setFormData({ ...formData, lastName: text })} />

            <TextInput placeholder="Nearest City" style={styles.input} onChangeText={(text) => setFormData({ ...formData, nearestCity: text })} />

            <TextInput placeholder="Phone Number" style={styles.input} onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })} />

            <TextInput placeholder="Email" style={styles.input} onChangeText={(text) => setFormData({ ...formData, email: text })} />

            <TextInput placeholder="Password" style={styles.input} onChangeText={(text) => setFormData({ ...formData, password: text })} />

            <Text style={styles.subText}>Select the User Type</Text>
            <View style={styles.typeContainer}>
                <TouchableOpacity
                    style={[styles.typeButton, formData.userType === 'Customer' && styles.activeType]}
                    onPress={() => setFormData({ ...formData, userType: 'Customer' })}>
                    <Text style={formData.userType === 'Customer' ? styles.activeText : styles.normalText}>Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.typeButton, formData.userType === 'Shop Owner' && styles.activeType]}
                    onPress={() => setFormData({ ...formData, userType: 'Shop Owner' })}>
                    <Text style={formData.userType === 'Shop Owner' ? styles.activeText : styles.normalText}>Shop Owner</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>REGISTER</Text>
            </TouchableOpacity>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: { padding: 25, paddingTop: 60, backgroundColor: '#f9f9f9', flexGrow: 1 },
    header: { fontSize: 26, fontWeight: 'bold', marginBottom: 25, color: '#333', textAlign: 'center' },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15, padding: 12, fontSize: 16 },
    subText: { fontSize: 16, marginBottom: 10, color: '#555', fontWeight: 'bold' },
    typeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
    typeButton: { flex: 1, padding: 12, borderWidth: 1, borderRadius: 8, borderColor: '#ccc', alignItems: 'center', marginHorizontal: 5, backgroundColor: '#fff' },
    activeType: { backgroundColor: '#007bff', borderColor: '#007bff' },
    normalText: { color: '#333' },
    activeText: { color: '#fff', fontWeight: 'bold' },
    button: { backgroundColor: '#28a745', padding: 15, alignItems: 'center', borderRadius: 8, elevation: 2 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});

export default RegisterScreen;