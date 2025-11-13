export const supabase = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resend: jest.fn(),
  },
  from: jest.fn((tableName) => {
    const mockChain = {
      select: jest.fn(),
      eq: jest.fn(),
      insert: jest.fn(),
      single: jest.fn(),
    };
    mockChain.select.mockReturnValue(mockChain);
    mockChain.eq.mockReturnValue(mockChain);
    mockChain.insert.mockReturnValue(mockChain);
    mockChain.single.mockReturnValue(mockChain);
    return mockChain;
  }),
};
