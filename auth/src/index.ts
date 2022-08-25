import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be define');
    }
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI must be define');
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error(error);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!!');
    });
};

start();
