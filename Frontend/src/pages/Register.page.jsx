import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input, Button } from "../components";
import { registerService } from "../services/auth.services";

function Register() {
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const navigate = useNavigate()

    const [FullName, setFullName] = useState("")
    const [UserName, setUserName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const submitHandler = async (e) => {
        e.preventDefault();

        const newUser = {
            fullName : FullName,
            username : UserName,
            email : email,
            password : password
        }

        const response = await registerService(newUser)
        console.log(response)

        if(response.status === 201){
            navigate('/user/login')
        }
        setFullName("")
        setEmail("");
        setPassword("");
        setUserName("");
    }


    useGSAP(
      () => {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(
          containerRef.current.querySelectorAll(".inputs-group > *"),
          {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
            delay: 0.2,
          }
        );
      },
      { scope: containerRef }
    );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
      <div
        ref={containerRef}
        className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden shadow-xl"
      >
        {/* LEFT (Branding) */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-slate-900 to-slate-800">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join ReviClash
          </h1>
          <p className="text-slate-300 leading-relaxed">
            Practice smarter.  
            Compete harder.  
            Track real performance.
          </p>

          <ul className="mt-6 space-y-3 text-slate-400 text-sm">
            <li>✔ Create contests from collections</li>
            <li>✔ Compete with friends</li>
            <li>✔ Chat Discussion with friends</li>
            <li>✔ Deep stats & leaderboards</li>
          </ul>
        </div>

        {/* RIGHT (Form) */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Create your account
          </h2>

          <form ref={formRef} className="space-y-4"
            onSubmit={submitHandler}
          >
            {/* Inputs wrapper */}
            <div className="space-y-4 inputs-group">
              <Input 
                value = {FullName}
                onChange = {(e) => {setFullName(e.target.value)}}
                label="Full Name" type="text" placeholder="Enter full name" 
              />
              <Input 
                value = {UserName}
                onChange = {(e) => {setUserName(e.target.value)}}
                label="Username" type="text" placeholder="Enter username" 
              />
              <Input 
                value = {email}
                onChange = {(e) => {setEmail(e.target.value)}}
                label="Email" type="email" placeholder="abc@gmail.com" 
              />
              <Input 
                value = {password}
                onChange = {(e) => {setPassword(e.target.value)}}
                label="Password" type="password" placeholder="••••••••" 
              />
              {/* <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
              /> */}
            </div>

            {/* Button OUTSIDE animation group */}
            <Button 
              type="submit"
              variant="primary" className="w-full mt-4">
              Sign Up
            </Button>
          </form>


          <p className="text-sm text-slate-400 mt-6 text-center">
            Already have an account?{" "}
            <NavLink
              to="/user/login"
              className="text-red-400 hover:text-red-300 font-medium"
            >
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}


export default Register;
