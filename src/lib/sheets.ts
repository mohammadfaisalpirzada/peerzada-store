import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const USERS_RANGE = 'Users!A:G';
const USERS_ALL_RANGE = 'Users!A2:G';
const ORDERS_RANGE = 'Orders!A:I';
const ORDERS_ALL_RANGE = 'Orders!A2:I';

function getAuth() {
  const key = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  return new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

export interface SheetUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role: string;
  createdAt: string;
}

/**
 * Find a user by email in the Google Sheet.
 */
export async function findUserByEmail(email: string): Promise<SheetUser | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: USERS_ALL_RANGE,
  });
  const rows = res.data.values || [];
  for (const row of rows) {
    if (row[2]?.toLowerCase() === email.toLowerCase()) {
      return {
        id: row[0],
        name: row[1],
        email: row[2],
        passwordHash: row[3],
        phone: row[4] || '',
        role: row[5] || 'customer',
        createdAt: row[6],
      };
    }
  }
  return null;
}

/**
 * Find a user by ID.
 */
export async function findUserById(id: string): Promise<SheetUser | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: USERS_ALL_RANGE,
  });
  const rows = res.data.values || [];
  for (const row of rows) {
    if (row[0] === id) {
      return {
        id: row[0],
        name: row[1],
        email: row[2],
        passwordHash: row[3],
        phone: row[4] || '',
        role: row[5] || 'customer',
        createdAt: row[6],
      };
    }
  }
  return null;
}

/**
 * Insert a new user into the Google Sheet.
 * Returns the inserted user with the generated ID.
 */
export async function insertUser(user: {
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  role?: string;
}): Promise<SheetUser> {
  const sheets = getSheets();

  // Get the current last row to determine next ID
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: USERS_ALL_RANGE,
  });
  const rows = res.data.values || [];
  const nextId = String(rows.length + 1);

  const now = new Date().toISOString();
  const newRow = [
    nextId,
    user.name,
    user.email.toLowerCase(),
    user.passwordHash,
    user.phone || '',
    user.role || 'customer',
    now,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: USERS_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [newRow] },
  });

  return {
    id: nextId,
    name: user.name,
    email: user.email.toLowerCase(),
    passwordHash: user.passwordHash,
    phone: user.phone || '',
    role: user.role || 'customer',
    createdAt: now,
  };
}

export interface SheetOrder {
  orderId: string;
  userEmail: string;
  customerName: string;
  itemsJson: string; // JSON string of cart items
  totalAmount: string;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
}

export async function insertOrder(order: {
  userEmail: string;
  customerName: string;
  items: { productId: string; title: string; price: number; quantity: number }[];
  totalAmount: number;
  phone: string;
  address: string;
}): Promise<SheetOrder> {
  const sheets = getSheets();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: ORDERS_ALL_RANGE,
  });
  const rows = res.data.values || [];
  const orderId = `ORD-${Date.now()}-${rows.length + 1}`;

  const now = new Date().toISOString();
  const newRow = [
    orderId,
    order.userEmail,
    order.customerName,
    JSON.stringify(order.items),
    String(order.totalAmount),
    order.phone,
    order.address,
    'pending',
    now,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: ORDERS_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [newRow] },
  });

  return {
    orderId,
    userEmail: order.userEmail,
    customerName: order.customerName,
    itemsJson: JSON.stringify(order.items),
    totalAmount: String(order.totalAmount),
    phone: order.phone,
    address: order.address,
    status: 'pending',
    createdAt: now,
  };
}

export async function getOrdersByEmail(email: string): Promise<SheetOrder[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: ORDERS_ALL_RANGE,
  });
  const rows = res.data.values || [];
  return rows
    .filter(row => row[1]?.toLowerCase() === email.toLowerCase())
    .map(row => ({
      orderId: row[0],
      userEmail: row[1],
      customerName: row[2],
      itemsJson: row[3],
      totalAmount: row[4],
      phone: row[5] || '',
      address: row[6] || '',
      status: row[7] || 'pending',
      createdAt: row[8],
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
