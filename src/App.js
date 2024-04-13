import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import { useSelector } from "react-redux";
import Chat from "./pages/Chat/Chat";

function App() {
  const user = useSelector((state) => state.authReducer.authData);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/chat" : "/auth"} />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/chat" /> : <Auth />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Something went wrong. There is nothing to display here!</p>
            </main>
          }
        />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/auth" />} />
      </Routes>
    </div>
  );
}

export default App;
