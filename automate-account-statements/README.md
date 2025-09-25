# Mastra Account Statements Automation Agent

Create a Mastra agent that automates account statement generation and management through secure backend tools, providing comprehensive banking account operations.

## What you'll build

- A chat agent (`accountStatementsAgent`) that automates account statement generation and management
- Backend tools for account operations:
  - `get-account` - Retrieve account information and balances
  - `generate-statement` - Generate account statements in multiple formats
  - `get-statement-history` - Retrieve statement history and download links
- A chat endpoint that handles account statement requests with tool-grounded responses

## Prerequisites

- Node.js installed (>=20.9.0)
- A Mastra project
- CometChat app (optional)
- Environment: `.env` with `OPENAI_API_KEY`

## Quickstart

1. Install dependencies and run locally:

```bash
npm install
npx mastra dev
```

2. Test the agent with various scenarios:

**Get account information:**
```bash
curl -s -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
	-H 'Content-Type: application/json' \
	-d '{"messages":[{"role":"user","content":"Show me details for account ACC-001"}]}'
```

**Generate a PDF statement:**
```bash
curl -s -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
	-H 'Content-Type: application/json' \
	-d '{"messages":[{"role":"user","content":"Generate a PDF statement for account ACC-001 from 2025-09-01 to 2025-09-30"}]}'
```

**Generate a CSV statement:**
```bash
curl -s -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
	-H 'Content-Type: application/json' \
	-d '{"messages":[{"role":"user","content":"Create a CSV statement for account ACC-002 for September 2025"}]}'
```

**Get statement history:**
```bash
curl -s -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
	-H 'Content-Type: application/json' \
	-d '{"messages":[{"role":"user","content":"Show me statement history for account ACC-003"}]}'
```

**List accounts by type:**
```bash
curl -s -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
	-H 'Content-Type: application/json' \
	-d '{"messages":[{"role":"user","content":"List all checking accounts with their balances"}]}'
```

**List all business accounts:**
```bash
curl -s -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
	-H 'Content-Type: application/json' \
	-d '{"messages":[{"role":"user","content":"Show me all business accounts"}]}'
```

## How it works

1. **Account Retrieval**: The agent uses `get-account` to fetch account details, balances, and validate existence
2. **Statement Generation**: The `generate-statement` tool creates statements in PDF, CSV, or JSON formats for specified periods
3. **Statement History**: The `get-statement-history` tool retrieves previously generated statements with download links
4. **Smart Responses**: The agent provides detailed feedback about operations, including account summaries and statement details

## API Endpoints

- POST `/api/agents/accountStatementsAgent/generate` — Chat with the account statements agent

Expected local base: `http://localhost:4111/api`

## Project Structure

```
src/
├── mastra/
│   ├── index.ts                              # Main Mastra configuration
│   ├── agents/
│   │   └── account-statements-agent.ts       # Account statements agent
│   └── tools/
│       ├── index.ts                          # Tools export
│       ├── get-account-tool.ts               # Account retrieval tool
│       ├── generate-statement-tool.ts        # Statement generation tool
│       └── get-statement-history-tool.ts     # Statement history tool
├── package.json
├── tsconfig.json
└── README.md
```

## Features

### Account Management
- **Account Lookup**: Get specific account by ID or list all accounts
- **Account Filtering**: Filter by account type (checking, savings, business), customer ID, or status
- **Balance Information**: Real-time account balances and currency display
- **Account Status**: Track active, inactive, or closed account statuses

### Statement Generation
- **Multiple Formats**: Generate statements in PDF, CSV, or JSON format
- **Custom Periods**: Specify any date range for statement generation
- **Transaction Details**: Include or exclude transaction breakdowns
- **Automated Calculations**: Opening/closing balances, total credits/debits, transaction counts
- **Download Links**: Secure URLs for statement retrieval

### Statement History
- **Historical Records**: Track all previously generated statements
- **Search & Filter**: Filter by account, status, format, or date range
- **Download Management**: Access download links for existing statements
- **Status Tracking**: Monitor statement generation status (ready, processing, failed)

