import {useSelector} from 'react-redux';
import {
  selectUserData,
  selectUserImg,
  selectUserName,
} from '../store/selectors/profileSelector';

export const useProfile = () => {
  const userName = useSelector(selectUserName);
  const userImgUrl = useSelector(selectUserImg);
  const user = useSelector(selectUserData);

  return {
    userName,
    userImgUrl,
    user,
  };
};
