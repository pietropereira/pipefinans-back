import {UserController} from "./controller/UserController";
import { CategoryController } from "./controller/CategoryController";
import { EntryController } from "./controller/EntryController";

export const Routes = [
    
    { method: "get", route: "/users", controller: UserController, action: "all"}, 
    { method: "get", route: "/users/:id", controller: UserController, action: "one"}, 
    { method: "post", route: "/users", controller: UserController, action: "save"}, 
    { method: "post", route: "/users/create", controller: UserController, action: "createUser"}, 
    { method: "post", route: "/users/auth", controller: UserController, action: "auth"},
    { method: "get", route: "/users/checkemail", controller: UserController, action: "checkEmail"}, 
    { method: "post", route: "/users/changepassword", controller: UserController, action: "changePassword"},
    { method: "post", route: "/users/forgotpassword", controller: UserController, action: "forgotPassword"},
    { method: "delete", route: "/users/:id", controller: UserController, action: "remove"},

    { method: "get", route: "/category", controller: CategoryController, action: "all"}, 
    { method: "get", route: "/category/:id", controller: CategoryController, action: "one"},
    { method: "post", route: "/category", controller: CategoryController, action: "save"},  
    { method: "delete", route: "/category/:id", controller: CategoryController, action: "remove"},

    { method: "get", route: "/entry", controller: EntryController, action: "getAll"}, 
    { method: "get", route: "/entry/:id", controller: EntryController, action: "one"},
    { method: "post", route: "/entry", controller: EntryController, action: "save"},  
    { method: "delete", route: "/entry/:id", controller: EntryController, action: "remove"},
];