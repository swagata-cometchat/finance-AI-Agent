import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { kycComplianceAgent, complianceOfficerAgent, riskAnalystAgent } from './agents/compliance-agent';
import { apiRoutes } from './server/routes';

export const mastra = new Mastra({
  agents: { 
    'kyc-compliance': kycComplianceAgent,
    'compliance-officer': complianceOfficerAgent,
    'risk-analyst': riskAnalystAgent
  },
  logger: new PinoLogger({ name: 'KYCCompliance-Mastra', level: 'info' }),
  server: {
    build: { swaggerUI: true },
    apiRoutes,
  },
});