import { api } from './axios';

export interface UserWithProfile {
    user_Id: string;
    email: string;
    account: string;
    role: string;
    isDisabled: boolean;
    profileDTO?: {
    user_Id: string;
    userProfile_Id: string;
    avatarUrl?: string;
    fullName?: string;
    point?: number;
    age?: number;
    yob?: string;              // ISO date: "2001-10-20T00:00:00"
    yobDestination?: string;   // nơi sinh
    zodiac?: string;           // cung
    zodiacUrl?: string;
  };
}

export async function getAllUsersWithProfiles(){
    const response = await api.get<UserWithProfile[]>('/UserAndProfile/get-all-user-informations/');
    return response.data ?? [];
}

export async function getUserWithProfileById(userId: string){
    const response = await api.get<UserWithProfile>(`/UserAndProfile/get-user-profile/${encodeURIComponent(userId)}`);
    const data = response.data;
    return data;

}