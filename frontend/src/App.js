// import React, { useState } from "react";
// import LandingPage from "./LandingPage";
// import Chat from "./Chat_tempa";
// import "./App.css";

// function App() {
//   const [userName, setUserName] = useState("");
//   const [started, setStarted] = useState(false);

//   return (
//     <div className="App">
//       {!started ? (
//         <LandingPage
//           userName={userName}
//           setUserName={setUserName}
//           onStart={() => setStarted(true)}
//         />
//       ) : (
//         <Chat userName={userName} />
//       )}
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import Chat from "./Chat_tempa"; // Ensure this matches your filename
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Stores { id, username, token }
  const [loading, setLoading] = useState(true);

  // --- AUTO-LOGIN LOGIC ---
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUserId = localStorage.getItem("userId");
    const savedUserName = localStorage.getItem("userName");

    if (savedToken && savedUserId && savedUserName) {
      setUser({
        id: savedUserId,
        username: savedUserName,
        token: savedToken,
      });
    }
    setLoading(false);
  }, []);

  // --- HANDLERS ---
  const handleLoginSuccess = (username, userId) => {
    const token = localStorage.getItem("token");
    setUser({ id: userId, username: username, token: token });
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) return null; // Prevents "flicker" while checking localStorage

  return (
    <div className="App">
      {!user ? (
        <LandingPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Chat user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;