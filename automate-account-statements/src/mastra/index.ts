import { Mastra } from '@mastra/core/mastra';
import { accountStatementsAgent } from './agents/account-statements-agent';

export const mastra = new Mastra({
  agents: { accountStatementsAgent },
});