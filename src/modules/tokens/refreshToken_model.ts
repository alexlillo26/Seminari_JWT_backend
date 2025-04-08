import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
    token: string;
    userId: string;
    expiresAt: Date;
}

const RefreshTokenSchema: Schema = new Schema({
    token: { type: String, required: true },
    userId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);