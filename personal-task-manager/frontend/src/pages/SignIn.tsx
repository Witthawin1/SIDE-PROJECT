import { Link } from 'react-router-dom'
import Header from '../components/header.tsx'
import Input from '../components/input.tsx'
function SignIn(){
    return (
        <>
        <Header></Header>
        <div className='flex flex-col p-4'>
            <h2 className='font-bold text-3xl'>Create your account</h2>
            <Input label="Username" 
            placeHolder="Enter your username" type="text"></Input>
            <Input label="Email" 
            placeHolder="Enter your Email" type="password"></Input>
            <Input label="Password" 
            placeHolder="Enter your password" type="text"></Input>
            <Input label="Confirm Password" 
            placeHolder="Confirm your password" type="password"></Input>
            <button className='w-[60%] h-12 my-4 rounded-md bg-black text-white font-bold'>Register</button>
            <Link to="/login" className='text-gray-400 underline'>Don't have an account Login here</Link>
        </div>
        </>
    )
}

export default SignIn