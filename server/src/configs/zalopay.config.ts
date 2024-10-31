import axios from 'axios'
import crypto from 'crypto'

export const config = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: process.env.ZALOPAY_ENDPOINT,
}

export const generateChecksum = (data: any, key: any) => {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(data)
    return hmac.digest('hex')
}
