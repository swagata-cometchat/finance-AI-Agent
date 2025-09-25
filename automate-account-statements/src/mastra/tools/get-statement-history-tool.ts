import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Simulated statements database (same as in generate-statement-tool)
const STATEMENTS_DATABASE: Array<{
  id: string;
  accountId: string;
  period: string;
  statementDate: string;
  format: string;
  status: string;
  generatedAt: string;
  downloadUrl: string;
}> = [];

// Pre-populate with some sample statements
STATEMENTS_DATABASE.push(
  {
    id: 'STMT-A1B2C3D4',
    accountId: 'ACC-001',
    period: '2025-08-01 to 2025-08-31',
    statementDate: '2025-08-31',
    format: 'PDF',
    status: 'ready',
    generatedAt: '2025-09-01T08:00:00Z',
    downloadUrl: 'https://statements.bank.com/download/STMT-A1B2C3D4.pdf'
  },
  {
    id: 'STMT-E5F6G7H8',
    accountId: 'ACC-002',
    period: '2025-08-01 to 2025-08-31',
    statementDate: '2025-08-31',
    format: 'CSV',
    status: 'ready',
    generatedAt: '2025-09-01T09:30:00Z',
    downloadUrl: 'https://statements.bank.com/download/STMT-E5F6G7H8.csv'
  },
  {
    id: 'STMT-I9J0K1L2',
    accountId: 'ACC-003',
    period: '2025-07-01 to 2025-07-31',
    statementDate: '2025-07-31',
    format: 'PDF',
    status: 'ready',
    generatedAt: '2025-08-01T10:15:00Z',
    downloadUrl: 'https://statements.bank.com/download/STMT-I9J0K1L2.pdf'
  },
);

export const getStatementHistoryTool = createTool({
  id: 'get-statement-history',
  description: 'Get statement history for an account or specific statement details',
  inputSchema: z.object({
    accountId: z.string().optional().describe('Account ID to get statement history for (if not provided, returns all statements)'),
    statementId: z.string().optional().describe('Specific statement ID to retrieve'),
    status: z.string().optional().describe('Filter statements by status (ready, processing, failed)'),
    format: z.string().optional().describe('Filter statements by format (PDF, CSV, JSON)'),
    limit: z.number().optional().default(10).describe('Maximum number of statements to return'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    statements: z.array(z.object({
      id: z.string(),
      accountId: z.string(),
      period: z.string(),
      statementDate: z.string(),
      format: z.string(),
      status: z.string(),
      generatedAt: z.string(),
      downloadUrl: z.string(),
      displayGeneratedAt: z.string(),
      displayStatementDate: z.string(),
    })),
    message: z.string(),
    total: z.number(),
  }),
  execute: async ({ context }) => {
    const { accountId, statementId, status, format, limit } = context as { 
      accountId?: string; 
      statementId?: string; 
      status?: string; 
      format?: string;
      limit?: number;
    };

    let filteredStatements = [...STATEMENTS_DATABASE];

    // Filter by specific statement ID
    if (statementId) {
      filteredStatements = filteredStatements.filter(s => s.id === statementId);
      if (filteredStatements.length === 0) {
        return {
          success: false,
          statements: [],
          message: `Statement ${statementId} not found`,
          total: 0,
        };
      }
    }

    // Filter by account ID if provided
    if (accountId) {
      filteredStatements = filteredStatements.filter(s => s.accountId === accountId);
    }

    // Filter by status if provided
    if (status) {
      filteredStatements = filteredStatements.filter(s => s.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by format if provided
    if (format) {
      filteredStatements = filteredStatements.filter(s => s.format.toLowerCase() === format.toLowerCase());
    }

    // Sort by generation date (newest first) and apply limit
    filteredStatements = filteredStatements
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, limit || 10);

    // Transform statements for display
    const statements = filteredStatements.map(statement => ({
      ...statement,
      displayGeneratedAt: new Date(statement.generatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      displayStatementDate: new Date(statement.statementDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }));

    let message = '';
    if (statementId) {
      message = `Found statement ${statementId}`;
    } else if (accountId) {
      message = `Found ${statements.length} statements for account ${accountId}`;
    } else if (status) {
      message = `Found ${statements.length} ${status} statements`;
    } else if (format) {
      message = `Found ${statements.length} ${format} statements`;
    } else {
      message = `Found ${statements.length} total statements`;
    }

    return {
      success: true,
      statements,
      message,
      total: statements.length,
    };
  },
});