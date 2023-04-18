import {useSelector} from 'react-redux';
import {
  selectUserImg,
  selectUserName,
} from '../store/selectors/profileSelector';

export const useProfile = () => {
  const userName = useSelector(selectUserName);
  const userImgUrl = useSelector(selectUserImg);

  return {
    userName,
    userImgUrl,
  };
};
