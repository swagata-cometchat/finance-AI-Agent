# Managing Loan Approvals with a Coordinator Agent

A Mastra-powered AI agent that intelligently manages and coordinates the loan approval process, routing applications through credit assessment, document verification, risk analysis, and final approval decisions.

## What you'll build

- A loan approval coordinator that analyzes loan applications and routes them appropriately
- Intelligent routing to specialized loan processing agents:
  - **Credit Assessment** for evaluating creditworthiness, income verification, and financial history
  - **Document Verification** for validating and authenticating loan application documents  
  - **Risk Analysis** for comprehensive risk evaluation and compliance checking
  - **Approval Decision** for final loan approval or rejection decisions
- Automated loan processing workflow with detailed assessments
- Financial routing workflow with appropriate risk levels and recommendations

## Features

- 🏦 **Smart Loan Routing**: Automatically routes loan applications to the appropriate specialist
- 📊 **Credit Assessment**: Evaluates creditworthiness, income, and financial stability
- 📄 **Document Verification**: Validates identity, employment, and financial documents
- ⚠️ **Risk Analysis**: Comprehensive risk evaluation and regulatory compliance checking
- ✅ **Approval Decisions**: Final loan approval/rejection with detailed reasoning
- 📈 **Risk Classification**: Classifies applications by risk level (low, medium, high)
- 🔄 **Process Coordination**: Manages the entire loan approval workflow end-to-end

## Prerequisites

- Node.js 20.9.0 or higher
- OpenAI API key
- Basic understanding of Mastra framework

## Quickstart

1. Install dependencies and run locally:

```bash
cd managing-loan-approvals
npm install --legacy-peer-deps
npx mastra dev
```

2. Set up your OpenAI API key in `.env`:

```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
```

3. Test the loan approval coordinator (agent id is `loanApprovalCoordinatorAgent`):

### Credit Assessment Request:
```bash
curl -s -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"I need a credit assessment for a $50,000 home loan application"}]}'
```

### Document Verification Request:
```bash
curl -s -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Please verify documents for loan application - need to check employment letter and bank statements"}]}'
```

### Risk Analysis Request:
```bash
curl -s -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Perform risk analysis for a commercial loan with volatile market conditions"}]}'
```

### Final Approval Decision:
```bash
curl -s -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Make final approval decision for qualified applicant with excellent credit"}]}'
```

The response includes routing information and a summary line like `([routedTo] | action: yes/no | approval-type: [approvalType])`.

## How it works

1. **Loan Request Analysis**: The coordinator analyzes the loan request to understand the processing stage needed
2. **Smart Routing**: Keywords and context determine the appropriate loan specialist:
   - Credit-related terms → Credit Assessment Agent
   - Document-related terms → Document Verification Agent
   - Risk-related terms → Risk Analysis Agent
   - Decision-related terms → Approval Decision Agent
3. **Process Execution**: The appropriate specialist performs their analysis and provides detailed results
4. **Comprehensive Reporting**: Each stage provides actionable insights and next steps

## Loan Processing Logic

### Credit Assessment Agent (Primary Evaluation)
- **Keywords**: credit score, credit check, creditworthiness, financial history, income verification, debt to income
- **Functions**: 
  - Analyze credit scores and payment history
  - Assess debt-to-income ratios
  - Evaluate employment stability and income
  - Determine credit risk levels
  - Provide approval/decline recommendations

### Document Verification Agent (Authentication)
- **Keywords**: document verification, verify documents, check documents, validate paperwork, identity verification
- **Functions**:
  - Verify identity documents (ID, passport)
  - Authenticate employment verification letters
  - Validate income statements and tax returns
  - Check bank statement authenticity
  - Review property valuation documents

### Risk Analysis Agent (Compliance & Risk)
- **Keywords**: risk analysis, risk assessment, evaluate risk, market conditions, compliance check, regulatory review
- **Functions**:
  - Assess overall loan risk factors
  - Analyze market conditions and economic indicators
  - Evaluate regulatory compliance requirements
  - Determine appropriate loan terms
  - Provide risk mitigation strategies

