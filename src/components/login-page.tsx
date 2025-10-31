"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulasi login
    setTimeout(() => {
      console.log("Login attempt:", { username, password })
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Section - Laptop Image */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Laptop Container */}
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-blue-500/30">
                {/* Laptop Screen */}
                <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-2xl p-4 mb-4 aspect-video flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-white opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>

                {/* Laptop Keyboard */}
                <div className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl p-3 space-y-2">
                  <div className="grid grid-cols-12 gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="bg-slate-600 rounded h-2 border border-slate-500"></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="bg-slate-600 rounded h-2 border border-slate-500"></div>
                    ))}
                  </div>
                </div>

                {/* Laptop Bottom */}
                <div className="mt-4 h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
              </div>

              {/* GitHub Integration Text */}
              <div className="mt-8 text-center">
                <h3 className="text-white text-xl font-bold mb-2">Integrasi GitHub</h3>
                <p className="text-blue-200 text-sm">Kelola Repositori GitHub Anda Dengan Mudah</p>
              </div>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">G</span>
                  </div>
                  <h1 className="text-white text-3xl font-bold">GitRepo Platform</h1>
                </div>
                <p className="text-blue-200 text-sm">Sistem Dokumentasi Riwayat Perubahan</p>
              </div>

              {/* Login Form */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl border border-blue-400/30">
                <h2 className="text-white text-2xl font-bold mb-2">Login User</h2>
                <p className="text-blue-100 text-sm mb-6">Masuk ke akun anda untuk mengakses fitur lengkap</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username Field */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Username</label>
                    <Input
                      type="text"
                      placeholder="Masukkan Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white text-slate-900 placeholder-slate-400 border-0 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Password</label>
                    <Input
                      type="password"
                      placeholder="Masukkan Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white text-slate-900 placeholder-slate-400 border-0 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg border border-blue-300 transition-colors mt-6"
                  >
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </form>

                {/* Footer Links */}
                
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}
