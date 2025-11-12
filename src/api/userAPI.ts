import { api } from './axios';
import { getToken } from './authApi';

export type UserProfile = {
  user_Id: string;
  email: string;
  account: string;
  role: 'Admin' | 'Customer';
  profile?: {
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    gender?: string;
    avatarUrl?: string;
  };
};

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const token = getToken();
  
  const response = await api.get(`/UserAndProfile/get-user-profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
}

export type UpdateProfileRequest = {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl?: string;
};

export async function updateUserProfile(
  userId: string,
  profileData: UpdateProfileRequest
): Promise<UserProfile> {
  const token = getToken();
  
  const response = await api.put(
    `/UserAndProfile/update-user-profile/${userId}`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
}
