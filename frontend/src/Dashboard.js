import axios from "axios";
import { useEffect,useState } from "react";
import BASE_URL from "./api";

function Dashboard(){
  const [data,setData]=useState([]);

  useEffect(()=>{
    const token=localStorage.getItem("token");

    if(!token){
      window.location="/login";
      return;
    }

    axios.get(`${BASE_URL}/api/expenses`,{
      headers:{token}
    }).then(res=>setData(res.data));

  },[]);

  const add=async()=>{
    const token=localStorage.getItem("token");

    await axios.post(`${BASE_URL}/api/expense`,{
      title:"Food",
      amount:100,
      category:"Food"
    },{
      headers:{token}
    });

    window.location.reload();
  };

  const logout=()=>{
    localStorage.removeItem("token");
    window.location="/login";
  };

  return(
    <div className="container">
      <h2>Dashboard</h2>

      <button onClick={add}>Add Expense</button>
      <button onClick={logout}>Logout</button>

      {data.map((e,i)=>(
  <p key={i}>
    {e.title} - ₹{e.amount} ({e.category})
  </p>
))}
    </div>
  );
}

export default Dashboard;