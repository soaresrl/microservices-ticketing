import mongoose from 'mongoose';
import { Password } from '../services/password';

// This interface was created to define User parameters
interface UserAttrs {
    email: string;
    password: string;
}

// This interface was created so TypeScript stop
// complaining about User.build(attrs)
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            /**
             *
             * Transform the object returned to:
             * {
             *      id: the id
             *      email: user@email.com
             * }
             */
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));

        this.set('password', hashed);
    }

    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

/** This pattern is used so TypeScript can check the parameters */
/* const buildUser = (attrs: UserAttrs) => {
    return new User(attrs);
}; */

export { User };
