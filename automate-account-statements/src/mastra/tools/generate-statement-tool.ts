import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// Import the same accounts database
const ACCOUNTS_DATABASE = [
  { 
    id: 'ACC-001', 
    customerId: 'CUST-101', 
    customerName: 'Alice Johnson', 
    accountNumber: '****1234',
    accountType: 'checking',
    balance: 15250.75,
    currency: 'USD',
    status: 'active',
    openedDate: '2023-01-15T00:00:00Z',
    lastActivity: '2025-09-24T14:30:00Z'
  },
  { 
    id: 'ACC-002', 
    customerId: 'CUST-102', 
    customerName: 'Bob Smith', 
    accountNumber: '****5678',
    accountType: 'savings',
    balance: 45780.25,
    currency: 'USD',
    status: 'active',
    openedDate: '2022-06-20T00:00:00Z',
    lastActivity: '2025-09-23T09:15:00Z'
  },
  { 
    id: 'ACC-003', 
    customerId: 'CUST-103', 
    customerName: 'Carol Davis', 
    accountNumber: '****9012',
    accountType: 'business',
    balance: 128500.00,
    currency: 'USD',
    status: 'active',
    openedDate: '2021-11-10T00:00:00Z',
    lastActivity: '2025-09-25T08:45:00Z'
  },
  { 
    id: 'ACC-004', 
    customerId: 'CUST-104', 
    customerName: 'David Wilson', 
    accountNumber: '****3456',
    accountType: 'checking',
    balance: 3420.50,
    currency: 'USD',
    status: 'active',
    openedDate: '2024-02-28T00:00:00Z',
    lastActivity: '2025-09-22T16:20:00Z'
  },
  { 
    id: 'ACC-005', 
    customerId: 'CUST-105', 
    customerName: 'Eva Brown', 
    accountNumber: '****7890',
    accountType: 'savings',
    balance: 67200.80,
    currency: 'USD',
    status: 'active',
    openedDate: '2023-08-05T00:00:00Z',
    lastActivity: '2025-09-24T11:00:00Z'
  },
];

// Simulated transactions for generating statements
const TRANSACTIONS_DATABASE = [
  { accountId: 'ACC-001', date: '2025-09-01', type: 'credit', amount: 2500.00, description: 'Salary Deposit', balance: 15250.75 },
  { accountId: 'ACC-001', date: '2025-09-05', type: 'debit', amount: 150.25, description: 'Grocery Store', balance: 12750.50 },
  { accountId: 'ACC-001', date: '2025-09-10', type: 'debit', amount: 800.00, description: 'Rent Payment', balance: 11950.50 },
  { accountId: 'ACC-001', date: '2025-09-15', type: 'credit', amount: 500.00, description: 'Freelance Payment', balance: 12450.50 },
  { accountId: 'ACC-001', date: '2025-09-20', type: 'debit', amount: 75.50, description: 'Utility Bill', balance: 12375.00 },
  
  { accountId: 'ACC-002', date: '2025-09-01', type: 'credit', amount: 5000.00, description: 'Investment Return', balance: 45780.25 },
  { accountId: 'ACC-002', date: '2025-09-15', type: 'credit', amount: 200.50, description: 'Interest Payment', balance: 45980.75 },
  
  { accountId: 'ACC-003', date: '2025-09-02', type: 'credit', amount: 15000.00, description: 'Business Revenue', balance: 128500.00 },
  { accountId: 'ACC-003', date: '2025-09-08', type: 'debit', amount: 2500.00, description: 'Office Supplies', balance: 126000.00 },
  { accountId: 'ACC-003', date: '2025-09-12', type: 'debit', amount: 5000.00, description: 'Equipment Purchase', balance: 121000.00 },
];

// Simulated statements database
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

