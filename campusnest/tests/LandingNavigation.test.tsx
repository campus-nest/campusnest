import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

test('renders', () => {
  const { getByText } = render(<Text>Hello, CampusNest!</Text>);
  expect(getByText('Hello, CampusNest!')).toBeTruthy();
});
