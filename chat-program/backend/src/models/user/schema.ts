import { Schema, model, Types } from 'mongoose';

interface UserSchemaInterface {
	_id: Types.ObjectId;
	username: string;
	password: string;
}

const userSchema = new Schema<UserSchemaInterface>(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

const userModel = model<UserSchemaInterface>('Users', userSchema);

export default userModel;
