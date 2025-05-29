const TYPES ={
    UserService: Symbol.for("UserService"),
    UserRepository: Symbol.for("UserRepository"),
    UserQueryRepository: Symbol.for("UserQueryRepository"),
    UserController: Symbol.for("UserController"),

    BlogRepository: Symbol.for("BlogRepository"),
    BlogQueryRepository: Symbol.for("BlogQueryRepository"),
    BlogService: Symbol.for("BlogService"),
    BlogController: Symbol.for("BlogController"),

    PostRepository: Symbol.for("PostRepository"),
    PostQueryRepository: Symbol.for("PostQueryRepository"),
    PostService: Symbol.for("PostService"),
    PostController: Symbol.for("PostController"),

    CommentService: Symbol.for("CommentService"),
    CommentRepository: Symbol.for("CommentRepository"),
    CommentQueryRepository: Symbol.for("CommentQueryRepository"),
    CommentController: Symbol.for("CommentController"),

    AuthService: Symbol.for("AuthService"),
    AuthRouter: Symbol.for("AuthRouter"),
    AuthController: Symbol.for("AuthController"),

    SessionRepository: Symbol.for("SessionRepository"),
    SecurityController: Symbol.for("SecurityController"),

    BcryptService: Symbol.for("BcryptService"),

    EmailService: Symbol.for("EmailService"),

    JwtService: Symbol.for("JwtService"),

    AuthValidator: Symbol.for("AuthValidator"),
    PostValidator: Symbol.for("PostValidator"),
    AuthRefreshTokenMiddleware: Symbol.for("AuthRefreshTokenMiddleware"),
};

export default TYPES;