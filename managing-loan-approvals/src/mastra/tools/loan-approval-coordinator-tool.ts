import { createTool } from '@mastra/core';
import { z } from 'zod';
import { LoanApprovalCoordinatorAgent, LoanApprovalResult } from '../agents/loan-approval-coordinator-agent';

const internalLoanApprovalCoordinator = new LoanApprovalCoordinatorAgent();

export const loanApprovalCoordinatorTool = createTool({
  id: 'loanApprovalCoordinator',
  description: 'Coordinate loan approval processes including credit assessment, document verification, risk analysis, and final approval decisions.',
  inputSchema: z.object({
    request: z.string().min(3).describe('Loan approval request description'),
    applicantName: z.string().optional().describe('Name of the loan applicant'),
  }),
  outputSchema: z.object({
    response: z.string(),
    routedTo: z.enum(['credit-assessment', 'document-verification', 'risk-analysis', 'approval-decision']),
    actionTaken: z.boolean(),
    loanDetails: z.object({
      applicationId: z.string(),
      applicantName: z.string(),
      loanAmount: z.number(),
      creditScore: z.number(),
      riskLevel: z.enum(['low', 'medium', 'high']),
      recommendedAction: z.string(),
    }).optional(),
    approvalType: z.enum(['credit-evaluation', 'document-review', 'risk-assessment', 'final-decision']),
    nextSteps: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { request, applicantName } = context as { 
      request: string; 
      applicantName?: string; 
    };
    
    const result: LoanApprovalResult = await internalLoanApprovalCoordinator.coordinateLoanApproval(
      request, 
      applicantName
    );
    
    return {
      response: result.response,
      routedTo: result.routedTo,
      actionTaken: result.actionTaken,
      loanDetails: result.loanDetails,
      approvalType: result.approvalType,
      nextSteps: result.nextSteps,
    };
  },
});