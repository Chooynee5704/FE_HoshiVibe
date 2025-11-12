import axios from 'axios'

const API_URL = 'https://hosivibe-be-production.up.railway.app/api'

export interface Voucher {
  voucher_Id: string
  code: string
  voucherName: string
  discountAmount: number
  useTime: number
  usedCount: number
  startDate: string
  endDate: string
  isActive: boolean
}

export interface ValidateVoucherResponse {
  isValid: boolean
  message: string
  voucher: Voucher | null
}

export const validateVoucher = async (code: string): Promise<ValidateVoucherResponse> => {
  const response = await axios.post(`${API_URL}/Voucher/validate`, { code })
  return response.data
}

export const getAllVouchers = async (): Promise<Voucher[]> => {
  const response = await axios.get(`${API_URL}/Voucher`)
  return response.data
}
