import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginUserAPI, registerUserAPI } from '../src/api/userApi';
import { AuthContext } from '../src/context/AuthContext';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('Customer'); // Default Reader/Customer
  const [nearestCity, setNearestCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { loginContext } = useContext(AuthContext);

  const handleAuth = async () => {
    if (isLogin) {
        if (!email || !password) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }
    } else {
        if (!email || !password || !firstName || !userType || !nearestCity || !phoneNumber) {
            Alert.alert("Error", "Please fill all required fields");
            return;
        }
    }

    setLoading(true);
    try {
        if (isLogin) {
            const res = await loginUserAPI({ email, password });
            await loginContext(res.data);
            // Navigate based on userType
            if (res.data.userType === 'Shop Owner') {
                router.replace('/owner/dashboard');
            } else {
                router.replace('/(tabs)/dashboard');
            }
        } else {
            const payload = {
                firstName,
                lastName,
                email,
                password,
                userType,
                nearestCity,
                phoneNumber
            };
            const res = await registerUserAPI(payload);
            await loginContext(res.data);
            // Navigate based on userType
            if (res.data.userType === 'Shop Owner') {
                router.replace('/owner/dashboard');
            } else {
                router.replace('/(tabs)/dashboard');
            }
        }
    } catch (error: any) {
        Alert.alert("Authentication Failed", error.response?.data?.message || "Something went wrong");
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>poth</Text>
            </View>
            <Text style={styles.welcomeTitle}>{isLogin ? 'Welcome back' : 'Join the library'}</Text>
            <Text style={styles.welcomeSub}>
              {isLogin ? 'Continue your curated journey.' : 'Start your literary adventure with us.'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLogin && (
              <>
                <View style={styles.userTypeContainer}>
                    <TouchableOpacity 
                        style={[styles.userTypeButton, userType === 'Customer' && styles.userTypeActive]} 
                        onPress={() => setUserType('Customer')}
                    >
                        <Text style={[styles.userTypeText, userType === 'Customer' && styles.userTypeTextActive]}>Reader</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.userTypeButton, userType === 'Shop Owner' && styles.userTypeActive]} 
                        onPress={() => setUserType('Shop Owner')}
                    >
                        <Text style={[styles.userTypeText, userType === 'Shop Owner' && styles.userTypeTextActive]}>Shop Owner</Text>
                    </TouchableOpacity>
                </View>
                <Input 
                  label="First Name" 
                  placeholder="John" 
                  autoCapitalize="words"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <Input 
                  label="Last Name" 
                  placeholder="Doe" 
                  autoCapitalize="words"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <Input 
                  label="Nearest City" 
                  placeholder="Colombo" 
                  autoCapitalize="words"
                  value={nearestCity}
                  onChangeText={setNearestCity}
                />
                <Input 
                  label="Phone Number" 
                  placeholder="0712345678" 
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </>
            )}
            
            <Input 
              label="Email Address" 
              placeholder="reader@poth.com" 
              keyboardType="email-address"
              autoCapitalize="none"
              rightIcon="mail-outline"
              value={email}
              onChangeText={setEmail}
            />
            
            <Input 
              label="Password" 
              placeholder="••••••••" 
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              value={password}
              onChangeText={setPassword}
            />

            {isLogin && (
              <TouchableOpacity style={styles.forgotPass}>
                <Text style={styles.forgotPassText}>FORGOT PASSWORD?</Text>
              </TouchableOpacity>
            )}

            <Button 
              title={loading ? "Processing..." : (isLogin ? 'Log in' : 'Sign up')} 
              onPress={handleAuth}
              icon="arrow-forward"
              style={styles.mainButton}
              disabled={loading}
            />

            {isLogin && (
            <View>
                <View style={styles.dividerBox}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR CURATE WITH</Text>
                <View style={styles.divider} />
                </View>

                <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={24} color="#EA4335" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-apple" size={24} color="#000000" />
                </TouchableOpacity>
                </View>
            </View>
            )}
          </View>

          {/* Toggle */}
          <View style={styles.footer}>
             <Text style={styles.footerText}>
              {isLogin ? 'New to the library? ' : 'Already a curator? '}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.toggleText}>{isLogin ? 'Sign up' : 'Log in'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    marginBottom: 30,
  },
  logoText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'normal',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.light.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSub: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  userTypeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      padding: 5
  },
  userTypeButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 10
  },
  userTypeActive: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 2
  },
  userTypeText: {
      fontWeight: '600',
      color: '#999'
  },
  userTypeTextActive: {
      color: Colors.light.primary
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPassText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  mainButton: {
    marginBottom: 40,
  },
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    paddingHorizontal: 15,
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: width * 0.35,
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  toggleText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
});
