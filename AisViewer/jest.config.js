module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./config/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community|react-native-reanimated|@testing-library|rn-secure-storage)',
  ],
};
