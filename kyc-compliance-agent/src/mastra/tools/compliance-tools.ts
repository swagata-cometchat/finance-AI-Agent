import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import * as crypto from "crypto";

export const documentProcessor = createTool({
  id: "documentProcessor",
  description: "Process and extract information from KYC/AML documents like passports, IDs, business licenses, and financial statements",
  inputSchema: z.object({
    documentType: z.enum(['passport', 'drivers_license', 'national_id', 'utility_bill', 'bank_statement', 'business_license', 'articles_of_incorporation', 'proof_of_address', 'financial_statement', 'tax_return']),
    documentImage: z.string().describe("Base64 encoded image or file path"),
    customerId: z.string().uuid(),
  }),
  execute: async ({ context }) => {
    const { documentType, documentImage, customerId } = context;
    
    try {
      // Simulate document processing (in real implementation, integrate with OCR service)
      const mockProcessingDelay = Math.random() * 3000 + 1500; // 1.5-4.5 seconds
      await new Promise(resolve => setTimeout(resolve, mockProcessingDelay));
      
      // Mock extracted data based on document type
      let extractedData: any = {};
      
      switch (documentType) {
        case 'passport':
          extractedData = {
            documentNumber: `P${Math.random().toString().substr(2, 8)}`,
            fullName: "John Alexander Doe",
            dateOfBirth: "1985-03-22",
            nationality: "USA",
            placeOfBirth: "New York, NY",
            issueDate: "2020-05-15",
            expirationDate: "2030-05-15",
            issuingAuthority: "US Department of State",
            documentValid: true,
          };
          break;
          
        case 'drivers_license':
          extractedData = {
            documentNumber: `DL${Math.random().toString().substr(2, 8)}`,
            fullName: "John Alexander Doe",
            dateOfBirth: "1985-03-22",
            address: "1234 Financial Street, New York, NY 10001",
            issueDate: "2022-03-22",
            expirationDate: "2027-03-22",
            issuingState: "NY",
            documentValid: true,
          };
          break;
          
        case 'utility_bill':
          extractedData = {
            accountHolder: "John A. Doe",
            address: "1234 Financial Street, New York, NY 10001",
            serviceProvider: "ConEd Electric",
            billDate: "2024-01-15",
            accountNumber: `AC${Math.random().toString().substr(2, 10)}`,
            documentValid: true,
          };
          break;
          
        case 'business_license':
          extractedData = {
            businessName: "Doe Financial Services LLC",
            licenseNumber: `BL${Math.random().toString().substr(2, 8)}`,
            issueDate: "2023-01-15",
            expirationDate: "2025-01-15",
            businessType: "Financial Services",
            issuingAuthority: "NY State Department",
            address: "1234 Business Ave, New York, NY 10001",
            documentValid: true,
          };
          break;
          
        case 'bank_statement':
          extractedData = {
            accountHolder: "John Alexander Doe",
            bankName: "First National Bank",
            accountNumber: `****${Math.random().toString().substr(2, 4)}`,
            statementDate: "2024-01-31",
            balance: 125000.50,
            address: "1234 Financial Street, New York, NY 10001",
            documentValid: true,
          };
          break;
          
        default:
          extractedData = {
            documentNumber: `DOC${Math.random().toString().substr(2, 8)}`,
            documentValid: true,
          };
      }
      
      // Generate confidence score
      const confidenceScore = 88 + Math.random() * 10; // 88-98%
      
      return {
        success: true,
        customerId,
        documentType,
        extractedData,
        confidenceScore: Math.round(confidenceScore),
        processingTime: mockProcessingDelay,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error: any) {
      return {
        success: false,
        error: `Document processing failed: ${error.message}`,
        customerId,
        documentType,
      };
    }
  },
});

export const identityVerifier = createTool({
  id: "identityVerifier", 
  description: "Verify customer identity against government databases and validate document authenticity",
  inputSchema: z.object({
    customerId: z.string().uuid(),
    personalInfo: z.object({
      firstName: z.string(),
      lastName: z.string(),
      dateOfBirth: z.string(),
      nationality: z.string(),
      ssn: z.string().optional(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
      }),
    }),
    documents: z.array(z.object({
      type: z.string(),
      number: z.string(),
      extractedData: z.any(),
    })),
  }),
  execute: async ({ context }) => {
    const { customerId, personalInfo, documents } = context;
    
    try {
      // Simulate identity verification process
      const verificationDelay = Math.random() * 4000 + 2000; // 2-6 seconds
      await new Promise(resolve => setTimeout(resolve, verificationDelay));
      
      // Mock verification checks
      const checks = {
        nameMatch: Math.random() > 0.05, // 95% success rate
        dobMatch: Math.random() > 0.03, // 97% success rate
        addressMatch: Math.random() > 0.12, // 88% success rate
        documentAuthentic: Math.random() > 0.08, // 92% success rate
        governmentDbMatch: Math.random() > 0.1, // 90% success rate
        biometricMatch: Math.random() > 0.15, // 85% success rate (if available)
      };
      
      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      const verificationScore = Math.round((passedChecks / totalChecks) * 100);
      
      const verified = verificationScore >= 85; // Require 85% or higher for KYC
      
      let reasons = [];
      if (!checks.nameMatch) reasons.push("Name mismatch in government records");
      if (!checks.dobMatch) reasons.push("Date of birth inconsistency");
      if (!checks.addressMatch) reasons.push("Address verification failed");
      if (!checks.documentAuthentic) reasons.push("Document authenticity concerns");
      if (!checks.governmentDbMatch) reasons.push("Government database verification failed");
      if (!checks.biometricMatch) reasons.push("Biometric verification failed");
      
      return {
        success: true,
        customerId,
        verified,
        score: verificationScore,
        checks,
        reasons: reasons.length > 0 ? reasons : undefined,
        riskLevel: verificationScore >= 95 ? 'low' : verificationScore >= 85 ? 'medium' : 'high',
        timestamp: new Date().toISOString(),
        processingTime: verificationDelay,
      };
      
    } catch (error: any) {
      return {
        success: false,
        error: `Identity verification failed: ${error.message}`,
        customerId,
      };
    }
  },
});

