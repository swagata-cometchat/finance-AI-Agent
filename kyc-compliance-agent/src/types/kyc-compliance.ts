import { z } from 'zod';

// Address Schema
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
});

// Personal Information Schema
const PersonalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  dateOfBirth: z.string(),
  nationality: z.string(),
  placeOfBirth: z.string(),
  ssn: z.string().optional(),
  taxId: z.string().optional(),
  phone: z.string(),
  email: z.string().email(),
  address: AddressSchema,
  occupation: z.string(),
  employer: z.string().optional(),
  annualIncome: z.number().optional(),
  sourceOfFunds: z.enum(['salary', 'business', 'investment', 'inheritance', 'other']),
});

// Business Information Schema (for corporate customers)
const BusinessInfoSchema = z.object({
  companyName: z.string(),
  registrationNumber: z.string(),
  incorporationDate: z.string(),
  businessType: z.enum(['corporation', 'llc', 'partnership', 'sole_proprietorship', 'nonprofit', 'other']),
  industry: z.string(),
  address: AddressSchema,
  website: z.string().url().optional(),
  annualRevenue: z.number().optional(),
  numberOfEmployees: z.number().optional(),
  beneficialOwners: z.array(PersonalInfoSchema).optional(),
});

// Document Schema
const DocumentSchema = z.object({
  documentType: z.enum([
    'passport',
    'drivers_license', 
    'national_id',
    'utility_bill',
    'bank_statement',
    'business_license',
    'articles_of_incorporation',
    'proof_of_address',
    'financial_statement',
    'tax_return'
  ]),
  documentNumber: z.string(),
  issuingCountry: z.string(),
  issuingAuthority: z.string(),
  issueDate: z.string(),
  expirationDate: z.string().optional(),
  documentImage: z.string().describe("Base64 encoded image or file path"),
});

// Risk Assessment Schema
const RiskAssessmentSchema = z.object({
  overallRiskScore: z.number().min(0).max(100),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  factors: z.object({
    geographicRisk: z.number().min(0).max(100),
    occupationRisk: z.number().min(0).max(100),
    transactionRisk: z.number().min(0).max(100),
    sanctionsRisk: z.number().min(0).max(100),
    pepRisk: z.number().min(0).max(100),
    adverseMediaRisk: z.number().min(0).max(100),
  }),
  riskReasons: z.array(z.string()),
  mitigationMeasures: z.array(z.string()),
});

// Customer Type
export type CustomerType = 'individual' | 'business';

// Main KYC/AML Schema
export const KYCComplianceSchema = z.object({
  customerId: z.string().uuid(),
  customerType: z.enum(['individual', 'business']),
  personalInfo: PersonalInfoSchema.optional(),
  businessInfo: BusinessInfoSchema.optional(),
  documents: z.array(DocumentSchema).optional(),
  riskAssessment: RiskAssessmentSchema.optional(),
  verificationResults: z.object({
    identityVerified: z.boolean().optional(),
    addressVerified: z.boolean().optional(),
    sanctionsScreened: z.boolean().optional(),
    pepScreened: z.boolean().optional(),
    adverseMediaScreened: z.boolean().optional(),
    complianceScore: z.number().min(0).max(100).optional(),
  }).optional(),
  status: z.enum([
    'initiated',
    'documents_collected',
    'identity_verified',
    'risk_assessed',
    'sanctions_screened',
    'pep_screened',
    'adverse_media_screened',
    'compliance_reviewed',
    'approved',
    'rejected',
    'requires_manual_review'
  ]),
  approvalDecision: z.object({
    decision: z.enum(['approved', 'rejected', 'pending_review']),
    decisionDate: z.string(),
    decisionBy: z.string(),
    reasoning: z.string(),
    conditions: z.array(z.string()).optional(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Workflow Status Schema
export const WorkflowStatusSchema = z.object({
  customerId: z.string().uuid(),
  status: z.string(),
  progress: z.object({
    documentsCollected: z.boolean(),
    identityVerified: z.boolean(),
    riskAssessed: z.boolean(),
    sanctionsScreened: z.boolean(),
    pepScreened: z.boolean(),
    adverseMediaScreened: z.boolean(),
    complianceReviewed: z.boolean(),
    approvalComplete: z.boolean(),
  }),
});

// Export types
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type BusinessInfo = z.infer<typeof BusinessInfoSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type RiskAssessment = z.infer<typeof RiskAssessmentSchema>;
export type KYCCompliance = z.infer<typeof KYCComplianceSchema>;
export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;