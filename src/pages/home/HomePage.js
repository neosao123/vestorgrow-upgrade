import Profile from "./Profile";
import Posts from "./Posts";
import ChatsType from "./ChatsType";
function HomePage() {
  return (
    <div className="socialContant socialContant_custom main_container pb-0">
      <div className="socialContantInner">
        <Profile />
        <Posts />
        <ChatsType />
      </div>
    </div>
  );
}
export default HomePage;
