import { usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

// Import your SVG files
const HomeIcon = require('@/assets/images/nav_bar/Home.svg');
const SearchIcon = require('@/assets/images/nav_bar/search.svg');
const PlusIcon = require('@/assets/images/nav_bar/Plus circle.svg');
const UsersIcon = require('@/assets/images/nav_bar/Users.svg');
const UserIcon = require('@/assets/images/nav_bar/User.svg');

export function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated (in tabs routes)
  const isAuthenticated = pathname.startsWith('/(tabs)');

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
        <SvgXml 
          xml={HomeIcon} 
          width={24} 
          height={24}
          color={pathname === '/(tabs)' ? '#fff' : '#666'}
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)/explore')}
      >
        <SvgXml 
          xml={SearchIcon} 
          width={24} 
          height={24}
          color={pathname === '/(tabs)/explore' ? '#fff' : '#666'}
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => console.log('New Post')}
      >
        <SvgXml 
          xml={PlusIcon} 
          width={24} 
          height={24}
          color="#666"
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => console.log('Users')}
      >
        <SvgXml 
          xml={UsersIcon} 
          width={24} 
          height={24}
          color="#666"
        />
      </Pressable>

      <Pressable 
        style={styles.navItem} 
        onPress={() => console.log('Profile')}
      >
        <SvgXml 
          xml={UserIcon} 
          width={24} 
          height={24}
          color="#666"
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
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
});