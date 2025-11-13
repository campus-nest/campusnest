import { usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Simple icon components using react-native-svg
const HomeIcon = ({ color = "#000", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const SearchIcon = ({ color = "#000", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const PlusIcon = ({ color = "#000", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UsersIcon = ({ color = "#000", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const UserIcon = ({ color = "#000", size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated (in tabs routes)
  const isAuthenticated = !['/landing', '/login', '/signup', '/pre-signup', '/verify-email'].includes(pathname);

  if (Platform.OS === 'web') {
    // Web - Top navigation bar
    return (
      <View style={styles.webContainer}>
        <Pressable onPress={() => router.push('/landing')}>
          <Text style={styles.logo}>🏠 CampusNest</Text>
        </Pressable>

        <View style={styles.webNav}>
          {isAuthenticated ? (
            <>
              <Pressable onPress={() => router.push('/(tabs)')}>
                <Text style={styles.webNavLink}>Home</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/(tabs)/explore')}>
                <Text style={styles.webNavLink}>Search</Text>
              </Pressable>
              <Pressable onPress={() => console.log('New Post')}>
                <Text style={styles.webNavLink}>New Post</Text>
              </Pressable>
              <Pressable onPress={() => console.log('Users')}>
                <Text style={styles.webNavLink}>Users</Text>
              </Pressable>
              <Pressable onPress={() => console.log('Profile')}>
                <Text style={styles.webNavLink}>Profile</Text>
              </Pressable>
            </>
          ) : (
            <>
              {pathname !== '/login' && pathname !== '/signup' && (
                <>
                  <Pressable onPress={() => router.push('/login')}>
                    <Text style={styles.webNavLink}>Login</Text>
                  </Pressable>
                  <Pressable onPress={() => router.push('/signup')}>
                    <Text style={styles.webNavLink}>Sign Up</Text>
                  </Pressable>
                </>
              )}
            </>
          )}
        </View>
      </View>
    );
  }

  // Mobile - Bottom navigation bar (only show when authenticated)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.mobileContainer}>
      <Pressable 
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)')}
      >
        <HomeIcon 
          color={pathname === '/' || pathname === '/(tabs)' ? '#888' : '#000'} 
          size={24} 
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)/explore')}
      >
        <SearchIcon 
          color={pathname === '/explore' || pathname === '/(tabs)/explore' ? '#888' : '#000'} 
          size={24} 
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => console.log('New Post')}
      >
        <PlusIcon 
          color="#000" 
          size={24} 
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => console.log('Users')}
      >
        <UsersIcon 
          color="#000" 
          size={24} 
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => console.log('Profile')}
      >
        <UserIcon 
          color="#000" 
          size={24} 
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Web styles
  webContainer: {
    height: 60,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  webNav: {
    flexDirection: 'row',
    gap: 20,
  },
  webNavLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Mobile styles
  mobileContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});