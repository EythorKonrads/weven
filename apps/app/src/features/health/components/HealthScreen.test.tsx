import '@/lib/i18n';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react-native';
import i18n from 'i18next';

import { fetchDatabaseHealth, fetchEdgeHello } from '../api';
import { HealthScreen } from './HealthScreen';

// Factory mock: the real module creates a Supabase client, which tests must not touch.
jest.mock('../api', () => ({ fetchEdgeHello: jest.fn(), fetchDatabaseHealth: jest.fn() }));

const mockEdge = jest.mocked(fetchEdgeHello);
const mockDatabase = jest.mocked(fetchDatabaseHealth);

let client: QueryClient;

function renderScreen() {
  // gcTime: Infinity stops Query from scheduling cache timers that keep Jest alive.
  client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  return render(
    <QueryClientProvider client={client}>
      <HealthScreen />
    </QueryClientProvider>,
  );
}

beforeAll(async () => {
  await i18n.changeLanguage('en');
});

afterEach(() => {
  client.clear();
  jest.resetAllMocks();
});

describe('HealthScreen', () => {
  it('shows all three rows as OK when the Edge Function and database answer', async () => {
    mockEdge.mockResolvedValue({ message: 'Hello from the Edge', time: '2026-11-01T12:00:00Z' });
    mockDatabase.mockResolvedValue({
      message: 'Hello from Postgres',
      checkedAt: '2026-11-01T12:00:00Z',
    });

    await renderScreen();

    expect(screen.getByText('Weven')).toBeOnTheScreen();
    expect(within(screen.getByTestId('status-frontend')).getByText('OK')).toBeOnTheScreen();
    expect(await screen.findByText('Hello from the Edge')).toBeOnTheScreen();
    expect(await screen.findByText('Hello from Postgres')).toBeOnTheScreen();
    expect(within(screen.getByTestId('status-backend')).getByText('OK')).toBeOnTheScreen();
    expect(within(screen.getByTestId('status-database')).getByText('OK')).toBeOnTheScreen();
  });

  it('shows the back end and database as unreachable when the calls fail', async () => {
    mockEdge.mockRejectedValue(new Error('Edge Function down'));
    mockDatabase.mockRejectedValue(new Error('Database down'));

    await renderScreen();

    expect(
      await within(screen.getByTestId('status-backend')).findByText('Not reachable'),
    ).toBeOnTheScreen();
    expect(
      await within(screen.getByTestId('status-database')).findByText('Not reachable'),
    ).toBeOnTheScreen();
    expect(within(screen.getByTestId('status-frontend')).getByText('OK')).toBeOnTheScreen();
  });

  it('shows a loading state before the calls settle', async () => {
    mockEdge.mockReturnValue(new Promise(() => {}));
    mockDatabase.mockReturnValue(new Promise(() => {}));

    await renderScreen();

    expect(within(screen.getByTestId('status-backend')).getByText('Checking…')).toBeOnTheScreen();
    expect(within(screen.getByTestId('status-database')).getByText('Checking…')).toBeOnTheScreen();
  });
});
