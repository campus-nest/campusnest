import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Svg width={100} height={96} viewBox="0 0 100 96" fill="none">
          <Rect width="100" height="96" fill="#010000" />
          <Path
            d="M37.5 88V48H62.5V88M12.5 36L50 8L87.5 36V80C87.5 82.1217 86.622 84.1566 85.0592 85.6569C83.4964 87.1571 81.3768 88 79.1667 88H20.8333C18.6232 88 16.5036 87.1571 14.9408 85.6569C13.378 84.1566 12.5 82.1217 12.5 80V36Z"
            stroke="#F5F5F5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* Title */}
      <Text style={styles.title}>CampusNest</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Lets get Started!</Text>

      {/* Login Button */}
      <Link href="/login" asChild>
        <Pressable style={styles.loginBtn}>
          <Text style={styles.btnText}>Login</Text>
        </Pressable>
      </Link>

      {/* Sign Up Section */}
      <Text style={styles.signUpPrompt}>Don't have an account?</Text>
      
      <Link href="/signup" asChild>
        <Pressable style={styles.signUpBtn}>
          <Text style={styles.btnText}>Sign Up</Text>
        </Pressable>
      </Link>

      {/* House Image */}
      <View style={styles.houseImageContainer}>
        <Image
          source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/4f4d024a6d7009f6821d880a299706efdc5ff2c3?width=727' }}
          style={styles.houseImage}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: 176,
    left: 147,
  },
  title: {
    position: 'absolute',
    top: 295,
    color: '#fff',
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  subtitle: {
    position: 'absolute',
    top: 367,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  loginBtn: {
    position: 'absolute',
    top: 408,
    width: 152,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpPrompt: {
    position: 'absolute',
    top: 477,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  signUpBtn: {
    position: 'absolute',
    top: 513,
    width: 152,
    height: 51,
    backgroundColor: '#fff',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  houseImageContainer: {
    position: 'absolute',
    bottom: 25,
    width: 363,
    height: 173,
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
});