import HomeIcon from '@/assets/images/nav_bar/Home.svg';
import PlusIcon from '@/assets/images/nav_bar/PlusCircle.svg';
import SearchIcon from '@/assets/images/nav_bar/Search.svg';
import UserIcon from '@/assets/images/nav_bar/User.svg';
import UsersIcon from '@/assets/images/nav_bar/Users.svg';
import { usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is authenticated (in tabs routes)
  const isAuthenticated = !['/landing', '/login', '/signup', '/pre-signup', '/verify-email'].includes(pathname);

  // Helper function to check if route is active
  const isActive = (route: string) => {
    if (route === '/(tabs)') {
      return pathname === '/' || pathname === '/(tabs)';
    }
    return pathname === route || pathname === `/(tabs)${route}`;
  };

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
              <Pressable 
                accessibilityRole='link'
                accessibilityLabel='Home'
                onPress={() => router.push('/(tabs)')}
                style={[styles.webNavItem, isActive('/(tabs)') && styles.webNavItemActive]}
              >
                <Text style={[styles.webNavLink, isActive('/(tabs)') && styles.webNavLinkActive]}>
                  Home
                </Text>
              </Pressable>
              <Pressable 
                accessibilityRole='link'
                accessibilityLabel='Search'
                onPress={() => router.push('/(tabs)/explore')}
                style={[styles.webNavItem, isActive('/explore') && styles.webNavItemActive]}
              >
                <Text style={[styles.webNavLink, isActive('/explore') && styles.webNavLinkActive]}>
                  Search
                </Text>
              </Pressable>
              <Pressable 
                accessibilityRole='link'
                accessibilityLabel='New Post'
                onPress={() => router.push('/(tabs)/new_post')}
                style={[styles.webNavItem, isActive('/new_post') && styles.webNavItemActive]}
              >
                <Text style={[styles.webNavLink, isActive('/new_post') && styles.webNavLinkActive]}>
                  New Post
                </Text>
              </Pressable>
              <Pressable 
                accessibilityRole='link'
                accessibilityLabel='Users'
                onPress={() => router.push('/(tabs)/users')}
                style={[styles.webNavItem, isActive('/users') && styles.webNavItemActive]}
              >
                <Text style={[styles.webNavLink, isActive('/users') && styles.webNavLinkActive]}>
                  Users
                </Text>
              </Pressable>
              <Pressable 
                accessibilityRole='link'
                accessibilityLabel='Profile'
                onPress={() => router.push('/(tabs)/profile')}
                style={[styles.webNavItem, isActive('/profile') && styles.webNavItemActive]}
              >
                <Text style={[styles.webNavLink, isActive('/profile') && styles.webNavLinkActive]}>
                  Profile
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {pathname !== '/login' && pathname !== '/signup' && (
                <>
                  <Pressable 
                    onPress={() => router.push('/login')}
                    style={styles.webNavItem}
                  >
                    <Text style={styles.webNavLink}>Login</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => router.push('/signup')}
                    style={styles.webNavItem}
                  >
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
        accessibilityRole='link'
        accessibilityLabel='Home'
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)')}
      >
        <HomeIcon 
          width={24}
          height={24}
          color={isActive('/(tabs)') ? '#888' : '#000'}
        />
      </Pressable>

      <Pressable 
        accessibilityRole='link'
        accessibilityLabel='Search'
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)/explore')}
      >
        <SearchIcon 
          width={24}
          height={24}
          color={isActive('/explore') ? '#888' : '#000'}
        />
      </Pressable>

      <Pressable 
        accessibilityRole='link'
        accessibilityLabel='New Post'
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)/new_post')}
      >
        <PlusIcon 
          width={24}
          height={24}
          color={isActive('/new_post') ? '#888' : '#000'}
        />
      </Pressable>

      <Pressable 
        accessibilityRole='link'
        accessibilityLabel='Users'
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)/users')}
      >
        <UsersIcon 
          width={24}
          height={24}
          color={isActive('/users') ? '#888' : '#000'}
        />
      </Pressable>

      <Pressable 
        accessibilityRole='link'
        accessibilityLabel='Profile'
        style={styles.navItem} 
        onPress={() => router.push('/(tabs)/profile')}
      >
        <UserIcon 
          width={24}
          height={24}
          color={isActive('/profile') ? '#888' : '#000'}
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
  webNavItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  webNavItemActive: {
    backgroundColor: '#333',
  },
  webNavLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  webNavLinkActive: {
    fontWeight: '700',
    textDecorationLine: 'underline',
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