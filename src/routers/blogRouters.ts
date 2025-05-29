import { Router } from 'express';
import {blogValidators} from '../validators/blogValidators';
import { authBasicMiddleware } from '../middlewares/authBasicMiddleware';
import { inputCheckErrorsMiddleware } from '../middlewares/inputCheckErrorMiddleware';
import {postForSpecificBlogValidators} from "../validators/postForSpecificBlogValidators";
import TYPES from "../di/types";
import {BlogController} from "../controllers/blogController";
import container from "../di/iosContaner";

const controller = container.get<BlogController>(TYPES.BlogController);
export const blogsRouter = Router();

blogsRouter.get('/', controller.getAllBlogs);

blogsRouter.get('/:id', controller.getBlogById);

blogsRouter.post('/',
    authBasicMiddleware,
    ...blogValidators,
    inputCheckErrorsMiddleware,
    controller.createBlog
);

blogsRouter.put('/:id',
    authBasicMiddleware,
    ...blogValidators,
    inputCheckErrorsMiddleware,
    controller.updateBlog
);

blogsRouter.delete('/:id',
    authBasicMiddleware,
    controller.deleteBlog
);

blogsRouter.get('/:id/posts', controller.getPostsForBlog);


blogsRouter.post('/:id/posts',
    authBasicMiddleware,
    ...postForSpecificBlogValidators,
    inputCheckErrorsMiddleware,
    controller.createPostsForBlog
);