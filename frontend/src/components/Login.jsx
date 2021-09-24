import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login ({setShowLogin, myStorage, setCurrentUser}) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit =  async (e) =>{
      e.preventDefault();

      console.log(usernameRef);
      console.log(passwordRef);
      const user = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      }
      try {
          const res  = await axios.post('/user/login', user);
          myStorage.setItem("user", res.data.username);
          setCurrentUser(res.data.username);
          setShowLogin(false);
          setError(false);
      } catch (error) {
          console.log(error);
          setError(true);
      }
  }
 
  return (
    <div className="loginContainer">
      <div className="logo" style={{color: "teal"}}>
        <Room style={{color: "teal"}} />  by Ng_xcv
      </div>
      <form onSubmit={handleSubmit}>
        <input placeholder="username" ref= {usernameRef} />
        <input type="password" min="6" placeholder="password" ref= {passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <Cancel
        className="loginCancel"
        onClick={()=>setShowLogin(false)}
      />
    </div>
  );
}