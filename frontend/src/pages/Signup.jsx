import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(API + "/auth/register",
        { name, email, password });
      setMessage(res.data.message);
    } catch (err) {
      if (err.response) setMessage(err.response.data.message);
      else setMessage("Server not reachable");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name}
        onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
}

export default Signup;
