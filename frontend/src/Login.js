import axios from "axios";
import { useState } from "react";
import BASE_URL from "./api";

function Login(){
  const [form,setForm]=useState({});

  const login=async()=>{
    try{
      const res=await axios.post(`${BASE_URL}/api/login`,form);

      localStorage.setItem("token",res.data.token);

      alert("Login Success");
      window.location="/dashboard";

    }catch(err){
      alert(err.response?.data || "Login Failed");
    }
  };

  return(
    <div className="container">
      <h2>Login</h2>

      <input placeholder="Email"
        onChange={e=>setForm({...form,email:e.target.value})}/>

      <input type="password" placeholder="Password"
        onChange={e=>setForm({...form,password:e.target.value})}/>

      <button onClick={login}>Login</button>
    </div>
  );
}

export default Login;