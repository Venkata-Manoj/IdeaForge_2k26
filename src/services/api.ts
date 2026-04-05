import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Axios instance with credentials for cookies
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface GenerateCertificateResponse {
  success: boolean;
  certificateId?: string;
  error?: string;
}

export const generateCertificate = async (
  username: string,
  name: string,
  eventType: string
): Promise<GenerateCertificateResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/generate-certificate`,
      { username, name, eventType },
      { responseType: 'blob' }
    );

    if (response.status === 200) {
      const certificateId = response.headers['x-certificate-id'];
      return { success: true, certificateId };
    }

    return { success: false, error: 'Failed to generate certificate' };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data;
      if (error.response.status === 409) {
        return { success: false, error: data.error || 'Certificate already generated' };
      }
      if (error.response.status === 404) {
        return { success: false, error: data.error || 'Username not found' };
      }
      return { success: false, error: data.error || 'An error occurred' };
    }
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export interface ValidateUsernameResponse {
  valid: boolean;
  error?: string;
  message?: string;
}

export const validateUsername = async (username: string): Promise<ValidateUsernameResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/validate-username`,
      { username }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return { valid: false, error: 'Network error. Please try again.' };
  }
};

// Admin API Functions

export interface AdminLoginResponse {
  success: boolean;
  expiresIn?: string;
  error?: string;
}

export const adminLogin = async (password: string): Promise<AdminLoginResponse> => {
  try {
    const response = await apiClient.post('/api/admin/login', { password });
    if (response.status === 200) {
      return { success: true, expiresIn: response.data.expiresIn };
    }
    return { success: false, error: 'Login failed' };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, error: error.response.data.error || 'Invalid credentials' };
    }
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export interface AdminStats {
  totalUsernames: number;
  certificatesGenerated: number;
  remaining: number;
  generationRate: string;
  recentGenerations?: Array<{
    username: string;
    name: string;
    eventType: string;
    time: string;
  }>;
}

export const getAdminStats = async (): Promise<AdminStats | null> => {
  try {
    const response = await apiClient.get('/api/admin/stats');
    return response.data;
  } catch {
    return null;
  }
};

export interface Username {
  username: string;
  isGenerated: boolean;
  createdAt: string;
}

export interface UsernamesResponse {
  usernames: Username[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getUsernames = async (page = 1, limit = 100, sortBy = 'createdAt', order = 'desc', search = ''): Promise<UsernamesResponse | null> => {
  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await apiClient.get(`/api/admin/usernames?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}${searchParam}`);
    return response.data;
  } catch {
    return null;
  }
};

export const addUsername = async (username: string): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await apiClient.post('/api/admin/add', { username });
    return { success: true, message: response.data.message };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, error: error.response.data.error || 'Failed to add username' };
    }
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const uploadCSV = async (file: File): Promise<{ added: number; skipped: number; errors: string[] } | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch {
    return null;
  }
};

export const deleteUsername = async (username: string): Promise<boolean> => {
  try {
    await apiClient.delete('/api/admin/delete', { data: { username } });
    return true;
  } catch {
    return false;
  }
};

export const resetUsername = async (username: string): Promise<boolean> => {
  try {
    await apiClient.post('/api/admin/reset', { username });
    return true;
  } catch {
    return false;
  }
};

export const updateUsername = async (oldUsername: string, newUsername: string): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await apiClient.put('/api/admin/update', { oldUsername, newUsername });
    return { success: true, message: response.data.message };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, error: error.response.data.error || 'Failed to update username' };
    }
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export interface UserDetails {
  username: string;
  isGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  certificate: {
    certificateId: string;
    participantName: string;
    eventType: string;
    generatedAt: string;
    ipAddress: string;
  } | null;
}

export const getUserDetails = async (username: string): Promise<UserDetails | null> => {
  try {
    const response = await apiClient.get(`/api/admin/details?username=${encodeURIComponent(username)}`);
    return response.data;
  } catch {
    return null;
  }
};

export const downloadUsernamesCSV = async (): Promise<void> => {
  try {
    const response = await apiClient.get('/api/admin/download-csv', {
      responseType: 'blob',
    });
    
    // Create download link
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ideaforge_usernames_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download CSV file');
  }
};