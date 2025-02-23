import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setRole, setToken, setUser } from "../features/auth/authSlice";
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const inputChangeHandler = (id, value) => {
    if (id === "email") {
      setEmail(value);
      setEmailError(validateEmail(value) ? "" : "Invalid email format. Must contain '@' and a domain, and end with a valid domain like .com, .net, .org, etc.");
    } else if (id === "password") {
      setPassword(value);
      setPasswordError(
        validatePassword(value)
          ? ""
          : "Password must be at least 8 characters long, contain at least one number and one special character"
      );
    }
  };

  const loginHandler = async () => {
    if (!validateEmail(email)) {
      setEmailError("Invalid email format. Must contain '@' and a domain, and end with a valid domain like .com.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one number and one special character"
      );
      return;
    }

    await axios
      .post("http://localhost:8081/auth/signin", {
        email,
        password,
      })
      .then(async (res) => {
        const { jwt } = res.data;
        try {
          const [, payloadBase64] = jwt.split(".");
          const payloadJson = atob(payloadBase64);
          const payload = JSON.parse(payloadJson);
          localStorage.setItem("auth", payload.authorities);
          dispatch(setRole(payload.authorities));

          if (res.data.message === "SignIn Successfull" && res.status === 201) {
            const result = await axios.get(
              "http://localhost:8081/api/users/profile",
              {
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              }
            );
            localStorage.setItem(
              "user",
              result.data.firstName + " " + result.data.lastName
            );
            dispatch(
              setUser(result.data.firstName + " " + result.data.lastName)
            );
            localStorage.setItem("token", jwt);
            dispatch(setToken(jwt));
            toast.success("Login Success");
            navigate("/");
          } else {
            toast.error("Unauthorized Access");
          }
        } catch (error) {
          console.error("Error decoding JWT:", error);
          toast.error("Invalid Username or Password");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Server Error");
      });
  };

  return (
    <main className="w-full h-[80vh] md:h-[65vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600 space-y-5">
        <div className="text-center pb-8">
          <div className="mt-5">
            <h3 className="text-gray-800 text-3xl font-bold">Login</h3>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => inputChangeHandler("email", e.target.value)}
          />
          {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => inputChangeHandler("password", e.target.value)}
            passwordVisible={passwordVisible}
            toggleVisibility={() => setPasswordVisible(!passwordVisible)}
          />
          {passwordError && (
            <p className="text-red-600 text-sm">{passwordError}</p>
          )}
          <div className="flex items-center justify-end text-sm">
            <Link
              to="/Forgot-Password"
              className="text-center text-red-600 hover:text-red-500"
            >
              Forgot password?
            </Link>
          </div>
          <button
            onClick={loginHandler}
            className="w-full px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-600 rounded-lg duration-150"
          >
            Login
          </button>
        </form>
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
            Sign up
          </Link>
        </p>
      </div>
      <div>
      <Link to="/admin" className="font-medium text-red-600 hover:text-red-500">
            Seller login
      </Link>
      </div>
    </main>
  );
}

export default Login;