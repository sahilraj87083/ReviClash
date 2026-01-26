import { Button, FollowButton} from "../";

function ProfileActions({ isOwnProfile, isUserLoggedIn, profileUserId }) {
  if (!isUserLoggedIn) return null;

  if (isOwnProfile) {
    return (
      <>
        <Button variant="secondary">Edit Profile</Button>
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