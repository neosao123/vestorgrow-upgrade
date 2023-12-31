import Profile from "./Profile";
import Posts from "./Posts";
import ChatsType from "./ChatsType";
import Suggested from "./Suggested";
import "../../assets/Suggested.css";

function HomePage() {
  return (
    <div className="socialContant socialContant_custom main_container pb-0">
      <div className="socialContantInner">
        <Profile />
        <Posts />
        <div className="rightColumn" >
          <div style={{ position: "sticky", top: "98px" }}>
            <Suggested />
            <ChatsType />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