### Approval Decision Agent (Final Decision)
- **Keywords**: final decision, approve loan, reject application, loan approval, make decision, final review
- **Functions**:
  - Review all assessment reports
  - Make final approval or rejection decisions
  - Set loan terms and interest rates
  - Generate approval/rejection letters
  - Coordinate loan closing process

## API Endpoints

- `POST /api/agents/loanApprovalCoordinatorAgent/generate` — Process loan applications and coordinate approvals

Expected local base: `http://localhost:4111/api`

## Project Structure

```
managing-loan-approvals/
├── src/
│   ├── index.ts                                    # Main entry point
│   └── mastra/
│       ├── index.ts                               # Mastra configuration
│       ├── agents/
│       │   ├── loan-approval-coordinator-agent.ts # Main coordination logic
│       │   ├── credit-assessment-agent.ts         # Credit evaluation specialist
│       │   ├── document-verification-agent.ts     # Document authentication
│       │   ├── risk-analysis-agent.ts            # Risk evaluation specialist
│       │   └── approval-decision-agent.ts        # Final decision maker
│       ├── tools/
│       │   └── loan-approval-coordinator-tool.ts  # Coordination tool
│       └── workflows/
│           └── loan-approval-coordinator-workflow.ts # Approval workflow
├── package.json                                   # Project dependencies
├── tsconfig.json                                  # TypeScript configuration
├── .gitignore                                     # Git ignore rules
├── .env                                          # Environment variables
└── README.md                                     # This file
```

## Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```

## Sample Responses

### Credit Assessment (Default for General Loan Requests)
```json
{
  "response": "I've completed the credit assessment for this loan application. Based on the financial information provided, I've evaluated the creditworthiness and risk factors...",
  "routedTo": "credit-assessment",
  "actionTaken": true,
  "loanDetails": {
    "applicationId": "CREDIT-1727259842000",
    "applicantName": "John Smith",
    "loanAmount": 50000,
    "creditScore": 650,
    "riskLevel": "medium",
    "recommendedAction": "Review Required"
  },
  "approvalType": "credit-evaluation",
  "nextSteps": [
    "Review credit report and payment history",
    "Verify income documentation",
    "Assess debt-to-income ratio",
    "Evaluate employment stability",
    "Determine final risk classification"
  ]
}
```

### Document Verification
```json
{
  "response": "I've completed the document verification process for this loan application. All required documents have been reviewed for authenticity and completeness...",
  "routedTo": "document-verification",
  "actionTaken": true,
  "approvalType": "document-review",
  "nextSteps": [
    "Verify identity documents (ID, passport)",
    "Authenticate employment verification letter",
    "Validate income statements and tax returns",
    "Check bank statement authenticity",
    "Review property valuation documents"
  ]
}
```

### Risk Analysis
```json
{
  "response": "I've completed the comprehensive risk analysis for this loan application. The assessment includes market conditions, borrower stability, and regulatory compliance factors...",
  "routedTo": "risk-analysis",
  "actionTaken": true,
  "approvalType": "risk-assessment",
  "nextSteps": [
    "Evaluate borrower's debt-to-income ratio",
    "Assess market volatility and economic conditions",
    "Review regulatory compliance requirements",
    "Analyze collateral value and stability",
    "Determine appropriate loan terms and conditions"
  ]
}
```

### Final Approval Decision
```json
{
  "response": "I've made the final decision on this loan application after reviewing all assessment reports and documentation...",
  "routedTo": "approval-decision",
  "actionTaken": true,
  "approvalType": "final-decision",
  "nextSteps": [
    "Generate approval/rejection letter",
    "Set final loan terms and interest rate",
    "Prepare loan agreement documentation",
    "Schedule loan closing appointment",
    "Notify all relevant parties of decision"
  ]
}
```

## Connect to CometChat

