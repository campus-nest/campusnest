import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <StatusBar style="light" />
      <View style={styles.container}>
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
      <Text style={styles.subtitle}>Let's get Started!</Text>


      {/* Login Button */}
      <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
        <Text style={styles.btnText}>Login</Text>
      </Pressable>

      {/* Sign Up Section */}
      <Text style={styles.signUpPrompt}>Don't have an account?</Text>
      
      <Pressable style={styles.signUpBtn} onPress={() => router.push('/pre-signup')}>
        <Text style={styles.btnText}>Sign Up</Text>
      </Pressable>

      {/* House Image */}
      <View style={styles.houseImageContainer}>
        <Image
          source={require('../assets/images/landing_page_logo.png')}
          style={styles.houseImage}
          contentFit="contain"
        />
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '70%',
    maxWidth: 500,
    height: '100%',
    backgroundColor: '#000',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    top: 176,
    alignSelf: 'center',
  },
  title: {
    position: 'absolute',
    top: 295,
    color: '#fff',
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
    alignSelf: 'center',
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
    alignSelf: 'center',
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
    alignSelf: 'center',
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
    alignSelf: 'center',
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
    alignSelf: 'center',
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
    width: '92%',
    maxWidth: 363,
    height: 173,
    alignSelf: 'center',
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
});