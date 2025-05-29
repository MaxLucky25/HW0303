import {Container} from "inversify";
import TYPES from "./types";
import {BlogController} from "../controllers/blogController";
import {BlogService} from "../services/blogService";
import {UserService} from "../services/userService";
import {UserController} from "../controllers/userController";
import {BlogRepository} from "../repositories/blogRepository";
import {BlogQueryRepository} from "../queryRepo/blogQueryRepository";
import {UserRepository} from "../repositories/userRepository";
import {UserQueryRepository} from "../queryRepo/userQueryRepository";
import {PostRepository} from "../repositories/postRepository";
import {PostQueryRepository} from "../queryRepo/postQueryRepository";
import {PostService} from "../services/postService";
import {PostController} from "../controllers/postController";
import {CommentController} from "../controllers/commentController";
import { CommentRepository } from "../repositories/commentRepository";
import {CommentService} from "../services/commentService";
import {BcryptService} from "../utility/bcryptService";
import {EmailService} from "../utility/emailService";
import {JwtService} from "../utility/jwtService";
import {SessionRepository} from "../repositories/sessionRepository";
import {AuthService} from "../services/authService";
import {AuthController} from "../controllers/authController";
import {SecurityController} from "../controllers/securityController";
import { CommentQueryRepository } from "../queryRepo/commentQueryRepository";



const container = new Container();

container.bind<BlogController>(TYPES.BlogController).to(BlogController);
container.bind<BlogService>(TYPES.BlogService).to(BlogService);
container.bind<BlogRepository>(TYPES.BlogRepository).to(BlogRepository);
container.bind<BlogQueryRepository>(TYPES.BlogQueryRepository).to(BlogQueryRepository);

container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserQueryRepository>(TYPES.UserQueryRepository).to(UserQueryRepository);

container.bind<PostRepository>(TYPES.PostRepository).to(PostRepository)
container.bind<PostQueryRepository>(TYPES.PostQueryRepository).to(PostQueryRepository);
container.bind<PostService>(TYPES.PostService).to(PostService);
container.bind<PostController>(TYPES.PostController).to(PostController);

container.bind<CommentController>(TYPES.CommentController).to(CommentController);
container.bind<CommentRepository>(TYPES.CommentRepository).to(CommentRepository);
container.bind<CommentQueryRepository>(TYPES.CommentQueryRepository).to(CommentQueryRepository);
container.bind<CommentService>(TYPES.CommentService).to(CommentService);

container.bind<BcryptService>(TYPES.BcryptService).to(BcryptService);

container.bind<EmailService>(TYPES.EmailService).to(EmailService);

container.bind<JwtService>(TYPES.JwtService).to(JwtService);

container.bind<SessionRepository>(TYPES.SessionRepository).to(SessionRepository);
container.bind<SecurityController>(TYPES.SecurityController).to(SecurityController);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);


export default container;