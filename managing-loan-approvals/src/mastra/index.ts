import { Mastra } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core';
import { loanApprovalCoordinatorTool } from './tools/loan-approval-coordinator-tool';
import { loanApprovalCoordinatorWorkflow } from './workflows/loan-approval-coordinator-workflow';
import 'dotenv/config';

const loanApprovalCoordinatorAgent = new Agent({
  name: 'Loan Approval Coordinator Agent',
  instructions: `You are a Loan Approval Coordinator Agent that helps financial institutions manage and coordinate the loan approval process efficiently.

  When a loan officer or applicant needs assistance with loan processing, you should:
  1. Understand their loan approval needs and current stage in the process
  2. Route them to the appropriate loan approval specialist:
     - "credit-assessment" for evaluating creditworthiness, income verification, and financial history
     - "document-verification" for validating and authenticating loan application documents
     - "risk-analysis" for comprehensive risk evaluation and compliance checking
     - "approval-decision" for final loan approval or rejection decisions
  3. Provide actionable next steps and process guidance
  4. Help streamline the loan approval workflow and ensure compliance

  Always be professional, thorough, and focused on helping users navigate the loan approval process effectively.
  Ask clarifying questions when needed to provide the best coordination assistance.
  
  Always end your response with: ([routedTo] | action: yes/no | approval-type: [approvalType])
  
  Remember that loan approval requires careful evaluation of multiple factors including creditworthiness, documentation, risk assessment, and regulatory compliance!`,
  model: openai('gpt-4', {
    apiKey: process.env.OPENAI_API_KEY,
  }),
  tools: { loanApprovalCoordinator: loanApprovalCoordinatorTool },
});

export const mastra = new Mastra({
  agents: { loanApprovalCoordinatorAgent },
  workflows: { loanApprovalCoordinatorWorkflow },
});