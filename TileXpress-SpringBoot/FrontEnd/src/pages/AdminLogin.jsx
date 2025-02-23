import axios from "axios";
import React, { useState } from "react";
import logo from "../assets/frontend/img/logo.svg";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setRole, setToken, setUser } from "../features/auth/authSlice";

function AdminLogin() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
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
    if (id === "username") {
      setUsername(value);
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
    if (!validateEmail(username)) {
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
        email: username,
        password,
      })
      .then(async (res) => {
        const { jwt } = res.data;
        // Decode JWT token to extract email & authorities
        try {
          const [, payloadBase64] = jwt.split(".");
          const payloadJson = atob(payloadBase64);
          const payload = JSON.parse(payloadJson);
          console.log("Authorities:", payload.authorities);
          localStorage.setItem("auth", payload.authorities);
          dispatch(setRole(payload.authorities));

          if (
            res.data.message === "SignIn Successfull" &&
            res.status === 201 &&
            (payload.authorities === "ADMIN,USER" || payload.authorities === "SELLER,USER")
          ) {
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
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600 space-y-5">
        <div className="text-center pb-8">
          <img src={logo} width={150} className="mx-auto" alt="Logo" />
          <div className="mt-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Admin & Seller Login
            </h3>
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              required
              onChange={(e) => inputChangeHandler("username", e.target.value)}
              value={username}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg"
            />
            {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
          </div>
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              required
              onChange={(e) => inputChangeHandler("password", e.target.value)}
              value={password}
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg"
            />
            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
          </div>
          <button
            onClick={loginHandler}
            className="w-full px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-500 active:bg-red-600 rounded-lg duration-150"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminLogin;