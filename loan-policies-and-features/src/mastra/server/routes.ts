import { ingestSourcesHandler } from './routes/ingest';
import { searchDocsHandler } from './routes/searchDocs';

// Optional, handy for quick checks in browser or health probes
const rootRoute = {
  method: 'GET',
  path: '/',
  handler: (c: any) => c.text('Loan Policies & Features Agent - OK'),
};

// Use a generic type instead of the missing APIRoute type
export const apiRoutes: Array<any> = [
  rootRoute,
  {
    method: 'POST',
    path: '/api/tools/ingestSources',
    handler: ingestSourcesHandler,
  },
  {
    method: 'POST',
    path: '/api/tools/searchDocs',
    handler: searchDocsHandler,
  },
];