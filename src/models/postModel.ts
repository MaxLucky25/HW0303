import {Model, model, Schema, Document, Types} from "mongoose";
import {toObjectId} from "../utility/toObjectId";

export type PostDBType = {
    _id: Types.ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: Types.ObjectId;
    blogName: string;
    createdAt: Date;
};

export type PostViewModel = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
};

export type PostDto = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type inputPostDto = {
    title: string;
    shortDescription: string;
    content: string;
}

interface IPostDocument extends Document<Types.ObjectId> {
    title: string;
    shortDescription: string;
    content: string;
    blogId: Types.ObjectId;
    blogName: string;
    createdAt: Date;
    toViewModel(): PostViewModel;
}

interface IPostModelStatic extends Model<IPostDocument> {
    createPost(data:{
        title: string;
        shortDescription: string;
        content: string;
        blogId: string;
        blogName: string;
    }): Promise<IPostDocument>;
}

const PostSchema = new Schema<IPostDocument>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: Schema.Types.ObjectId, required: true, ref: 'Blog' },
    blogName: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
});

PostSchema.methods.toViewModel = function () :PostViewModel {
    return {
        id: this._id.toString(),
        title: this.title,
        shortDescription: this.shortDescription,
        content: this.content,
        blogId: this.blogId.toString(),
        blogName: this.blogName,
        createdAt: this.createdAt,
    };
};

PostSchema.statics.createPost = function
({title, shortDescription, content, blogId, blogName})
    :Promise<IPostDocument> {
    const post = new this({
        title,
        shortDescription,
        content,
        blogId: toObjectId(blogId),
        blogName,
        createdAt: new Date(),
    });
    return post.save();
}

export const PostModel = model<IPostDocument, IPostModelStatic>('Post', PostSchema);

