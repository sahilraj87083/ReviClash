import { Button, FollowButton} from "../";
import { useNavigate } from "react-router-dom";

function ProfileActions({ isOwnProfile, isUserLoggedIn, profileUserId }) {
  if (!isUserLoggedIn) return null;
  const navigate = useNavigate()

  if (isOwnProfile) {
    return (
      <>
        <Button variant="secondary" onClick={() => navigate("/user/profile/edit")}>Edit Profile</Button>
        <Button variant="ghost">Share</Button>
      </>
    );
  }

  return (
    <>
      <FollowButton userId={profileUserId} />
      <Button variant="secondary">Message</Button>
    </>
  );
}
export default ProfileActions