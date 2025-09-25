import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Simulated accounts database
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

export const getAccountTool = createTool({
  id: 'get-account',
  description: 'Get account information by account ID or list all accounts with optional filtering',
  inputSchema: z.object({
    accountId: z.string().optional().describe('Specific account ID to retrieve (if not provided, returns all accounts)'),
    accountType: z.string().optional().describe('Filter accounts by type (checking, savings, business)'),
    customerId: z.string().optional().describe('Filter accounts by customer ID'),
    status: z.string().optional().describe('Filter accounts by status (active, inactive, closed)'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    accounts: z.array(z.object({
      id: z.string(),
      customerId: z.string(),
      customerName: z.string(),
      accountNumber: z.string(),
      accountType: z.string(),
      balance: z.number(),
      currency: z.string(),
      status: z.string(),
      openedDate: z.string(),
      lastActivity: z.string(),
      displayBalance: z.string(),
      displayOpenedDate: z.string(),
      displayLastActivity: z.string(),
    })),
    message: z.string(),
    total: z.number(),
    totalBalance: z.number(),
  }),
  execute: async ({ context }) => {
    const { accountId, accountType, customerId, status } = context as { 
      accountId?: string; 
      accountType?: string; 
      customerId?: string;
      status?: string;
    };

    let filteredAccounts = [...ACCOUNTS_DATABASE];

    // Filter by specific account ID
    if (accountId) {
      filteredAccounts = filteredAccounts.filter(a => a.id === accountId);
      if (filteredAccounts.length === 0) {
        return {
          success: false,
          accounts: [],
          message: `Account ${accountId} not found`,
          total: 0,
          totalBalance: 0,
        };
      }
    }

    // Filter by account type if provided
    if (accountType) {
      filteredAccounts = filteredAccounts.filter(a => a.accountType.toLowerCase() === accountType.toLowerCase());
    }

    // Filter by customer ID if provided
    if (customerId) {
      filteredAccounts = filteredAccounts.filter(a => a.customerId === customerId);
    }

    // Filter by status if provided
    if (status) {
      filteredAccounts = filteredAccounts.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    // Transform accounts for display
    const accounts = filteredAccounts.map(account => ({
      ...account,
      displayBalance: `${account.currency} ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      displayOpenedDate: new Date(account.openedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      displayLastActivity: new Date(account.lastActivity).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));

    const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);

    let message = '';
    if (accountId) {
      message = `Found account ${accountId}`;
    } else if (accountType) {
      message = `Found ${accounts.length} ${accountType} accounts`;
    } else if (customerId) {
      message = `Found ${accounts.length} accounts for customer ${customerId}`;
    } else if (status) {
      message = `Found ${accounts.length} ${status} accounts`;
    } else {
      message = `Found ${accounts.length} total accounts`;
    }

    return {
      success: true,
      accounts,
      message,
      total: accounts.length,
      totalBalance,
    };
  },
});