import appJson from '../../app.json';
import eas from '../../eas.json';

const { expo } = appJson;

describe('native config', () => {
  it('sets the app identifiers', () => {
    expect(expo.ios.bundleIdentifier).toBe('com.weven.app');
    expect(expo.android.package).toBe('com.weven.app');
  });

  it('configures OTA updates with the fingerprint policy', () => {
    expect(expo.updates.url).toBe('https://u.expo.dev/1734ddf3-dbfc-4335-a3cb-3837ccf59534');
    expect(expo.runtimeVersion).toEqual({ policy: 'fingerprint' });
  });

  it('defines the development and staging build profiles', () => {
    expect(eas.cli).toEqual({ version: '>= 27.2.0', appVersionSource: 'remote' });
    expect(Object.keys(eas.build)).toEqual(['development', 'staging']);
    expect(Object.keys(eas)).toEqual(['cli', 'build']);

    const { development, staging } = eas.build;
    expect(development).toMatchObject({
      developmentClient: true,
      distribution: 'internal',
      android: { buildType: 'apk' },
      ios: { simulator: true },
    });
    expect(staging).toMatchObject({
      distribution: 'internal',
      channel: 'staging',
      android: { buildType: 'apk' },
      ios: { simulator: true },
      env: {
        EXPO_PUBLIC_SUPABASE_URL: 'https://fgtrqsxmgqlzhprldags.supabase.co',
        EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_82oyMTysNgEqy_ksZvwNmQ_tMg1fOJ1',
      },
    });
  });
});