## Sample Data

The agent comes with sample accounts for testing:

| Account ID | Customer | Type | Balance | Status |
|------------|----------|------|---------|--------|
| ACC-001 | Alice Johnson | checking | $15,250.75 | active |
| ACC-002 | Bob Smith | savings | $45,780.25 | active |
| ACC-003 | Carol Davis | business | $128,500.00 | active |
| ACC-004 | David Wilson | checking | $3,420.50 | active |
| ACC-005 | Eva Brown | savings | $67,200.80 | active |

## Environment Variables

Create a `.env` file with:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Connect to CometChat

1. In CometChat Dashboard → AI Agents, set:
   - Provider = Mastra
   - Agent ID = `accountStatementsAgent`
   - Deployment URL = your public `/api/agents/accountStatementsAgent/generate`
2. Enable and save the configuration

## Business Rules

### Account Access Rules
- Only active accounts can generate new statements
- Account information includes masked account numbers for security
- Balance information is displayed in appropriate currency format

### Statement Generation Rules
- Start date cannot be after end date
- Statements include opening balance, closing balance, and net change calculations
- Transaction details are sorted chronologically
- Each statement gets a unique ID for tracking and download

### Security Considerations
- Account numbers are masked (showing only last 4 digits)
- Statements include secure download URLs
- All operations include timestamp tracking for audit purposes

## Error Handling

The agent provides clear error messages for:
- Account not found scenarios
- Invalid date ranges for statement periods
- Inactive account statement generation attempts
- Missing required parameters
- Statement generation failures

## Security Considerations

- Add authentication (API keys/JWT) for production use
- Implement rate limiting for API endpoints
- Add CORS restrictions for browser access
- Validate and sanitize all inputs
- Add audit logging for financial operations
- Store sensitive data server-side only
- Implement proper access controls for account data

## Testing Scenarios

### Successful Operations
```bash
# Get specific account details
curl -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"What are the details of account ACC-001?"}]}'

# Generate statement with transactions
curl -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Generate a detailed PDF statement for ACC-001 from 2025-09-01 to 2025-09-25"}]}'

# List accounts by customer
curl -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Show all accounts for customer CUST-101"}]}'
```

### Error Scenarios
```bash
# Non-existent account
curl -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Generate statement for account ACC-999"}]}'

# Invalid date range
curl -X POST http://localhost:4111/api/agents/accountStatementsAgent/generate \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Generate statement for ACC-001 from 2025-10-01 to 2025-09-01"}]}'
```

## Troubleshooting

### Common Issues

**Agent not generating statements:**
- Verify tools are properly registered in the agent
- Check that OpenAI API key is set correctly
- Ensure the agent is using the correct tool names
- Verify account exists and is active

**Statement generation failures:**
- Check date format (YYYY-MM-DD expected)
- Ensure start date is before end date
- Verify account status is 'active'
- Check for valid account ID format

**Tool execution failures:**
- Check server logs for detailed error messages
- Verify input parameters match expected schemas
- Ensure database/storage connections are working
- Validate date parsing and calculations

### Development Tips

1. **Database Integration**: Replace simulated data with real database connections
2. **Statement Storage**: Integrate with cloud storage (S3, Azure Blob) for statement files
3. **Email Notifications**: Add automatic email delivery of generated statements
4. **Advanced Reporting**: Add tools for account analytics and financial reporting
5. **Multi-Currency Support**: Extend for international accounts and currencies

## Advanced Features

### Custom Statement Formats
- Add support for Excel (XLSX) format
- Implement custom statement templates
- Add company branding and logos
- Support multi-language statement generation

### Automation Features
- Scheduled statement generation
- Automatic monthly/quarterly statements
- Statement delivery via email or API
- Integration with accounting systems

### Analytics and Reporting
- Account activity summaries
- Spending pattern analysis
- Balance trend reporting
- Customer financial insights

## Links

- [Mastra Core Documentation](https://docs.mastra.ai)
- [CometChat AI Agents Guide](https://www.cometchat.com/docs/ai-agents)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## License

ISC License - See package.json for details.