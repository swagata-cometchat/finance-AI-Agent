import { 
  initiateComplianceHandler,
  updateCustomerInfoHandler,
  processDocumentHandler,
  verifyIdentityHandler,
  sanctionsScreeningHandler,
  riskAssessmentHandler,
  complianceReviewHandler,
  getComplianceStatusHandler
} from './routes/compliance';

const rootRoute = {
  method: 'GET',
  path: '/',
  handler: (c: any) => c.text('KYC/AML Compliance Workflow Agent - OK'),
};

export const apiRoutes: Array<any> = [
  rootRoute,
  // KYC/AML compliance workflow routes
  {
    method: 'POST',
    path: '/api/compliance/initiate',
    handler: initiateComplianceHandler,
  },
  {
    method: 'PUT',
    path: '/api/compliance/:customerId/customer-info',
    handler: updateCustomerInfoHandler,
  },
  {
    method: 'POST',
    path: '/api/compliance/:customerId/process-document',
    handler: processDocumentHandler,
  },
  {
    method: 'POST',
    path: '/api/compliance/:customerId/verify-identity',
    handler: verifyIdentityHandler,
  },
  {
    method: 'POST',
    path: '/api/compliance/:customerId/sanctions-screening',
    handler: sanctionsScreeningHandler,
  },
  {
    method: 'POST',
    path: '/api/compliance/:customerId/risk-assessment',
    handler: riskAssessmentHandler,
  },
  {
    method: 'POST',
    path: '/api/compliance/:customerId/compliance-review',
    handler: complianceReviewHandler,
  },
  {
    method: 'GET',
    path: '/api/compliance/:customerId/status',
    handler: getComplianceStatusHandler,
  },
];