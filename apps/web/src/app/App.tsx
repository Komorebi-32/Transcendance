import { useEffect, useState } from 'react';
import { APP_NAME, HealthResponseSchema, type HealthResponse } from '@ft/shared';

/**
 * Temporary shell (Day 1). Day 5 replaces it with the router, providers and i18n.
 * It proves the wiring: shared schema → API → React.
 */
export function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((json: unknown) => setHealth(HealthResponseSchema.parse(json)))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  return (
    <main>
      <h1>{APP_NAME}</h1>
      <p>
        API:{' '}
        {health ? `${health.status} (v${health.version})` : error ? `unreachable — ${error}` : '…'}
      </p>
    </main>
  );
}
