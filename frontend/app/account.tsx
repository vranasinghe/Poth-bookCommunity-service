import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../src/context/AuthContext';
import { updateUserAPI, deleteUserAPI } from '../src/api/userApi';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';

export default function AccountScreen() {
  const { user, logoutContext, updateUserContext } = useContext(AuthContext);
  const router = useRouter();
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');

  const s = createStyles(theme);

  const handleLogout = () => {
    const performLogout = async () => { await logoutContext(); };
    if (Platform.OS === 'web') {
      if (window.confirm("Logout: Are you sure you want to log out?")) performLogout();
    } else {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: performLogout },
      ]);
    }
  };

  const handleUpdate = async () => {
    if (!user?.token) return;
    try {
      const res = await updateUserAPI({ firstName, lastName, email }, user.token);
      await updateUserContext(res.data);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", error);
      Alert.alert("Error", "Could not update profile");
    }
  };

  const handleDelete = () => {
    const performDelete = async () => {
      if (!user?.token) return;
      try {
        await deleteUserAPI(user.token);
        await logoutContext();
      } catch (error) {
        console.error("Delete account error:", error);
        Alert.alert("Error", "Could not delete account");
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm("Delete Account: This action is irreversible. Are you completely sure?")) performDelete();
    } else {
      Alert.alert("Delete Account", "This action is irreversible. Are you completely sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete It", style: "destructive", onPress: performDelete },
      ]);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={s.header}>
            <Text style={s.title}>Account</Text>
            {isEditing && (
              <TouchableOpacity onPress={handleUpdate}>
                <Text style={s.saveText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={s.content}>
            <View style={s.profileSection}>
              <View style={s.avatarPlaceholder}>
                <Text style={s.avatarText}>
                  {user ? user.firstName.charAt(0) + user.lastName.charAt(0) : '?'}
                </Text>
              </View>
              {!isEditing ? (
                <>
                  <Text style={s.userName}>{user?.firstName} {user?.lastName}</Text>
                  <Text style={s.userEmail}>{user?.email}</Text>
                </>
              ) : (
                <View style={s.editForm}>
                  <TextInput style={s.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor={theme.colors.textMuted} />
                  <TextInput style={s.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor={theme.colors.textMuted} />
                  <TextInput style={s.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" placeholderTextColor={theme.colors.textMuted} />
                </View>
              )}
            </View>

            <View style={s.menu}>
              <TouchableOpacity style={s.menuItem} onPress={() => setIsEditing(!isEditing)}>
                <Ionicons name="settings-outline" size={24} color={theme.colors.textSecondary} />
                <Text style={s.menuText}>{isEditing ? "Cancel Edit" : "Edit Profile"}</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity style={s.menuItem} onPress={() => router.push('/orders')}>
                <Ionicons name="cart-outline" size={24} color={theme.colors.textSecondary} />
                <Text style={s.menuText}>My Orders</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity style={s.menuItem} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
                <Text style={[s.menuText, { color: theme.colors.error }]}>Delete Account</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
                <Text style={[s.menuText, { color: theme.colors.error }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  title: { fontSize: theme.typography.scale.h2.fontSize, fontWeight: '700', color: theme.colors.primary },
  saveText: { color: theme.colors.primary, fontSize: 16, fontWeight: 'bold' },
  content: { flex: 1, padding: theme.spacing.lg },
  profileSection: { alignItems: 'center', marginBottom: theme.spacing.xxl },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: { color: 'white', fontSize: 36, fontWeight: 'bold', textTransform: 'uppercase' },
  userName: { fontSize: 20, fontWeight: 'bold', color: theme.colors.textPrimary },
  userEmail: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 5 },
  editForm: { width: '100%', marginTop: theme.spacing.md },
  input: {
    backgroundColor: theme.colors.surfaceMuted,
    padding: theme.spacing.md,
    borderRadius: theme.radii.sm,
    marginBottom: theme.spacing.sm,
    width: '100%',
    fontSize: 16,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menu: { backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, ...theme.shadows.subtle },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuText: { flex: 1, fontSize: 16, color: theme.colors.textPrimary, marginLeft: theme.spacing.md },
});
