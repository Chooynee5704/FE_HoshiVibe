import { api } from './axios';

export interface CustomDesign {
  customDesign_Id: string;
  user_Id?: string;
  name: string;
  description?: string;
  price: number;
  rawImageBase64?: string;
  aiImageUrl?: string;
  createdDate: string;
  charmIds?: string[];
}

export interface CreateCustomDesignRequest {
  user_Id?: string;
  name: string;
  description?: string;
  price?: number;
  rawImageBase64?: string;
  aiImageUrl?: string;
  charmIds?: string[];
  createdDate?: string;
}

export interface UpdateCustomDesignRequest extends CreateCustomDesignRequest {}

const customDesignAPI = {
  async getAllCustomDesigns(): Promise<CustomDesign[]> {
    const response = await api.get('/CustomDesign');
    return response.data;
  },

  async getCustomDesignById(id: string): Promise<CustomDesign> {
    const response = await api.get(`/CustomDesign/${id}`);
    return response.data;
  },

  async getCustomDesignsByUserId(userId: string): Promise<CustomDesign[]> {
    const response = await api.get(`/CustomDesign/user/${userId}`);
    return response.data;
  },

  async createCustomDesign(data: CreateCustomDesignRequest): Promise<CustomDesign> {
    const response = await api.post('/CustomDesign', data);
    return response.data;
  },

  async updateCustomDesign(id: string, data: UpdateCustomDesignRequest): Promise<void> {
    await api.put(`/CustomDesign/${id}`, data);
  },

  async deleteCustomDesign(id: string): Promise<void> {
    await api.delete(`/CustomDesign/${id}`);
  },
};

export default customDesignAPI;
