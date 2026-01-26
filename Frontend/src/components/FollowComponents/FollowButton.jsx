import { Button } from "../";
import { useFollow } from "../../hooks/useFollow";

function FollowButton({ userId }) {
  const { isFollowing, follow, unfollow, loading } = useFollow(userId);

  return (
    <Button
      disabled={loading}
      variant={isFollowing ? "secondary" : "primary"}
      onClick={isFollowing ? unfollow : follow}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}

export default FollowButton;
