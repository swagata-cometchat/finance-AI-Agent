import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core';
import { CreditAssessmentResult } from './credit-assessment-agent';

export const approvalDecisionAgentBase = new Agent({
  name: 'Approval Decision Agent',
  instructions: `You are a final approval decision specialist that makes the ultimate loan approval or rejection decision.
  
  Your role is to:
  - Review all assessment reports and documentation
  - Make final approval or rejection decisions
  - Set loan terms, interest rates, and conditions
  - Provide detailed reasoning for decisions
  - Generate approval letters and loan contracts
  
  Always provide clear, well-reasoned decisions with appropriate terms and conditions.`,
  model: openai('gpt-4'),
});

export const approvalDecisionAgent = {
  makeDecision: async (request: string): Promise<CreditAssessmentResult> => {
    const applicationId = `DECISION-${Date.now()}`;
    
    const response = await approvalDecisionAgentBase.stream([
      { role: 'user', content: `Make final approval decision for: ${request}` },
    ]);
    
    let output = '';
    for await (const chunk of response.textStream) {
      output += chunk;
    }
    
    // Determine decision based on request
    const lower = request.toLowerCase();
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    let recommendedAction = 'Approved with Standard Terms';
    
    if (lower.includes('reject') || lower.includes('decline') || lower.includes('deny')) {
      riskLevel = 'high';
      recommendedAction = 'Application Rejected';
    } else if (lower.includes('approve') || lower.includes('accept') || lower.includes('qualified')) {
      riskLevel = 'low';
      recommendedAction = 'Application Approved';
    } else if (lower.includes('conditional') || lower.includes('review')) {
      riskLevel = 'medium';
      recommendedAction = 'Conditional Approval';
    }
    
    const loanDetails = {
      applicationId: applicationId,
      applicantName: 'Final Decision Subject',
      loanAmount: 0,
      creditScore: 0,
      riskLevel: riskLevel,
      recommendedAction: recommendedAction
    };
    
    return {
      response: `I've made the final decision on this loan application after reviewing all assessment reports and documentation. ${output}`,
      assessmentCompleted: true,
      loanDetails: loanDetails,
      nextSteps: [
        'Generate approval/rejection letter',
        'Set final loan terms and interest rate',
        'Prepare loan agreement documentation',
        'Schedule loan closing appointment',
        'Notify all relevant parties of decision'
      ]
    };
  }
};