1. In CometChat Dashboard → AI Agents, set Provider = Mastra
2. Agent ID = `loanApprovalCoordinatorAgent`
3. Deployment URL = your public `/api/agents/loanApprovalCoordinatorAgent/generate`
4. Enable and save

## Risk Levels & Classifications

- **Low Risk**: Excellent credit (750+), stable income, low debt-to-income ratio
- **Medium Risk**: Good credit (600-749), moderate income, acceptable debt levels  
- **High Risk**: Poor credit (<600), unstable income, high debt-to-income ratio

## Loan Approval Workflow

1. **Initial Assessment** → Credit evaluation and basic qualification
2. **Document Verification** → Authentication of all required paperwork
3. **Risk Analysis** → Comprehensive risk evaluation and compliance check
4. **Final Decision** → Approval/rejection with terms and conditions

## Testing Scenarios

### Test Credit Assessment Routing
```bash
curl -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Credit evaluation needed for $75,000 mortgage with 720 credit score"}]}'
```

### Test Document Verification Routing
```bash
curl -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Document verification required - checking employment letter and tax returns"}]}'
```

### Test Risk Analysis Routing
```bash
curl -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Risk assessment needed for high-volatility commercial loan"}]}'
```

### Test Approval Decision Routing
```bash
curl -X POST http://localhost:4111/api/agents/loanApprovalCoordinatorAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Final approval decision needed for qualified home buyer"}]}'
```

## Compliance & Security

⚠️ **Important Compliance Notice**: This AI agent is designed for loan processing assistance only. It is not a substitute for professional financial advice or formal loan underwriting. Always ensure compliance with:

- **Fair Credit Reporting Act (FCRA)**
- **Equal Credit Opportunity Act (ECOA)** 
- **Truth in Lending Act (TILA)**
- **Real Estate Settlement Procedures Act (RESPA)**
- **Bank Secrecy Act (BSA)**
- **Know Your Customer (KYC) requirements**

## Security Considerations

- **Data Privacy**: Secure handling of sensitive financial information
- **Authentication**: Implement proper user authentication and authorization
- **Audit Logging**: Maintain detailed logs of all loan decisions
- **Regulatory Compliance**: Ensure adherence to banking regulations
- **Data Encryption**: Encrypt all sensitive data in transit and at rest
- **Access Control**: Implement role-based access control for loan officers

## Troubleshooting

- **Wrong routing**: Check keyword detection logic in `loan-approval-coordinator-agent.ts`
- **Agent not found**: Verify agent registration in `index.ts`
- **OpenAI errors**: Ensure API key is valid and has sufficient credits
- **No response**: Check server logs and dependency installation
- **Module resolution errors**: Run `npm install --legacy-peer-deps` to resolve peer dependency conflicts

## Customization

### Adding New Loan Processing Keywords
Edit the keyword arrays in `loan-approval-coordinator-agent.ts`:
- `creditKeywords`: For credit-related processing
- `documentKeywords`: For document verification needs
- `riskKeywords`: For risk analysis requirements
- `decisionKeywords`: For final approval decisions

### Modifying Risk Assessment Logic
Update the assessment logic in individual agent files to adjust:
- Risk level thresholds
- Credit score evaluations
- Income requirement calculations
- Market condition assessments

### Adding New Loan Types
1. Create new specialist agents in `agents/` directory
2. Update routing logic in `loan-approval-coordinator-agent.ts`
3. Add corresponding tools and workflows as needed

## Performance Considerations

- **Response Time**: Loan assessments typically complete in 3-8 seconds
- **Rate Limits**: Respect OpenAI API rate limits for production use
- **Concurrent Processing**: Scale appropriately for expected loan volume
- **Database Integration**: Consider persistent storage for loan tracking
- **Caching**: Implement caching for repeated risk assessments

## License

ISC

## Support

For issues and questions:
- Review the troubleshooting section above
- Check Mastra documentation: [https://mastra.ai/docs](https://mastra.ai/docs)
- Verify your environment setup and API keys
- Ensure compliance with applicable financial regulations