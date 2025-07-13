import {
  createBrowserRouter,
} from "react-router";
import App from '../App.tsx'
import Feature from '../pages/Features.tsx'
import Login from '../pages/Login.tsx'
import SignIn from "../pages/SignIn.tsx";
import AddTask from '../pages/AddTask.tsx'
import MyTask from "../pages/MyTask.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/features",
    Component : Feature,
  },
    {
    path: "/login",
    Component : Login,
  },
  {
    path : "/signIn",
    Component : SignIn
  },
  {
    path: "/addTask",
    Component : AddTask
  },
    {
    path: "/myTasks",
    Component : MyTask
  }

]);

export default router