import './Post.css';
import Comment from '../../img/comment.png';
import Share from '../../img/share.png';
import Heart from '../../img/like.png';
import notLike from '../../img/notlike.png';
import { useSelector } from 'react-redux';

const Post = ({ data, id }) => {
  const { user } = useSelector(state => state.authReducer.authData);

  return (
    <div key={id} className='Post'>
      <img src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : "" } alt='postimage' />
      
      <div className='postReact'>
        <img src={ data.liked ? Heart : notLike} alt='like/notlike' />
        <img src={ Comment} alt='comment' />
        <img src={ Share} alt='share' />
      </div>

      <span style={{color: 'var(--gray)', fontSize: '12px'}}>{data.likes} likes</span>
      
      <div className="detail">
        <span><b>{data.name}</b></span>
        <span> { data.desc}</span>
      </div>
    </div>
  )
}

export default Post