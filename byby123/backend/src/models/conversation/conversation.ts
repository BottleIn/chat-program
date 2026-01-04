import { model } from 'mongoose';
import ConversationSchema from './schema';

const Conversation = model('Conversation', ConversationSchema);

export default Conversation;
