import Home from '../../img/home.png';
import Noti from '../../img/noti.png';
import Comment from '../../img/comment.png';
import { UilSetting } from '@iconscout/react-unicons';
import TrendCard from '../TrendCard/TrendCard';
import "./RightSide.css";
import { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';

const RightSide = () => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
      <div className='RightSide'>
          <div className="navIcons">
              <img src={Home} alt="home" />
              <UilSetting />
              <img src={ Noti} alt="notifications" />
              <img src={ Comment} alt="comments" />
          </div>
          <TrendCard />
          <button className="button r-button" onClick={() => setModalOpened(true)}>
              Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened}/>
    </div>
  )
}

export default RightSide
