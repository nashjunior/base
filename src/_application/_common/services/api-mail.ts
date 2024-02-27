import { env } from '@/env'
import axios from 'axios'

export const apiMail = axios.create({
  baseURL: env.URL_API_MAIL,
  headers: {
    Authorization: `Bearer ${env.TOKEN_API_MAIL}`,
  },
})
