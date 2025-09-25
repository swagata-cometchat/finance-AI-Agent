import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { loanPoliciesAgent } from './agents/loan-policies-agent';
import { apiRoutes } from './server/routes';

export const mastra = new Mastra({
  agents: { 'loan-policies': loanPoliciesAgent },
  storage: new LibSQLStore({ url: 'file:../mastra.db' }),
  logger: new PinoLogger({ name: 'LoanPoliciesAgent', level: 'info' }),
  server: {
    build: { swaggerUI: true }, // /swagger-ui
    apiRoutes,
  },
});