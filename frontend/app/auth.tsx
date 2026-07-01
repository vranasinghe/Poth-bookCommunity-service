import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
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
  const theme = useTheme();
  const styles = createStyles(theme);

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
          router.replace('/owner' as any);
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
          router.replace('/owner' as any);
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
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
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
                    <Ionicons name="logo-apple" size={24} color={theme.colors.textPrimary} />
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

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.md,
  },
  welcomeTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.h1.fontSize,
    fontWeight: theme.typography.scale.h1.fontWeight,
    lineHeight: theme.typography.scale.h1.lineHeight,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  welcomeSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.body.fontSize,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.xs,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: theme.radii.sm - 2,
  },
  userTypeActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.subtle,
  },
  userTypeText: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  userTypeTextActive: {
    color: theme.colors.primary,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPassText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.caption.fontSize,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  mainButton: {
    marginBottom: theme.spacing.xl,
  },
  dividerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    paddingHorizontal: 15,
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  socialButton: {
    width: width * 0.38,
    height: 56,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  toggleText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.scale.bodySmall.fontSize,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});
