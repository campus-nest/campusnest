import { PageContainer } from '@/components/page-container';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export default function PreSignUpScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'student' | 'landlord' | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreateAccount = () => {
    if (!selectedRole) {
      return;
    }
    
    if (selectedRole === 'student') {
      router.push('/signup-student');
    } else {
      router.push('/signup-landlord');
    }
  };

  const getRoleDisplayText = () => {
    if (selectedRole === 'student') return 'Student';
    if (selectedRole === 'landlord') return 'Landlord';
    return 'Student/Landlord';
  };

  return (
    <PageContainer style={styles.outerContainer}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

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
        <Text style={styles.title}>Select a Role!</Text>

        {/* Role Selector */}
        <View style={styles.roleSection}>
          <Text style={styles.label}>Enter Role</Text>
          <Pressable 
            style={styles.roleInput}
            onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.roleInputText}>{getRoleDisplayText()}</Text>
            <Text style={styles.clearButton}>✕</Text>
          </Pressable>

          {/* Dropdown */}
          {showDropdown && (
            <View style={styles.dropdown}>
              <Pressable
                style={[
                  styles.dropdownOption,
                  selectedRole === 'student' && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  setSelectedRole('student');
                  setShowDropdown(false);
                }}>
                <Text style={styles.dropdownText}>Student</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.dropdownOption,
                  selectedRole === 'landlord' && styles.dropdownOptionSelected,
                ]}
                onPress={() => {
                  setSelectedRole('landlord');
                  setShowDropdown(false);
                }}>
                <Text style={styles.dropdownText}>Landlord</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Create Account Button */}
        <Pressable
          style={[
            styles.createButton,
            !selectedRole && styles.createButtonDisabled,
          ]}
          onPress={handleCreateAccount}
          disabled={!selectedRole}>
          <Text style={styles.createButtonText}>Create Account</Text>
        </Pressable>

        {/* House Illustration */}
        <View style={styles.houseContainer}>
          <Svg width="280" height="200" viewBox="0 0 280 200" fill="none">
            {/* Cloud Background */}
            <Path
              d="M60 150C60 150 40 150 30 145C20 140 10 130 10 115C10 100 20 90 35 90C35 75 50 60 70 60C90 60 100 70 105 85C115 80 125 80 135 85C145 90 150 100 150 115C150 130 140 145 125 150H60Z"
              fill="#4A5568"
              opacity="0.3"
            />
            <Path
              d="M200 150C200 150 220 150 230 145C240 140 250 130 250 115C250 100 240 90 225 90C225 75 210 60 190 60C170 60 160 70 155 85C145 80 135 80 125 85C115 90 110 100 110 115C110 130 120 145 135 150H200Z"
              fill="#4A5568"
              opacity="0.3"
            />
            
            {/* House Base */}
            <Path
              d="M80 180V100L140 60L200 100V180H80Z"
              fill="#5A7C9E"
            />
            
            {/* Roof */}
            <Path
              d="M70 100L140 50L210 100L200 110L140 65L80 110L70 100Z"
              fill="#E88D8D"
            />
            
            {/* Door */}
            <Rect
              x="120"
              y="140"
              width="40"
              height="40"
              fill="#F5F5F5"
            />
            
            {/* Window Left */}
            <Rect
              x="90"
              y="120"
              width="20"
              height="20"
              fill="#1A1A1A"
              stroke="#F5F5F5"
              strokeWidth="2"
            />
            
            {/* Window Right */}
            <Rect
              x="170"
              y="120"
              width="20"
              height="20"
              fill="#1A1A1A"
              stroke="#F5F5F5"
              strokeWidth="2"
            />
            
            {/* Chimney */}
            <Rect
              x="170"
              y="70"
              width="15"
              height="35"
              fill="#8B4513"
            />
            
            {/* Trees */}
            <Circle cx="40" cy="165" r="15" fill="#6B8E23" />
            <Rect x="37" y="165" width="6" height="15" fill="#8B4513" />
            
            <Circle cx="240" cy="170" r="12" fill="#6B8E23" />
            <Rect x="237" y="170" width="6" height="10" fill="#8B4513" />
            
            {/* Bushes */}
            <Circle cx="65" cy="178" r="8" fill="#556B2F" />
            <Circle cx="75" cy="180" r="8" fill="#556B2F" />
            <Circle cx="205" cy="178" r="8" fill="#556B2F" />
            <Circle cx="215" cy="180" r="8" fill="#556B2F" />
          </Svg>
        </View>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backArrow: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 50,
    textAlign: 'center',
  },
  roleSection: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
    position: 'relative',
    zIndex: 100,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  roleInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleInputText: {
    color: '#fff',
    fontSize: 16,
  },
  clearButton: {
    color: '#666',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownOptionSelected: {
    backgroundColor: '#3a3a3a',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 40,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 30,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  houseContainer: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
