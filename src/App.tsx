import { Navigate, Route, Routes } from "react-router";
import Constellation from "./pages/main/Constellation";
import Default from "./components/Default";
import Home from "./components/Home";
import DetailPost from "./pages/posts/DetailPost";
import PostsList from "./pages/posts/PostsList";
import PostCreatePage from "./pages/posts/PostCreatePage";
import Login from "./pages/login/Login";
import NotFound from "./pages/NotFound";
import UserSetting from "./pages/login/UserSetting";
import MyPage from "./pages/MyPage";
import PostSearch from "./pages/search/PostSearch";
import UserSearch from "./pages/search/UserSearch";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="/home" element={<Constellation />} />
        </Route>
        <Route element={<Default />}>
          <Route
            path="/channel"
            element={<Navigate to="/channel/all" replace />}
          />
          <Route path="/channel/:channel" element={<PostsList />} />
          <Route path="/posts/:postId" element={<DetailPost />} />
          <Route path="/channel/all" element={<PostsList />} />
          {/* 테스트 하고 아래 코드 지우기 */}
          <Route path="/channel/:channel/write" element={<PostCreatePage />} />
          <Route path="/channel/write" element={<PostCreatePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userSetting" element={<UserSetting />} />
          <Route path="/myPage" element={<MyPage />} />
          <Route path="/postSearch" element={<PostSearch />} />
          <Route path="/userSearch" element={<UserSearch />} />
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
}
