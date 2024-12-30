import { useState } from "react";
import {adminLoginLogic} from "../_lib.js"
import { Eye, EyeClosed } from 'lucide-react';
import {Bounce, ToastContainer , toast} from 'react-toastify';
import './style.css'

export default function LoginForm() {

    const {
        handleSubmit,
        setUsername,
        setPassword,
        setShowPassword,
        showPassword,
        username,
        error,

    } = adminLoginLogic();

  

  return (
    <div className="min-h-screen flex items-center justify-center">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-sm" data-v0-t="card">
            <div className="flex flex-col p-6 space-y-1">
            <h3 className="tracking-tight text-2xl font-extrabold text-center text-red-600">Admin Login</h3>
            <p className="text-sm text-muted-foreground">Enter admin username and password to login to admin account</p>
            </div>
            <div className="p-6 pt-0">
                <form action="">
            <div className="space-y-4">
                <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="username"
                >
                    Admin Username
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    id="username"
                    placeholder="admin@"
                    required
                    autoComplete="off"
                    onChange={(e) => setUsername(e.target.value)}
                />
                </div>

                <div className="relative space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 pr-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        required
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-black"
                        aria-label="Toggle password visibility"
                        >
                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeClosed className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <button onClick={handleSubmit} 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                type="submit"
                >
                Login
                </button>
            </div>
              </form>
            </div>
            <ToastContainer
                position="bottom-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                className="toast-center"
                />
        </div>
        
    </div>

  );
}
