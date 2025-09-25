import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core';

export interface CreditAssessmentResult {
  response: string;
  assessmentCompleted: boolean;
  loanDetails?: {
    applicationId: string;
    applicantName: string;
    loanAmount: number;
    creditScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendedAction: string;
  };
  nextSteps: string[];
}

export const creditAssessmentAgentBase = new Agent({
  name: 'Credit Assessment Agent',
  instructions: `You are a credit assessment specialist that evaluates loan applications based on creditworthiness and risk factors.
  
  Your role is to:
  - Analyze credit scores, income, and financial history
  - Assess debt-to-income ratios and payment history
  - Evaluate collateral and employment stability
  - Determine risk levels and make recommendations
  - Provide detailed credit assessment reports
  
  Always be thorough in your analysis and provide clear risk assessments.`,
  model: openai('gpt-4'),
});

export const creditAssessmentAgent = {
  assessCredit: async (request: string): Promise<CreditAssessmentResult> => {
    const applicationId = `CREDIT-${Date.now()}`;
    
    const response = await creditAssessmentAgentBase.stream([
      { role: 'user', content: `Perform credit assessment for: ${request}` },
    ]);
    
    let output = '';
    for await (const chunk of response.textStream) {
      output += chunk;
    }
    
    // Extract loan information from request
    const lower = request.toLowerCase();
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    let creditScore = 650; // Default
    let loanAmount = 50000; // Default
    
    if (lower.includes('excellent credit') || lower.includes('800') || lower.includes('750')) {
      riskLevel = 'low';
      creditScore = 750;
    } else if (lower.includes('poor credit') || lower.includes('500') || lower.includes('bad credit')) {
      riskLevel = 'high';
      creditScore = 500;
    }
    
    // Extract loan amount if mentioned
    const amountMatch = request.match(/\$?(\d+,?\d*)/);
    if (amountMatch) {
      loanAmount = parseInt(amountMatch[1].replace(',', ''));
    }
    
    const loanDetails = {
      applicationId: applicationId,
      applicantName: 'John Smith', // Would be extracted from application
      loanAmount: loanAmount,
      creditScore: creditScore,
      riskLevel: riskLevel,
      recommendedAction: riskLevel === 'low' ? 'Approve' : riskLevel === 'medium' ? 'Review Required' : 'Decline'
    };
    
    return {
      response: `I've completed the credit assessment for this loan application. Based on the financial information provided, I've evaluated the creditworthiness and risk factors. ${output}`,
      assessmentCompleted: true,
      loanDetails: loanDetails,
      nextSteps: [
        'Review credit report and payment history',
        'Verify income documentation',
        'Assess debt-to-income ratio',
        'Evaluate employment stability',
        'Determine final risk classification'
      ]
    };
  }
};