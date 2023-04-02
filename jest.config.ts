import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/js-with-ts',
  verbose: true,
  transform: {
  '^.+\\.tsx?$': 'ts-jest',
  },
};
export default config;