import { safeErrorMessage } from '../util/safeErrorMessage';
import { KYCComplianceSchema, WorkflowStatusSchema } from '../../../types/kyc-compliance';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo (use database in production)
const complianceRecords = new Map<string, any>();

export const initiateComplianceHandler = async (c: any) => {
  try {
    const body = await c.req.json();
    const { customerType = 'individual' } = body;
    
    const customerId = uuidv4();
    const complianceRecord = {
      customerId,
      customerType,
      status: 'initiated',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    complianceRecords.set(customerId, complianceRecord);
    
    return c.json({
      success: true,
      customerId,
      status: 'initiated',
      customerType,
      message: 'KYC/AML compliance process initiated successfully',
      nextSteps: [
        'Collect customer information',
        'Upload identity documents',
        'Complete identity verification',
        'Conduct sanctions screening',
        'Perform risk assessment',
        'Complete compliance review'
      ]
    });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};

export const updateCustomerInfoHandler = async (c: any) => {
  try {
    const { customerId } = c.req.param();
    const body = await c.req.json();
    
    if (!complianceRecords.has(customerId)) {
      return c.json({ error: 'Customer compliance record not found' }, 404);
    }
    
    const record = complianceRecords.get(customerId);
    
    // Validate and update customer information based on type
    if (record.customerType === 'individual') {
      const personalInfo = KYCComplianceSchema.pick({ personalInfo: true }).parse({ personalInfo: body });
      record.personalInfo = personalInfo.personalInfo;
    } else {
      const businessInfo = KYCComplianceSchema.pick({ businessInfo: true }).parse({ businessInfo: body });
      record.businessInfo = businessInfo.businessInfo;
    }
    
    record.status = 'documents_collected';
    record.updatedAt = new Date().toISOString();
    
    complianceRecords.set(customerId, record);
    
    return c.json({
      success: true,
      customerId,
      status: record.status,
      message: 'Customer information collected successfully',
      nextStep: 'Upload identity documents for verification'
    });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 400);
  }
};

export const processDocumentHandler = async (c: any) => {
  try {
    const { customerId } = c.req.param();
    const { documentType, documentImage } = await c.req.json();
    
    if (!complianceRecords.has(customerId)) {
      return c.json({ error: 'Customer compliance record not found' }, 404);
    }
    
    const toolsModule = await import('../../tools/compliance-tools');
    const documentProcessor = toolsModule.documentProcessor;
    
    if (!documentProcessor?.execute) {
      return c.json({ error: 'Document processor not available' }, 500);
    }
    
    const result = await documentProcessor.execute({
      context: { documentType, documentImage, customerId },
      mastra: c.get('mastra'),
      runId: customerId,
      runtimeContext: c.get('runtimeContext')
    }) as any;
    
    if (result && result.success) {
      const record = complianceRecords.get(customerId);
      record.documents = record.documents || [];
      record.documents.push({
        documentType,
        extractedData: result.extractedData,
        confidenceScore: result.confidenceScore,
        processed: true,
        timestamp: result.timestamp
      });
      record.status = 'documents_collected';
      record.updatedAt = new Date().toISOString();
      
      complianceRecords.set(customerId, record);
    }
    
    return c.json(result);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};

export const verifyIdentityHandler = async (c: any) => {
  try {
    const { customerId } = c.req.param();
    
    if (!complianceRecords.has(customerId)) {
      return c.json({ error: 'Customer compliance record not found' }, 404);
    }
    
    const record = complianceRecords.get(customerId);
    
    if (!record.personalInfo && !record.businessInfo || !record.documents?.length) {
      return c.json({ 
        error: 'Customer information and documents required before identity verification' 
      }, 400);
    }
    
    const toolsModule = await import('../../tools/compliance-tools');
    const identityVerifier = toolsModule.identityVerifier;
    
    if (!identityVerifier?.execute) {
      return c.json({ error: 'Identity verifier not available' }, 500);
    }
    
    const result = await identityVerifier.execute({
      context: {
        customerId,
        personalInfo: record.personalInfo || {
          firstName: record.businessInfo?.beneficialOwners?.[0]?.firstName || "Business",
          lastName: record.businessInfo?.beneficialOwners?.[0]?.lastName || "Owner",
          dateOfBirth: record.businessInfo?.beneficialOwners?.[0]?.dateOfBirth || "1980-01-01",
          nationality: record.businessInfo?.beneficialOwners?.[0]?.nationality || "US",
          address: record.businessInfo?.address || record.personalInfo?.address
        },
        documents: record.documents.map((doc: any) => ({
          type: doc.documentType,
          number: doc.extractedData?.documentNumber || 'N/A',
          extractedData: doc.extractedData
        }))
      },
      mastra: c.get('mastra'),
      runId: customerId,
      runtimeContext: c.get('runtimeContext')
    }) as any;
    
    if (result && result.success) {
      record.verificationResults = record.verificationResults || {};
      record.verificationResults.identityVerified = result.verified;
      record.verificationResults.identityScore = result.score;
      record.verificationResults.verificationNotes = result.reasons?.join('; ') || 'Identity verification completed';
      record.status = result.verified ? 'identity_verified' : 'requires_manual_review';
      record.updatedAt = new Date().toISOString();
      
      complianceRecords.set(customerId, record);
    }
    
    return c.json(result);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};

export const sanctionsScreeningHandler = async (c: any) => {
  try {
    const { customerId } = c.req.param();
    
    if (!complianceRecords.has(customerId)) {
      return c.json({ error: 'Customer compliance record not found' }, 404);
    }
    
    const record = complianceRecords.get(customerId);
    
    if (!record.personalInfo && !record.businessInfo) {
      return c.json({ 
        error: 'Customer information required before sanctions screening' 
      }, 400);
    }
    
    const toolsModule = await import('../../tools/compliance-tools');
    const sanctionsScreener = toolsModule.sanctionsScreener;
    
    if (!sanctionsScreener?.execute) {
      return c.json({ error: 'Sanctions screener not available' }, 500);
    }
    
    const result = await sanctionsScreener.execute({
      context: {
        customerId,
        personalInfo: record.personalInfo ? {
          firstName: record.personalInfo.firstName,
          lastName: record.personalInfo.lastName,
          dateOfBirth: record.personalInfo.dateOfBirth,
          nationality: record.personalInfo.nationality,
          placeOfBirth: record.personalInfo.placeOfBirth
        } : undefined,
        businessInfo: record.businessInfo ? {
          companyName: record.businessInfo.companyName,
          registrationNumber: record.businessInfo.registrationNumber,
          address: {
            country: record.businessInfo.address.country
          }
        } : undefined
      },
      mastra: c.get('mastra'),
      runId: customerId,
      runtimeContext: c.get('runtimeContext')
    }) as any;
    
    if (result && result.success) {
      record.verificationResults = record.verificationResults || {};
      record.verificationResults.sanctionsScreened = result.screened;
      record.verificationResults.sanctionsRisk = result.overallRiskScore;
      record.verificationResults.sanctionsMatches = result.matches;
      record.status = result.hasMatches ? 'requires_manual_review' : 'sanctions_screened';
      record.updatedAt = new Date().toISOString();
      
      complianceRecords.set(customerId, record);
    }
    
    return c.json(result);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};

export const riskAssessmentHandler = async (c: any) => {
  try {
    const { customerId } = c.req.param();
    
    if (!complianceRecords.has(customerId)) {
      return c.json({ error: 'Customer compliance record not found' }, 404);
    }
    
    const record = complianceRecords.get(customerId);
    
    if (!record.verificationResults?.identityScore || record.verificationResults?.sanctionsRisk === undefined) {
      return c.json({ 
        error: 'Identity verification and sanctions screening required before risk assessment' 
      }, 400);
    }
    
    const toolsModule = await import('../../tools/compliance-tools');
    const riskAssessor = toolsModule.riskAssessor;
    
    if (!riskAssessor?.execute) {
      return c.json({ error: 'Risk assessor not available' }, 500);
    }
    
    const result = await riskAssessor.execute({
      context: {
        customerId,
        personalInfo: record.personalInfo,
        businessInfo: record.businessInfo,
        transactionProfile: {
          expectedVolume: record.personalInfo?.annualIncome || record.businessInfo?.annualRevenue || 100000,
          transactionTypes: ['deposit', 'withdrawal', 'transfer']
        },
        verificationResults: {
          identityScore: record.verificationResults.identityScore,
          sanctionsRisk: record.verificationResults.sanctionsRisk
        }
      },
      mastra: c.get('mastra'),
      runId: customerId,
      runtimeContext: c.get('runtimeContext')
    }) as any;
    
    if (result && result.success) {
      record.riskAssessment = {
        overallRiskScore: result.overallRiskScore,
        riskLevel: result.riskLevel,
        factors: result.factors,
        riskReasons: result.riskReasons,
        mitigationMeasures: result.mitigationMeasures
      };
      record.status = 'risk_assessed';
      record.updatedAt = new Date().toISOString();
      
      complianceRecords.set(customerId, record);
    }
    
    return c.json(result);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};

export const complianceReviewHandler = async (c: any) => {
  try {
    const { customerId } = c.req.param();
    
    if (!complianceRecords.has(customerId)) {
      return c.json({ error: 'Customer compliance record not found' }, 404);
    }
    
    const record = complianceRecords.get(customerId);
    
    if (!record.riskAssessment || record.verificationResults?.identityVerified === undefined) {
      return c.json({ 
        error: 'Risk assessment and identity verification required before compliance review' 
      }, 400);
    }
    
    const toolsModule = await import('../../tools/compliance-tools');
    const complianceReviewer = toolsModule.complianceReviewer;
    
    if (!complianceReviewer?.execute) {
      return c.json({ error: 'Compliance reviewer not available' }, 500);
    }
    
    const result = await complianceReviewer.execute({
      context: {
        customerId,
        customerType: record.customerType,
        verificationResults: {
          identityVerified: record.verificationResults.identityVerified,
          identityScore: record.verificationResults.identityScore,
          sanctionsScreened: record.verificationResults.sanctionsScreened,
          sanctionsRisk: record.verificationResults.sanctionsRisk
        },
        riskAssessment: record.riskAssessment,
        documentsCollected: !!record.documents?.length
      },
      mastra: c.get('mastra'),
      runId: customerId,
      runtimeContext: c.get('runtimeContext')
    }) as any;
    
    if (result && result.success) {
      record.approvalDecision = {
        decision: result.decision,
        decisionDate: new Date().toISOString(),
        decisionBy: 'Automated System',
        reasoning: result.reasoning,
        conditions: result.conditions
      };
      record.verificationResults.complianceScore = result.complianceScore;
      record.status = result.decision === 'approved' ? 'approved' : 
                     result.decision === 'rejected' ? 'rejected' : 'requires_manual_review';
      record.updatedAt = new Date().toISOString();
      
      complianceRecords.set(customerId, record);
    }
    
    return c.json(result);
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};

export const getComplianceStatusHandler = async (c: any) => {
  try {
    const { customerId } = c.req.param();
    
    if (!complianceRecords.has(customerId)) {
      return c.json({ error: 'Customer compliance record not found' }, 404);
    }
    
    const record = complianceRecords.get(customerId);
    
    return c.json({
      success: true,
      customerId,
      status: record.status,
      customerType: record.customerType,
      progress: {
        documentsCollected: !!record.documents?.length,
        identityVerified: record.verificationResults?.identityVerified || false,
        sanctionsScreened: record.verificationResults?.sanctionsScreened || false,
        riskAssessed: !!record.riskAssessment,
        complianceReviewed: !!record.approvalDecision,
        approvalComplete: record.status === 'approved'
      },
      verificationResults: record.verificationResults,
      riskAssessment: record.riskAssessment,
      approvalDecision: record.approvalDecision,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  } catch (err) {
    return c.json({ error: safeErrorMessage(err) }, 500);
  }
};