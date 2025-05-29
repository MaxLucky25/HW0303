import {Model, model, Schema, Document, Types} from "mongoose";

export type BlogDBType = {
    _id: Types.ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

export type BlogViewModel = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

export type BlogDto = Pick<BlogDBType, 'name' | 'description' | 'websiteUrl'>;

interface IBlogDocument extends Document<Types.ObjectId> {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
    toViewModel(): BlogViewModel;
}

interface IBlogModelStatic extends Model<IBlogDocument> {
    createBlog(data:{
        name: string;
        description: string;
        websiteUrl: string;
    }): Promise<IBlogDocument>
}

const BlogSchema = new Schema<IBlogDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date, required: true, default: new Date },
    isMembership: { type: Boolean, required: true },
});

BlogSchema.methods.toViewModel = function (): BlogViewModel {
    return {
        id: this._id.toString(),
        name: this.name,
        description: this.description,
        websiteUrl: this.websiteUrl,
        createdAt: this.createdAt,
        isMembership: this.isMembership,
    };
};

BlogSchema.statics.createBlog = function ({name, description, websiteUrl})
    :Promise<IBlogDocument>{
    const blog = new this({
        name,
        description,
        websiteUrl,
        createdAt: new Date(),
        isMembership: false,
    });
    return blog.save();
};

export const BlogModel = model<IBlogDocument, IBlogModelStatic>('Blog', BlogSchema);