export const sanctionsScreener = createTool({
  id: "sanctionsScreener",
  description: "Screen customers against global sanctions lists, OFAC, UN, EU, and other regulatory watchlists",
  inputSchema: z.object({
    customerId: z.string().uuid(),
    personalInfo: z.object({
      firstName: z.string(),
      lastName: z.string(),
      dateOfBirth: z.string(),
      nationality: z.string(),
      placeOfBirth: z.string().optional(),
    }).optional(),
    businessInfo: z.object({
      companyName: z.string(),
      registrationNumber: z.string(),
      address: z.object({
        country: z.string(),
      }),
    }).optional(),
  }),
  execute: async ({ context }) => {
    const { customerId, personalInfo, businessInfo } = context;
    
    try {
      // Simulate sanctions screening process
      const screeningDelay = Math.random() * 5000 + 3000; // 3-8 seconds
      await new Promise(resolve => setTimeout(resolve, screeningDelay));
      
      // Mock sanctions screening results
      const screeningResults = {
        ofacMatch: Math.random() > 0.98, // 2% match rate
        unMatch: Math.random() > 0.99, // 1% match rate
        euMatch: Math.random() > 0.985, // 1.5% match rate
        pepMatch: Math.random() > 0.95, // 5% match rate
        adverseMediaMatch: Math.random() > 0.92, // 8% match rate
      };
      
      const hasMatches = Object.values(screeningResults).some(Boolean);
      const matchCount = Object.values(screeningResults).filter(Boolean).length;
      
      let matchDetails = [];
      if (screeningResults.ofacMatch) matchDetails.push({
        listName: "OFAC SDN",
        matchScore: 85 + Math.random() * 10,
        matchReason: "Name similarity with sanctioned individual"
      });
      if (screeningResults.unMatch) matchDetails.push({
        listName: "UN Consolidated List",
        matchScore: 80 + Math.random() * 15,
        matchReason: "Partial name match"
      });
      if (screeningResults.euMatch) matchDetails.push({
        listName: "EU Sanctions List",
        matchScore: 75 + Math.random() * 20,
        matchReason: "Business name similarity"
      });
      if (screeningResults.pepMatch) matchDetails.push({
        listName: "PEP Database",
        matchScore: 70 + Math.random() * 25,
        matchReason: "Politically Exposed Person connection"
      });
      if (screeningResults.adverseMediaMatch) matchDetails.push({
        listName: "Adverse Media",
        matchScore: 65 + Math.random() * 30,
        matchReason: "Negative news coverage"
      });
      
      const overallRiskScore = hasMatches ? 
        Math.min(95, 40 + (matchCount * 15) + Math.random() * 20) : 
        Math.max(5, Math.random() * 25);
      
      return {
        success: true,
        customerId,
        screened: true,
        hasMatches,
        matchCount,
        matches: matchDetails,
        overallRiskScore: Math.round(overallRiskScore),
        riskLevel: overallRiskScore >= 70 ? 'high' : overallRiskScore >= 40 ? 'medium' : 'low',
        listsScreened: ['OFAC', 'UN Consolidated', 'EU Sanctions', 'PEP', 'Adverse Media'],
        timestamp: new Date().toISOString(),
        processingTime: screeningDelay,
      };
      
    } catch (error: any) {
      return {
        success: false,
        error: `Sanctions screening failed: ${error.message}`,
        customerId,
      };
    }
  },
});