export const generateStatementTool = createTool({
  id: 'generate-statement',
  description: 'Generate account statement for a specific account and time period',
  inputSchema: z.object({
    accountId: z.string().describe('Account ID to generate statement for'),
    startDate: z.string().describe('Start date for the statement period (YYYY-MM-DD)'),
    endDate: z.string().describe('End date for the statement period (YYYY-MM-DD)'),
    format: z.enum(['PDF', 'CSV', 'JSON']).default('PDF').describe('Format of the statement'),
    includeTransactions: z.boolean().default(true).describe('Include transaction details in the statement'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    statementId: z.string().optional(),
    accountId: z.string(),
    customerName: z.string().optional(),
    period: z.string(),
    format: z.string(),
    transactionCount: z.number(),
    openingBalance: z.number(),
    closingBalance: z.number(),
    totalCredits: z.number(),
    totalDebits: z.number(),
    downloadUrl: z.string().optional(),
    message: z.string(),
    generatedAt: z.string(),
    transactions: z.array(z.object({
      date: z.string(),
      type: z.string(),
      amount: z.number(),
      description: z.string(),
      balance: z.number(),
    })).optional(),
  }),
  execute: async ({ context }) => {
    const { accountId, startDate, endDate, format, includeTransactions } = context as { 
      accountId: string; 
      startDate: string; 
      endDate: string; 
      format: string;
      includeTransactions: boolean;
    };

    // Find the account
    const account = ACCOUNTS_DATABASE.find(a => a.id === accountId);
    
    if (!account) {
      return {
        success: false,
        accountId,
        period: `${startDate} to ${endDate}`,
        format,
        transactionCount: 0,
        openingBalance: 0,
        closingBalance: 0,
        totalCredits: 0,
        totalDebits: 0,
        message: `Account ${accountId} not found`,
        generatedAt: new Date().toISOString(),
      };
    }

    // Validate account status
    if (account.status !== 'active') {
      return {
        success: false,
        accountId,
        customerName: account.customerName,
        period: `${startDate} to ${endDate}`,
        format,
        transactionCount: 0,
        openingBalance: 0,
        closingBalance: account.balance,
        totalCredits: 0,
        totalDebits: 0,
        message: `Cannot generate statement for ${account.status} account`,
        generatedAt: new Date().toISOString(),
      };
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return {
        success: false,
        accountId,
        customerName: account.customerName,
        period: `${startDate} to ${endDate}`,
        format,
        transactionCount: 0,
        openingBalance: 0,
        closingBalance: account.balance,
        totalCredits: 0,
        totalDebits: 0,
        message: 'Start date cannot be after end date',
        generatedAt: new Date().toISOString(),
      };
    }

    // Filter transactions by account and date range
    const accountTransactions = TRANSACTIONS_DATABASE.filter(t => {
      const transactionDate = new Date(t.date);
      return t.accountId === accountId && 
             transactionDate >= start && 
             transactionDate <= end;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate statement metrics
    const totalCredits = accountTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalDebits = accountTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    // For simplicity, assume opening balance is current balance minus net changes
    const netChange = totalCredits - totalDebits;
    const openingBalance = account.balance - netChange;
    
    // Generate statement
    const statementId = `STMT-${uuidv4().substring(0, 8).toUpperCase()}`;
    const generatedAt = new Date().toISOString();
    const period = `${startDate} to ${endDate}`;
    const downloadUrl = `https://statements.bank.com/download/${statementId}.${format.toLowerCase()}`;

    // Store statement record
    STATEMENTS_DATABASE.push({
      id: statementId,
      accountId,
      period,
      statementDate: endDate,
      format,
      status: 'ready',
      generatedAt,
      downloadUrl,
    });

    const result = {
      success: true,
      statementId,
      accountId,
      customerName: account.customerName,
      period,
      format,
      transactionCount: accountTransactions.length,
      openingBalance,
      closingBalance: account.balance,
      totalCredits,
      totalDebits,
      downloadUrl,
      message: `Statement generated successfully for account ${accountId} (${period})`,
      generatedAt,
      ...(includeTransactions && { transactions: accountTransactions }),
    };

    return result;
  },
});