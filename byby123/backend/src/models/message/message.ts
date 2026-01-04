import { model } from 'mongoose';
import MessageSchema from './schema';

const Message = model('Message', MessageSchema);

export default Message;