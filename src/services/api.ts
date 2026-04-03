import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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