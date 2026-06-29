import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const router = useRouter();

    const FeatureCard = ({ icon, title, description }) => (
        <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={32} color="#007bff" />
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </View>
    );

    const ShopCard = ({ name, location, rating }) => (
        <View style={styles.shopCard}>
            <View style={styles.shopImagePlaceholder}>
                <Ionicons name="book-outline" size={40} color="#ccc" />
            </View>
            <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{name}</Text>
                <Text style={styles.shopLocation}>{location}</Text>
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={14} color="#ffc107" />
                    <Text style={styles.ratingText}>{rating}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroHeadline}>Connecting Book Lovers with Their Next Great Read.</Text>
                    <Text style={styles.heroSubheadline}>
                        Discover local bookshops, explore curated collections, and share your reading experiences with the community.
                    </Text>
                    <View style={styles.ctaContainer}>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => console.log('Explore Shops')}>
                            <Text style={styles.primaryButtonText}>Explore Shops</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/register')}>
                            <Text style={styles.secondaryButtonText}>Register Your Shop</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Features Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Why Poth?</Text>
                    <View style={styles.featuresGrid}>
                        <FeatureCard 
                            icon="location-outline" 
                            title="Find Local Shops" 
                            description="Locate the best bookshops in your nearest city with ease." 
                        />
                        <FeatureCard 
                            icon="star-outline" 
                            title="Trusted Reviews" 
                            description="Read authentic feedback from fellow readers before you visit." 
                        />
                        <FeatureCard 
                            icon="people-outline" 
                            title="Community Driven" 
                            description="Join a growing network of bibliophiles and shop owners dedicated to the love of books." 
                        />
                    </View>
                </View>

                {/* How It Works Section */}
                <View style={[styles.section, styles.howItWorksBg]}>
                    <Text style={styles.sectionHeader}>How It Works</Text>
                    
                    <View style={styles.howItWorksGroup}>
                        <Text style={styles.subHeader}>For Readers</Text>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>1</Text>
                            <Text style={styles.stepText}>Search for a shop by location or name.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>2</Text>
                            <Text style={styles.stepText}>Visit the shop and enjoy your books.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>3</Text>
                            <Text style={styles.stepText}>Leave a rating and a comment to help others.</Text>
                        </View>
                    </View>

                    <View style={styles.howItWorksGroup}>
                        <Text style={styles.subHeader}>For Shop Owners</Text>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>1</Text>
                            <Text style={styles.stepText}>Create an account and register your shop details.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>2</Text>
                            <Text style={styles.stepText}>Build your profile and showcase your location.</Text>
                        </View>
                        <View style={styles.step}>
                            <Text style={styles.stepNumber}>3</Text>
                            <Text style={styles.stepText}>Engage with customers through their feedback.</Text>
                        </View>
                    </View>
                </View>

                {/* Featured Shops Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Featured Shops</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredShopsScroll}>
                        <ShopCard name="City Books" location="Colombo" rating="4.8" />
                        <ShopCard name="The Reading Nook" location="Kandy" rating="4.5" />
                        <ShopCard name="Wisdom Corner" location="Galle" rating="4.9" />
                    </ScrollView>
                </View>

                {/* Footer Section */}
                <View style={styles.footer}>
                    <Text style={styles.footerBrand}>Poth</Text>
                    <Text style={styles.footerTagline}>Empowering the local book community.</Text>
                    <View style={styles.footerLinks}>
                        <TouchableOpacity><Text style={styles.footerLink}>About Us</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.footerLink}>Contact</Text></TouchableOpacity>
                        <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flexGrow: 1 },
    heroSection: {
        padding: 30,
        paddingTop: 60,
        paddingBottom: 60,
        backgroundColor: '#f0f7ff',
        alignItems: 'center',
    },
    heroHeadline: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 40,
    },
    heroSubheadline: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 26,
    },
    ctaContainer: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    primaryButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        elevation: 3,
    },
    primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    secondaryButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#007bff',
    },
    secondaryButtonText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },
    
    section: { padding: 25, paddingVertical: 50 },
    sectionHeader: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 30, textAlign: 'center' },
    
    featuresGrid: { gap: 20 },
    featureCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#e6f2ff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    featureDescription: { fontSize: 16, color: '#666', lineHeight: 24 },

    howItWorksBg: { backgroundColor: '#f9f9f9' },
    howItWorksGroup: { marginBottom: 30 },
    subHeader: { fontSize: 20, fontWeight: 'bold', color: '#007bff', marginBottom: 20 },
    step: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    stepNumber: {
        width: 32,
        height: 32,
        backgroundColor: '#007bff',
        borderRadius: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 32,
        fontWeight: 'bold',
        marginRight: 15,
    },
    stepText: { fontSize: 16, color: '#444', flex: 1 },

    featuredShopsScroll: { paddingRight: 25 },
    shopCard: {
        width: width * 0.7,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 4,
    },
    shopImagePlaceholder: {
        height: 150,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shopInfo: { padding: 15 },
    shopName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    shopLocation: { fontSize: 14, color: '#666', marginVertical: 5 },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff9e6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    ratingText: { marginLeft: 5, fontSize: 14, fontWeight: 'bold', color: '#ffa000' },

    footer: {
        backgroundColor: '#1a1a1a',
        padding: 40,
        alignItems: 'center',
    },
    footerBrand: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    footerTagline: { color: '#aaa', fontSize: 14, marginBottom: 30, textAlign: 'center' },
    footerLinks: { flexDirection: 'row', gap: 20 },
    footerLink: { color: '#007bff', fontSize: 14, fontWeight: '500' },
});

export default HomeScreen;
