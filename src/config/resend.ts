import { Resend } from 'resend';
import dotenv from 'dotenv'

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY

const resend = new Resend(RESEND_API_KEY);

export default resend;