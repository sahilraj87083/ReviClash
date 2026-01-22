import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input, Button } from "../components/index";
import { loginService } from "../services/auth.services";
import { useUserContext } from "../contexts/UserContext";

function Login() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { setAuth } = useUserContext()


  const submitHandler = async (e) => {
    e.preventDefault()

    const userData = {
      email : email,
      password : password
    }
    const response = await loginService(userData)
    // console.log(response)

    // if(response.errorCode === 200){
    setAuth( response.accessToken , response.user)
    navigate('/')
    setEmail("");
    setPassword("");
    // }

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
          stagger: 0.1,
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
            Welcome Back
          </h1>
          <p className="text-slate-300 leading-relaxed">
            Continue your journey on ReviClash.
            Compete, practice, and improve every day.
          </p>

          <ul className="mt-6 space-y-3 text-slate-400 text-sm">
            <li>✔ Resume contests</li>
            <li>✔ Track your stats</li>
            <li>✔ Compete with friends</li>
            <li>✔ Stay consistent</li>
          </ul>
        </div>

        {/* RIGHT (Form) */}
        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold text-white mb-6">
            Login to your account
          </h2>

          <form className="space-y-4"
            onSubmit={submitHandler}
          >
            {/* Inputs group (animated) */}
            <div className="inputs-group space-y-4">
              <Input
                value = {email}
                onChange = {(e) => {setEmail(e.target.value)}}
                label="Email"
                type="text"
                placeholder="Enter email"
                autoComplete="username"
              />

              <Input
                value = {password}
                onChange = {(e) => {setPassword(e.target.value)}}
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* CTA */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-4"
            >
              Login
            </Button>
          </form>

          <p className="text-sm text-slate-400 mt-6 text-center">
            Don’t have an account?{" "}
            <NavLink
              to="/user/register"
              className="text-red-400 hover:text-red-300 font-medium"
            >
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
