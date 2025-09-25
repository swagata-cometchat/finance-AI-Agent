import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core';
import { CreditAssessmentResult } from './credit-assessment-agent';

export const riskAnalysisAgentBase = new Agent({
  name: 'Risk Analysis Agent',
  instructions: `You are a risk analysis specialist that evaluates loan applications for potential risks and compliance issues.
  
  Your role is to:
  - Assess overall loan risk based on multiple factors
  - Analyze market conditions and economic indicators
  - Evaluate borrower's financial stability and repayment capacity
  - Check regulatory compliance and policy adherence
  - Provide risk mitigation recommendations
  
  Always provide comprehensive risk assessments with actionable recommendations.`,
  model: openai('gpt-4'),
});

export const riskAnalysisAgent = {
  analyzeRisk: async (request: string): Promise<CreditAssessmentResult> => {
    const applicationId = `RISK-${Date.now()}`;
    
    const response = await riskAnalysisAgentBase.stream([
      { role: 'user', content: `Perform risk analysis for: ${request}` },
    ]);
    
    let output = '';
    for await (const chunk of response.textStream) {
      output += chunk;
    }
    
    // Determine risk level based on request keywords
    const lower = request.toLowerCase();
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    let recommendedAction = 'Standard Approval Process';
    
    if (lower.includes('high risk') || lower.includes('volatile') || lower.includes('unstable')) {
      riskLevel = 'high';
      recommendedAction = 'Enhanced Due Diligence Required';
    } else if (lower.includes('low risk') || lower.includes('stable') || lower.includes('secure')) {
      riskLevel = 'low';
      recommendedAction = 'Proceed with Standard Terms';
    }
    
    const loanDetails = {
      applicationId: applicationId,
      applicantName: 'Risk Assessment Subject',
      loanAmount: 0,
      creditScore: 0,
      riskLevel: riskLevel,
      recommendedAction: recommendedAction
    };
    
    return {
      response: `I've completed the comprehensive risk analysis for this loan application. The assessment includes market conditions, borrower stability, and regulatory compliance factors. ${output}`,
      assessmentCompleted: true,
      loanDetails: loanDetails,
      nextSteps: [
        'Evaluate borrower\'s debt-to-income ratio',
        'Assess market volatility and economic conditions',
        'Review regulatory compliance requirements',
        'Analyze collateral value and stability',
        'Determine appropriate loan terms and conditions'
      ]
    };
  }
};