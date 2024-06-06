import { useState  } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";


export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const [seePassword, setSeePassword] = useState(false)
    
    const navigate = useNavigate()

    const {id, token} = useParams()

    axios.defaults.withCredentials = true;
    const handleClick =async(e)=>{
        e.preventDefault();
        if (password === ''){
            setErr("Please fill email field");
            const errorTime = setTimeout(()=>{
                setErr('')
            },3000)
            return ()=>clearTimeout(errorTime);
        }else{
                const res = await axios.post(`http://localhost:8000/api/auth/reset_password/${id}/${token}`,{password})
                if (res.data.Status === "Success") {
                    navigate('/login');
                }
                else if (res.data.Status === 'Error with Token') {
                    setErr('Your Session has timed out, Please Try Again Later');
                    const errorTime = setTimeout(()=>{
                        setErr('')
                        navigate('/login')
                    },3000)
                    return ()=>clearTimeout(errorTime);
                }
                else{
                    setErr('something went wrong, please try again later');
                    const errorTime = setTimeout(()=>{
                        setErr('')
                    },3000)
                    return ()=>clearTimeout(errorTime);
                }
        }
    }
    
    return (
        <div className='flex justify-center items-center w-full h-[100vh] bg-gray-300 bg-[url("https://digital.ihg.com/is/image/ihg/ihgor-member-rate-web-offers-1440x720")] bg-cover'>
            <form className='relative flex flex-col min-w-[400px] min-h-[400px]  items-start bg-white shadow-gray-800 gap-10 p-5 rounded-md'>
                <h2 className='text-black text-3xl'>Reset Password</h2>
                <div className='relative flex flex-col w-[250px] pt-4 gap-[2px]'> 
                    <label htmlFor="password" className='ml-1'>New Password</label>
                    <input type={seePassword ? "text" : "password"} name="password" id='password' placeholder='Enter Your Password' className=' w-[250px] h-9 border-b-2 border-blue-900 outline-none  indent-[7px]' onChange={(e)=>setPassword(e.target.value)}></input>
                    <FontAwesomeIcon icon={faEye} className='absolute right-0 text-blue-800 bottom-2 cursor-pointer hover:scale-110' onClick={()=>setSeePassword(prev=>!prev)}/>
                </div>
                {err && <span className='w-full text-center text-red-500 text-sm mt-[-20px]'>{err}</span>}
                <div className='absolute bottom-[20px] w-[90%] flex justify-around'>
                    <button onClick={()=>(navigate('/login'))} className=' w-50 mt-6 bg-gray-700  text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-gray-500  hover:scale-105'>Back</button>
                    <button onClick={handleClick} className=' w-50 mt-6 bg-green-700  text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-green-500 hover:scale-105'>Reset</button>
                </div>
            </form>
        </div>
  )
}

