# Loan Policies & Features Knowledge Agent

A specialized Mastra-powered knowledge agent that provides comprehensive information about loan policies, features, and financial products. This agent can answer questions about personal loans, mortgages, business loans, and other lending products using a knowledge base of policy documents.

## Features

- 🏦 **Loan Policy Knowledge**: Access to comprehensive loan policy documents including personal loans, mortgages, and business loans
- 🤖 **AI-Powered Responses**: Uses GPT-4o to provide accurate, contextual answers about loan policies and features
- 📚 **Document Retrieval**: Intelligent search through loan policy documents with relevance scoring
- 💼 **Financial Compliance**: Built-in disclaimers and professional guidance recommendations
- 🔍 **Multi-Format Support**: Ingests PDF, HTML, Markdown, and text documents
- 🎯 **Specialized Instructions**: Tailored for financial services with appropriate disclaimers and guidance

## Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- Terminal/command line access

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd loan-policies-and-features
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The agent will be available at `http://localhost:4111`

## Usage

### Testing with cURL

Once the server is running, you can test the agent with these cURL commands:

#### 1. Check Server Health
```bash
curl http://localhost:4111/
```

#### 2. Search Loan Documents
```bash
curl -X POST http://localhost:4111/api/tools/searchDocs \
  -H "Content-Type: application/json" \
  -d '{
    "query": "personal loan requirements",
    "namespace": "loans",
    "maxResults": 5
  }'
```

#### 3. Chat with the Loan Agent
```bash
curl -X POST http://localhost:4111/api/agent/loan-policies/text \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What are the credit score requirements for a personal loan?"
      }
    ]
  }'
```

#### 4. Ask About Mortgage Requirements
```bash
curl -X POST http://localhost:4111/api/agent/loan-policies/text \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user", 
        "content": "What are the down payment requirements for FHA loans?"
      }
    ]
  }'
```

#### 5. Business Loan Information
```bash
curl -X POST http://localhost:4111/api/agent/loan-policies/text \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What documents do I need for a small business loan application?"
      }
    ]
  }'
```

### Adding New Loan Policy Documents

You can add new loan policy documents using the ingest API:

```bash
curl -X POST http://localhost:4111/api/tools/ingestSources \
  -H "Content-Type: application/json" \
  -d '{
    "sources": [
      "https://example.com/loan-policy.pdf",
      "path/to/local/policy-document.md"
    ],
    "namespace": "loans"
  }'
```

## Project Structure

```
loan-policies-and-features/
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── knowledge/              # Knowledge base documents
│   └── loans/              # Loan policy documents
│       ├── personal-loan-policy.md
│       ├── mortgage-loan-policy.md
│       └── business-loan-policy.md
└── src/                    # Source code
    └── mastra/             # Mastra configuration
        ├── index.ts        # Main Mastra setup
        ├── agents/         # Agent definitions
        │   ├── index.ts
        │   └── loan-policies-agent.ts
        ├── tools/          # Tools and utilities
        │   ├── index.ts
        │   ├── docs-retriever.ts
        │   └── ingest-sources.ts
        └── server/         # API server setup
            ├── routes.ts
            ├── routes/     # Individual route handlers
            │   ├── ingest.ts
            │   └── searchDocs.ts
            └── util/       # Utility functions
                └── safeErrorMessage.ts
```

## Knowledge Base

The agent comes with pre-populated loan policy documents covering:

### Personal Loans
- Standard Personal Loans ($1,000 - $50,000)
- Quick Cash Loans ($500 - $5,000)
- Eligibility requirements and credit scores
- Application process and documentation
- Fees, rates, and repayment terms

### Mortgage Loans
- Conventional, FHA, VA, and USDA programs
- Down payment and credit requirements
- Property requirements and appraisal process
- Closing costs and fees
- Special programs and assistance

### Business Loans
- Small Business Term Loans
- Business Lines of Credit
- SBA 7(a) Loans
- Eligibility and documentation requirements
- Underwriting criteria and collateral

## API Endpoints

### Agent Endpoints
- `POST /api/agent/loan-policies/text` - Chat with the loan policies agent
- `POST /api/agent/loan-policies/stream` - Stream responses from the agent

### Tool Endpoints
- `POST /api/tools/searchDocs` - Search loan policy documents
- `POST /api/tools/ingestSources` - Add new documents to knowledge base

### Utility Endpoints
- `GET /` - Health check

## Configuration

### Environment Variables
- `OPENAI_API_KEY` - Required for AI responses
- `PORT` - Server port (default: 4111)
- `DATABASE_URL` - Database connection (default: file-based SQLite)

### Customization
- Modify `src/mastra/agents/loan-policies-agent.ts` to adjust agent behavior
- Add new knowledge documents to `knowledge/loans/`
- Extend tools in `src/mastra/tools/` for additional functionality

## Financial Disclaimers

This agent provides educational information only and includes appropriate financial disclaimers:
- Information is for educational purposes only
- Recommends consulting with qualified financial advisors
- Reminds users that loan approval is subject to credit review
- Directs users to speak with loan specialists for specific applications

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm test` - Run test suite (if configured)

### Dependencies
- **@mastra/core**: Core Mastra framework
- **@ai-sdk/openai**: OpenAI integration
- **@mastra/memory**: Conversation memory
- **@mastra/libsql**: Database storage
- **pdf-parse**: PDF document processing
- **cheerio**: HTML parsing
- **axios**: HTTP requests

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY not set"**
   - Ensure your `.env` file contains a valid OpenAI API key

2. **"No knowledge documents found"**
   - Check that documents exist in `knowledge/loans/`
   - Verify file permissions and paths

3. **"Database connection error"**
   - Ensure the `.mastra` directory has write permissions
   - Check database URL configuration

### Getting Help

For issues specific to this agent:
1. Check the server logs for detailed error messages
2. Verify all environment variables are properly set
3. Ensure all dependencies are installed correctly

## License

This project is licensed under the ISC License.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Disclaimer**: This agent provides general information about loan policies and should not replace professional financial advice. Always consult with qualified financial advisors for personalized guidance.