export const riskAssessor = createTool({
  id: "riskAssessor",
  description: "Comprehensive risk assessment based on customer profile, geography, occupation, and transaction patterns",
  inputSchema: z.object({
    customerId: z.string().uuid(),
    personalInfo: z.object({
      nationality: z.string(),
      placeOfBirth: z.string(),
      occupation: z.string(),
      annualIncome: z.number().optional(),
      sourceOfFunds: z.enum(['salary', 'business', 'investment', 'inheritance', 'other']),
    }).optional(),
    businessInfo: z.object({
      industry: z.string(),
      annualRevenue: z.number().optional(),
    }).optional(),
    transactionProfile: z.object({
      expectedVolume: z.number().optional(),
      transactionTypes: z.array(z.string()).optional(),
    }).optional(),
    verificationResults: z.object({
      identityScore: z.number(),
      sanctionsRisk: z.number(),
    }),
  }),
  execute: async ({ context }) => {
    const { customerId, personalInfo, businessInfo, transactionProfile, verificationResults } = context;
    
    try {
      // Simulate risk assessment process
      const assessmentDelay = Math.random() * 3000 + 2000; // 2-5 seconds
      await new Promise(resolve => setTimeout(resolve, assessmentDelay));
      
      // High-risk countries/regions (mock data)
      const highRiskCountries = ['Afghanistan', 'Iran', 'North Korea', 'Syria', 'Russia'];
      const mediumRiskCountries = ['China', 'Turkey', 'UAE', 'Panama', 'Myanmar'];
      
      // High-risk occupations
      const highRiskOccupations = ['MSB', 'Money Remitter', 'Casino', 'Arms Dealer', 'Art Dealer'];
      const mediumRiskOccupations = ['Real Estate', 'Jewelry', 'Cash-intensive Business'];
      
      // Calculate risk factors
      const geographicRisk = personalInfo ? (
        highRiskCountries.includes(personalInfo.nationality) ? 80 + Math.random() * 20 :
        mediumRiskCountries.includes(personalInfo.nationality) ? 40 + Math.random() * 30 :
        10 + Math.random() * 20
      ) : 20;
      
      const occupationRisk = personalInfo ? (
        highRiskOccupations.includes(personalInfo.occupation) ? 70 + Math.random() * 30 :
        mediumRiskOccupations.includes(personalInfo.occupation) ? 35 + Math.random() * 30 :
        5 + Math.random() * 25
      ) : 20;
      
      const transactionRisk = transactionProfile?.expectedVolume ? (
        transactionProfile.expectedVolume > 1000000 ? 60 + Math.random() * 30 :
        transactionProfile.expectedVolume > 100000 ? 30 + Math.random() * 30 :
        10 + Math.random() * 20
      ) : 15;
      
      const sanctionsRisk = verificationResults.sanctionsRisk || 0;
      const identityRisk = 100 - verificationResults.identityScore;
      const adverseMediaRisk = Math.random() * 40; // Random for demo
      
      // Calculate overall risk score (weighted average)
      const weights = {
        geographic: 0.2,
        occupation: 0.15,
        transaction: 0.2,
        sanctions: 0.25,
        identity: 0.15,
        adverseMedia: 0.05
      };
      
      const overallRiskScore = Math.round(
        geographicRisk * weights.geographic +
        occupationRisk * weights.occupation +
        transactionRisk * weights.transaction +
        sanctionsRisk * weights.sanctions +
        identityRisk * weights.identity +
        adverseMediaRisk * weights.adverseMedia
      );
      
      const riskLevel = overallRiskScore >= 70 ? 'critical' : 
                       overallRiskScore >= 50 ? 'high' : 
                       overallRiskScore >= 30 ? 'medium' : 'low';
      
      let riskReasons = [];
      if (geographicRisk > 50) riskReasons.push("High-risk jurisdiction");
      if (occupationRisk > 50) riskReasons.push("High-risk occupation");
      if (transactionRisk > 50) riskReasons.push("High transaction volume");
      if (sanctionsRisk > 30) riskReasons.push("Sanctions screening concerns");
      if (identityRisk > 30) riskReasons.push("Identity verification issues");
      
      let mitigationMeasures = [];
      if (riskLevel === 'critical') {
        mitigationMeasures.push("Enhanced due diligence required");
        mitigationMeasures.push("Senior management approval needed");
        mitigationMeasures.push("Ongoing monitoring required");
      } else if (riskLevel === 'high') {
        mitigationMeasures.push("Additional documentation required");
        mitigationMeasures.push("Enhanced monitoring");
      } else if (riskLevel === 'medium') {
        mitigationMeasures.push("Standard monitoring procedures");
      }
      
      return {
        success: true,
        customerId,
        overallRiskScore,
        riskLevel,
        factors: {
          geographicRisk: Math.round(geographicRisk),
          occupationRisk: Math.round(occupationRisk),
          transactionRisk: Math.round(transactionRisk),
          sanctionsRisk: Math.round(sanctionsRisk),
          pepRisk: Math.round(adverseMediaRisk * 0.6),
          adverseMediaRisk: Math.round(adverseMediaRisk),
        },
        riskReasons,
        mitigationMeasures,
        timestamp: new Date().toISOString(),
        processingTime: assessmentDelay,
      };
      
    } catch (error: any) {
      return {
        success: false,
        error: `Risk assessment failed: ${error.message}`,
        customerId,
      };
    }
  },
});

