import { useQuery } from '@tanstack/react-query';

import { fetchEdgeHello } from '../api';

export function useEdgeHello() {
  return useQuery({ queryKey: ['health', 'edge'], queryFn: fetchEdgeHello });
}
