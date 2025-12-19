
// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import "./Landing.css";

// export default function LandingPage({ onLoginSuccess }) {
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
    
//     const endpoint = isRegistering ? "register" : "token";
    
//     try {
//       const response = await fetch(`http://localhost:8000/${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.detail || "Authentication failed");

//       if (isRegistering) {
//         alert("Account created! Please login.");
//         setIsRegistering(false);
//       } else {
//         localStorage.setItem("token", data.access_token);
//         localStorage.setItem("userId", data.user_id);
//         localStorage.setItem("userName", data.username);
//         onLoginSuccess(data.username, data.user_id);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="landing-container">
//       {/* Background Decorative Blobs */}
//       <div className="blob blob-1"></div>
//       <div className="blob blob-2"></div>

//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="glass-card"
//       >
//         <div className="brand">
//           <motion.span 
//             animate={{ y: [0, -10, 0] }}
//             transition={{ duration: 4, repeat: Infinity }}
//             className="logo-icon"
//           >
//             🌱
//           </motion.span>
//           <h1>MindfulAI</h1>
//           <p>Your gentle space for CBT reflection</p>
//         </div>

//         <form onSubmit={handleSubmit} className="auth-form">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={isRegistering ? "register" : "login"}
//               initial={{ x: 20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: -20, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <input
//                 name="username"
//                 type="text"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={handleInputChange}
//                 required
//               />
//               <input
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//               />
//             </motion.div>
//           </AnimatePresence>

//           {error && <p className="error-text">{error}</p>}

//           <motion.button 
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Processing..." : isRegistering ? "Join Community" : "Start Reflecting"}
//           </motion.button>
//         </form>

//         <p className="toggle-text">
//           {isRegistering ? "Already have an account?" : "New to MindfulAI?"}{" "}
//           <span onClick={() => setIsRegistering(!isRegistering)}>
//             {isRegistering ? "Login here" : "Create one now"}
//           </span>
//         </p>

//         <div className="landing-footer">
//           <small>⚠ Fully private. Encrypted sessions.</small>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Landing.css";

export default function LandingPage({ onLoginSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isRegistering ? "register" : "token";
    
    try {
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Error");

      if (isRegistering) {
        alert("Account created! Please login.");
        setIsRegistering(false);
      } else {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("userName", data.username);
        onLoginSuccess(data.username, data.user_id);
      }
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="hero-container">
      {/* Background Image with Overlay */}
      <div className="hero-bg"></div>
      
      {/* Main Hero Content */}
      <AnimatePresence>
        {!showModal && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="hero-content"
          >
            <motion.h1 
              initial={{ letterSpacing: "2px" }}
              animate={{ letterSpacing: "8px" }}
              transition={{ duration: 2 }}
            >
              MINDFUL AI
            </motion.h1>
            <p>Your sanctuary for thoughts. A private, intelligent space to reflect, grow, and find balance.</p>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#2d5a27" }}
              whileTap={{ scale: 0.9 }}
              className="start-btn"
              onClick={() => setShowModal(true)}
            >
              BEGIN JOURNEY
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login / Signup Dialog Box */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="auth-modal"
            >
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              <h2>{isRegistering ? "Join Sanctuary" : "Welcome Back"}</h2>
              
              <form onSubmit={handleSubmit}>
                <input 
                  type="text" placeholder="Username" required 
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <input 
                  type="password" placeholder="Password" required 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" className="submit-btn">
                  {isRegistering ? "Create Account" : "Enter Space"}
                </button>
              </form>
              
              <p className="switch-text">
                {isRegistering ? "Already a member?" : "New here?"}{" "}
                <span onClick={() => setIsRegistering(!isRegistering)}>
                  {isRegistering ? "Login" : "Sign up"}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}