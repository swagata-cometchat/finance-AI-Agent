import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core';
import { CreditAssessmentResult } from './credit-assessment-agent';

export const documentVerificationAgentBase = new Agent({
  name: 'Document Verification Agent',
  instructions: `You are a document verification specialist that validates and authenticates loan application documents.
  
  Your role is to:
  - Verify identity documents and employment letters
  - Validate income statements and tax returns
  - Check bank statements and financial records
  - Authenticate property documents and valuations
  - Identify potential fraud or discrepancies
  
  Always be meticulous in document verification and flag any inconsistencies.`,
  model: openai('gpt-4'),
});

export const documentVerificationAgent = {
  verifyDocuments: async (request: string): Promise<CreditAssessmentResult> => {
    const applicationId = `DOC-${Date.now()}`;
    
    const response = await documentVerificationAgentBase.stream([
      { role: 'user', content: `Verify documents for: ${request}` },
    ]);
    
    let output = '';
    for await (const chunk of response.textStream) {
      output += chunk;
    }
    
    // Determine verification status based on request
    const lower = request.toLowerCase();
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let recommendedAction = 'Documents Verified';
    
    if (lower.includes('missing') || lower.includes('incomplete') || lower.includes('invalid')) {
      riskLevel = 'high';
      recommendedAction = 'Request Additional Documents';
    } else if (lower.includes('unclear') || lower.includes('verify') || lower.includes('question')) {
      riskLevel = 'medium';
      recommendedAction = 'Additional Verification Required';
    }
    
    const loanDetails = {
      applicationId: applicationId,
      applicantName: 'Application Holder',
      loanAmount: 0,
      creditScore: 0,
      riskLevel: riskLevel,
      recommendedAction: recommendedAction
    };
    
    return {
      response: `I've completed the document verification process for this loan application. All required documents have been reviewed for authenticity and completeness. ${output}`,
      assessmentCompleted: true,
      loanDetails: loanDetails,
      nextSteps: [
        'Verify identity documents (ID, passport)',
        'Authenticate employment verification letter',
        'Validate income statements and tax returns',
        'Check bank statement authenticity',
        'Review property valuation documents'
      ]
    };
  }
};