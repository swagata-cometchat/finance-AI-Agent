# KYC/AML Compliance Workflow Agent

A comprehensive **Know Your Customer (KYC)** and **Anti-Money Laundering (AML)** compliance workflow agent built with **Mastra**. This system automates customer due diligence, risk assessment, document verification, sanctions screening, and regulatory compliance for financial institutions.

## 🎯 Overview

This agent provides end-to-end automation for KYC/AML compliance processes, including:
- **Document Processing**: OCR and extraction from identity documents
- **Identity Verification**: Government database verification
- **Sanctions Screening**: Global watchlist screening (OFAC, UN, EU, PEP)
- **Risk Assessment**: Comprehensive customer risk evaluation
- **Compliance Review**: Automated approval/rejection decisions
- **Regulatory Compliance**: BSA, AML, OFAC compliance standards

## 🏗 Architecture

The system consists of three specialized AI agents:

### 1. **KYC Compliance Agent** (`kyc-compliance`)
- **Primary Role**: Main workflow orchestrator
- **Capabilities**: Document processing, identity verification, sanctions screening, risk assessment
- **Tools**: All compliance tools (documentProcessor, identityVerifier, sanctionsScreener, riskAssessor, complianceReviewer)

### 2. **Compliance Officer Agent** (`compliance-officer`)
- **Primary Role**: Senior compliance review and high-risk case handling
- **Capabilities**: Complex case analysis, final approval decisions, regulatory guidance
- **Tools**: identityVerifier, sanctionsScreener, riskAssessor, complianceReviewer

### 3. **Risk Analyst Agent** (`risk-analyst`)
- **Primary Role**: Detailed risk analysis and sanctions investigation
- **Capabilities**: Risk factor analysis, sanctions match investigation, adverse media research
- **Tools**: sanctionsScreener, riskAssessor

## 🚀 Getting Started

### Prerequisites
- Node.js 20.16.0+
- TypeScript 5.8+
- OpenAI API key

### Installation

1. **Clone and navigate to the project:**
```bash
cd kyc-compliance-agent
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your OpenAI API key
```

4. **Start the development server:**
```bash
npm run dev
```

The server will start at `http://localhost:4111` with:
- **Playground UI**: http://localhost:4111/
- **API Endpoints**: http://localhost:4111/api
- **Swagger Documentation**: http://localhost:4111/docs

## 📋 API Endpoints

### Core Workflow Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/compliance/initiate` | Initiate KYC/AML process |
| `PUT` | `/api/compliance/:customerId/customer-info` | Update customer information |
| `POST` | `/api/compliance/:customerId/process-document` | Process identity documents |
| `POST` | `/api/compliance/:customerId/verify-identity` | Verify customer identity |
| `POST` | `/api/compliance/:customerId/sanctions-screening` | Screen against sanctions lists |
| `POST` | `/api/compliance/:customerId/risk-assessment` | Perform risk assessment |
| `POST` | `/api/compliance/:customerId/compliance-review` | Final compliance review |
| `GET` | `/api/compliance/:customerId/status` | Get compliance status |

## 🧪 Testing with cURL

### 1. Initiate Compliance Process
```bash
curl -X POST http://localhost:4111/api/compliance/initiate \
  -H 'Content-Type: application/json' \
  -d '{"customerType": "individual"}'
```

**Response:**
```json
{
  "success": true,
  "customerId": "b4b37419-bfc5-4940-b15e-2721eb2c4eee",
  "status": "initiated",
  "customerType": "individual",
  "message": "KYC/AML compliance process initiated successfully",
  "nextSteps": [
    "Collect customer information",
    "Upload identity documents",
    "Complete identity verification",
    "Conduct sanctions screening",
    "Perform risk assessment",
    "Complete compliance review"
  ]
}
```

### 2. Update Customer Information
```bash
curl -X PUT http://localhost:4111/api/compliance/{customerId}/customer-info \
  -H 'Content-Type: application/json' \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1985-03-22",
    "nationality": "USA",
    "placeOfBirth": "New York, NY",
    "ssn": "123-45-6789",
    "phone": "+1-555-123-4567",
    "email": "john.doe@example.com",
    "address": {
      "street": "1234 Financial Street",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "occupation": "Software Engineer",
    "employer": "Tech Corp Inc",
    "annualIncome": 150000,
    "sourceOfFunds": "salary"
  }'
```

### 3. Process Document
```bash
curl -X POST http://localhost:4111/api/compliance/{customerId}/process-document \
  -H 'Content-Type: application/json' \
  -d '{
    "documentType": "passport",
    "documentImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
  }'
```

**Response:**
```json
{
  "success": true,
  "customerId": "b4b37419-bfc5-4940-b15e-2721eb2c4eee",
  "documentType": "passport",
  "extractedData": {
    "documentNumber": "P81818458",
    "fullName": "John Alexander Doe",
    "dateOfBirth": "1985-03-22",
    "nationality": "USA",
    "placeOfBirth": "New York, NY",
    "issueDate": "2020-05-15",
    "expirationDate": "2030-05-15",
    "issuingAuthority": "US Department of State",
    "documentValid": true
  },
  "confidenceScore": 97,
  "processingTime": 3526.83,
  "timestamp": "2025-09-25T07:28:47.489Z"
}
```

### 4. Complete Full Workflow
Continue with identity verification, sanctions screening, risk assessment, and compliance review:

```bash
# Identity Verification
curl -X POST http://localhost:4111/api/compliance/{customerId}/verify-identity \
  -H 'Content-Type: application/json' -d '{}'

# Sanctions Screening
curl -X POST http://localhost:4111/api/compliance/{customerId}/sanctions-screening \
  -H 'Content-Type: application/json' -d '{}'

# Risk Assessment
curl -X POST http://localhost:4111/api/compliance/{customerId}/risk-assessment \
  -H 'Content-Type: application/json' -d '{}'

# Compliance Review
curl -X POST http://localhost:4111/api/compliance/{customerId}/compliance-review \
  -H 'Content-Type: application/json' -d '{}'

# Check Status
curl -X GET http://localhost:4111/api/compliance/{customerId}/status
```

## 🔧 Features

### Document Processing
- **Supported Documents**: Passport, Driver's License, National ID, Utility Bills, Bank Statements, Business Licenses
- **OCR Technology**: Automated text extraction and validation
- **Confidence Scoring**: 88-98% accuracy rates with confidence metrics

### Identity Verification
- **Multi-Factor Verification**: Name, DOB, address, document authenticity
- **Government Database**: Cross-reference with official records
- **Biometric Matching**: Advanced identity verification (when available)
- **Risk Scoring**: 0-100 scale with pass/fail thresholds

### Sanctions Screening
- **Global Watchlists**: OFAC SDN, UN Consolidated, EU Sanctions
- **PEP Screening**: Politically Exposed Persons database
- **Adverse Media**: Negative news coverage analysis
- **Match Investigation**: False positive analysis and confirmation

### Risk Assessment
- **Geographic Risk**: Country/jurisdiction risk evaluation
- **Occupational Risk**: Industry and profession risk factors
- **Transaction Risk**: Volume and pattern analysis
- **Comprehensive Scoring**: Weighted risk algorithm (0-100 scale)

### Compliance Review
- **Automated Decisions**: Rule-based approval/rejection logic
- **Risk Thresholds**: Configurable risk tolerance levels
- **Regulatory Compliance**: BSA, AML, OFAC standards
- **Audit Trail**: Complete documentation for regulatory review

## 📊 Risk Assessment Matrix

| Risk Level | Score Range | Description | Actions Required |
|------------|-------------|-------------|------------------|
| **Low** | 0-30 | Standard risk profile | Routine monitoring |
| **Medium** | 31-50 | Moderate risk factors | Enhanced monitoring |
| **High** | 51-70 | Elevated risk profile | Enhanced due diligence, senior approval |
| **Critical** | 71-100 | High-risk customer | Manual review, extensive documentation |

## 🔒 Compliance Standards

### Regulatory Framework
- **BSA (Bank Secrecy Act)**: US financial reporting requirements
- **AML (Anti-Money Laundering)**: Global money laundering prevention
- **OFAC Compliance**: US sanctions and export controls
- **FATF Standards**: International AML/CFT standards
- **KYC Requirements**: Customer identification and verification

### Data Security
- **Encryption**: End-to-end data encryption
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking
- **Data Retention**: Regulatory-compliant data management

## 🏢 Use Cases

### Financial Institutions
- **Banks**: Customer onboarding and account opening
- **Credit Unions**: Member verification and compliance
- **Investment Firms**: Client suitability and risk assessment
- **Insurance Companies**: Policyholder verification

### Fintech Companies
- **Digital Wallets**: User verification and risk management
- **Cryptocurrency Exchanges**: Enhanced due diligence
- **Payment Processors**: Merchant onboarding
- **Lending Platforms**: Borrower verification

### Regulatory Technology
- **Compliance Software**: Automated KYC/AML workflows
- **RegTech Solutions**: Regulatory reporting and monitoring
- **Risk Management**: Customer risk assessment and monitoring

## 🛠 Development

### Project Structure
```
src/
├── types/
│   └── kyc-compliance.ts          # TypeScript schemas and types
├── mastra/
│   ├── index.ts                   # Main Mastra configuration
│   ├── agents/
│   │   └── compliance-agent.ts    # AI agents (KYC, Officer, Analyst)
│   ├── tools/
│   │   ├── compliance-tools.ts    # Core compliance tools
│   │   └── index.ts              # Tools export
│   └── server/
│       ├── routes.ts             # API route configuration
│       ├── routes/
│       │   └── compliance.ts     # Route handlers
│       └── util/
│           └── safeErrorMessage.ts # Error handling utility
└── index.ts                      # Application entry point
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite (placeholder)

### Environment Variables
```env
# Required
OPENAI_API_KEY="your-openai-api-key"
DATABASE_URL="file:../mastra.db"

# Server Configuration
PORT=4111
NODE_ENV=development
```

## 🚀 Production Deployment

### Database Setup
Replace in-memory storage with persistent database:
```typescript
// Use LibSQL, PostgreSQL, or MongoDB
import { LibsqlMemory } from '@mastra/libsql';

const db = new LibsqlMemory({
  url: process.env.DATABASE_URL
});
```

### External Service Integration
```typescript
// Integrate with real KYC/AML providers
const kycProvider = new KYCProvider({
  apiKey: process.env.KYC_API_KEY,
  endpoint: process.env.KYC_API_URL
});
```

### Security Considerations
- Enable HTTPS/TLS encryption
- Implement API rate limiting
- Add authentication and authorization
- Configure CORS policies
- Enable audit logging
- Implement data encryption at rest

## 📚 API Documentation

Complete API documentation is available via Swagger UI at:
`http://localhost:4111/docs` (when server is running)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Review the API documentation at `/docs`
- Check the example cURL commands above
- Review the workflow status using the status endpoint
- Examine server logs for detailed error information

## ⚠️ Important Notes

- **Demo Mode**: Currently uses in-memory storage - data resets on server restart
- **Mock Data**: Sanctions screening and risk assessment use simulated data
- **Production Ready**: Requires database integration and real service providers
- **Regulatory Compliance**: Ensure proper licensing and regulatory approval before production use

---

**Built with ❤️ using [Mastra](https://mastra.ai) - The AI Agent Framework**