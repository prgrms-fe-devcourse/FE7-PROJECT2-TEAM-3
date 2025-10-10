import { Navigate, Route, Routes } from "react-router";
import Constellation from "./pages/main/Constellation";
import Default from "./components/Default";
import Sample from "./pages/main/Sample";
import Home from "./components/Home";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<Constellation />} />
        </Route>
        <Route element={<Default />}>
          {/* <Route path="/home" element={<Constellation />} /> */}
          <Route path="/channel" element={<Sample />} />
        </Route>
      </Routes>
    </>
  );
}