export const complianceReviewer = createTool({
  id: "complianceReviewer",
  description: "Final compliance review and approval decision based on all verification results and risk assessment",
  inputSchema: z.object({
    customerId: z.string().uuid(),
    customerType: z.enum(['individual', 'business']),
    verificationResults: z.object({
      identityVerified: z.boolean(),
      identityScore: z.number(),
      sanctionsScreened: z.boolean(),
      sanctionsRisk: z.number(),
    }),
    riskAssessment: z.object({
      overallRiskScore: z.number(),
      riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
      riskReasons: z.array(z.string()),
    }),
    documentsCollected: z.boolean(),
  }),
  execute: async ({ context }) => {
    const { customerId, customerType, verificationResults, riskAssessment, documentsCollected } = context;
    
    try {
      // Simulate compliance review process
      const reviewDelay = Math.random() * 2000 + 1000; // 1-3 seconds
      await new Promise(resolve => setTimeout(resolve, reviewDelay));
      
      // Compliance decision logic
      let decision = 'pending_review';
      let reasoning = '';
      let conditions: string[] = [];
      let complianceScore = 0;
      
      // Calculate compliance score (0-100)
      let scoreComponents = {
        identity: verificationResults.identityVerified ? (verificationResults.identityScore * 0.3) : 0,
        sanctions: verificationResults.sanctionsScreened ? ((100 - verificationResults.sanctionsRisk) * 0.3) : 0,
        risk: (100 - riskAssessment.overallRiskScore) * 0.3,
        documentation: documentsCollected ? 10 : 0,
      };
      
      complianceScore = Math.round(
        scoreComponents.identity + 
        scoreComponents.sanctions + 
        scoreComponents.risk + 
        scoreComponents.documentation
      );
      
      // Decision logic
      if (!verificationResults.identityVerified || !verificationResults.sanctionsScreened || !documentsCollected) {
        decision = 'rejected';
        reasoning = 'Incomplete verification process or missing required documents';
      } else if (riskAssessment.riskLevel === 'critical' || riskAssessment.overallRiskScore >= 80) {
        decision = 'pending_review';
        reasoning = 'High risk profile requires manual review and senior approval';
        conditions.push('Enhanced due diligence required');
        conditions.push('Senior compliance officer approval needed');
      } else if (riskAssessment.riskLevel === 'high' || complianceScore < 70) {
        decision = 'pending_review';
        reasoning = 'Medium-high risk profile requires additional review';
        conditions.push('Additional documentation may be required');
        conditions.push('Enhanced monitoring procedures');
      } else if (complianceScore >= 85 && riskAssessment.riskLevel === 'low') {
        decision = 'approved';
        reasoning = 'All verification checks passed with low risk profile';
      } else {
        decision = 'approved';
        reasoning = 'Verification completed with acceptable risk level';
        conditions.push('Standard monitoring procedures apply');
      }
      
      return {
        success: true,
        customerId,
        decision,
        reasoning,
        conditions,
        complianceScore,
        reviewSummary: {
          identityVerified: verificationResults.identityVerified,
          sanctionsCleared: verificationResults.sanctionsRisk < 50,
          riskAcceptable: riskAssessment.overallRiskScore < 70,
          documentationComplete: documentsCollected,
        },
        nextSteps: decision === 'approved' ? 
          ['Account setup', 'Welcome package', 'Ongoing monitoring'] :
          decision === 'pending_review' ?
          ['Manual review required', 'Additional documentation', 'Senior approval'] :
          ['Application rejected', 'Customer notification', 'Appeal process available'],
        timestamp: new Date().toISOString(),
        processingTime: reviewDelay,
      };
      
    } catch (error: any) {
      return {
        success: false,
        error: `Compliance review failed: ${error.message}`,
        customerId,
      };
    }
  },
});