import { ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface PageContainerProps extends ViewProps {
  children: ReactNode;
}

export function PageContainer({ children, style, ...props }: PageContainerProps) {
  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer, style]} {...props}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '70%',
    maxWidth: 1000,
    flex: 1,
  },
});