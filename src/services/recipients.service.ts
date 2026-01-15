import { apiClient } from './api'
import { API_PATHS } from '@/constants/api.endpoints'

export interface Recipient {
  id: string
  address: string
  zipCode?: string
  city?: string
  comment?: string
}

export interface CreateRecipientRequest {
  address: string
  zipCode?: string
  city?: string
  comment?: string
}

class RecipientsService {
  async getMyRecipients(): Promise<Recipient[]> {
    const res = await apiClient.get<Recipient[]>(API_PATHS.USERS_ME_RECIPIENTS)
    return res.data
  }

  async createRecipient(payload: CreateRecipientRequest): Promise<Recipient> {
    const res = await apiClient.post<Recipient>(API_PATHS.USERS_ME_RECIPIENTS, payload)
    return res.data
  }
}

export const recipientsService = new RecipientsService()
export default recipientsService
