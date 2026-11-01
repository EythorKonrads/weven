import { useQuery } from '@tanstack/react-query';

import { fetchDatabaseHealth } from '../api';

export function useDatabaseHealth() {
  return useQuery({ queryKey: ['health', 'database'], queryFn: fetchDatabaseHealth });
}
