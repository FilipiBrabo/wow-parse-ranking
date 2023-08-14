/* eslint-disable */
export default {
  displayName: 'wotlk-classic-brazilian-parse-ranking-front-end',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../coverage/apps/wotlk-classic-brazilian-parse-ranking-front-end',
};
