import { useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import PostShare from '../PostShare/PostShare';
import Posts from '../Posts/Posts';
import './PostSide.css';

const PostSide = () => {
  const params = useParams();
  const currentUser = useAuthStore((state) => state.authData?.user);
  const isOwnProfile = !params.id || params.id === currentUser?._id;

  return (
    <div className="PostSide">
      {isOwnProfile && <PostShare />}
      <Posts />
    </div>
  );
};

export default PostSide;