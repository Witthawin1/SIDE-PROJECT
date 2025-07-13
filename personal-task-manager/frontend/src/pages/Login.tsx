import { Link } from "react-router-dom";
import Header from "../components/header";
import Input from "../components/input";

function Login() {
  return (
    <>
      <Header></Header>
      <div className="flex flex-col p-6">
        <h1 className="font-bold text-3xl">Welcome back</h1>
        <Input
          label="Username or Email"
          placeHolder="Enter your username or email"
          type="text"
        ></Input>
        <Input
          label="Password"
          placeHolder="Enter your password"
          type="password"
        ></Input>
        <a className="text-gray-400 underline">Forgot Password?</a>
        <button className="w-[60%] h-12 my-4 ml-4 rounded-md bg-black text-white font-bold">
          Login
        </button>
        <Link to="/signIn" className="text-gray-400 underline">
          Don't have an account Register here
        </Link>
      </div>
    </>
  );
}

export default Login;
