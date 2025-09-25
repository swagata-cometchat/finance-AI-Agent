import { creditAssessmentAgent } from './credit-assessment-agent';
import { documentVerificationAgent } from './document-verification-agent';
import { riskAnalysisAgent } from './risk-analysis-agent';
import { approvalDecisionAgent } from './approval-decision-agent';

export interface LoanApprovalResult {
  response: string;
  routedTo: 'credit-assessment' | 'document-verification' | 'risk-analysis' | 'approval-decision';
  actionTaken: boolean;
  loanDetails?: {
    applicationId: string;
    applicantName: string;
    loanAmount: number;
    creditScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendedAction: string;
  };
  approvalType: 'credit-evaluation' | 'document-review' | 'risk-assessment' | 'final-decision';
  nextSteps: string[];
}

export class LoanApprovalCoordinatorAgent {
  async coordinateLoanApproval(request: string, applicantName?: string): Promise<LoanApprovalResult> {
    const lower = request.toLowerCase();
    
    // Credit assessment keywords
    const creditKeywords = [
      'credit score', 'credit check', 'creditworthiness', 'financial history',
      'income verification', 'debt to income', 'credit assessment', 'credit evaluation'
    ];
    
    // Document verification keywords
    const documentKeywords = [
      'document verification', 'verify documents', 'check documents', 'validate paperwork',
      'identity verification', 'employment letter', 'bank statements', 'tax returns'
    ];
    
    // Risk analysis keywords
    const riskKeywords = [
      'risk analysis', 'risk assessment', 'evaluate risk', 'risk factors',
      'market conditions', 'compliance check', 'regulatory review', 'due diligence'
    ];
    
    // Approval decision keywords
    const decisionKeywords = [
      'final decision', 'approve loan', 'reject application', 'loan approval',
      'make decision', 'final review', 'approval status', 'loan decision'
    ];

    // Route to appropriate specialist
    if (creditKeywords.some(keyword => lower.includes(keyword))) {
      const result = await creditAssessmentAgent.assessCredit(request);
      return {
        response: result.response,
        routedTo: 'credit-assessment',
        actionTaken: result.assessmentCompleted,
        loanDetails: result.loanDetails,
        approvalType: 'credit-evaluation',
        nextSteps: result.nextSteps
      };
    }

    if (documentKeywords.some(keyword => lower.includes(keyword))) {
      const result = await documentVerificationAgent.verifyDocuments(request);
      return {
        response: result.response,
        routedTo: 'document-verification',
        actionTaken: result.assessmentCompleted,
        loanDetails: result.loanDetails,
        approvalType: 'document-review',
        nextSteps: result.nextSteps
      };
    }

    if (riskKeywords.some(keyword => lower.includes(keyword))) {
      const result = await riskAnalysisAgent.analyzeRisk(request);
      return {
        response: result.response,
        routedTo: 'risk-analysis',
        actionTaken: result.assessmentCompleted,
        loanDetails: result.loanDetails,
        approvalType: 'risk-assessment',
        nextSteps: result.nextSteps
      };
    }

    if (decisionKeywords.some(keyword => lower.includes(keyword))) {
      const result = await approvalDecisionAgent.makeDecision(request);
      return {
        response: result.response,
        routedTo: 'approval-decision',
        actionTaken: result.assessmentCompleted,
        loanDetails: result.loanDetails,
        approvalType: 'final-decision',
        nextSteps: result.nextSteps
      };
    }

    // Default to credit assessment for general loan requests
    const result = await creditAssessmentAgent.assessCredit(request);
    return {
      response: result.response,
      routedTo: 'credit-assessment',
      actionTaken: result.assessmentCompleted,
      loanDetails: result.loanDetails,
      approvalType: 'credit-evaluation',
      nextSteps: result.nextSteps
    };
  }
}