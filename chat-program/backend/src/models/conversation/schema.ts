import { Schema, Types } from 'mongoose';

interface ConversationSchemaInterface {
	participants: Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const ConversationSchema = new Schema<ConversationSchemaInterface>({
	participants: {
		type: [Schema.Types.ObjectId],
		ref: 'Users',
		required: true,
		validate: {
			validator: (v: Types.ObjectId[]) => v.length === 2,
			message: 'A conversation must have exactly two participants',
		},
	},
},
{
	timestamps: true,
});

export default ConversationSchema;
