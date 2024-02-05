import { Bars3Icon, ChevronDownIcon, BellIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveMenu,
  selectActiveMenu,
  setProfileOpen,
  selectProfileOpen,
  setNotificationOpen,
  selectNotificationOpen,
} from 'pages/dashboard/slice/dashboardLayoutSlice';
import UserProfile from 'pages/dashboard/components/common/user-profile';
import Notification from 'pages/dashboard/components/common/notification';
import ThemeSettings from 'pages/dashboard/components/common/theme-settings';
import { menuMode } from 'constant';
import { selectNotificationsCount } from 'pages/dashboard/slice/notificationSlice';
import avatar from 'assets/images/avatar.png';
import LanguageSelector from '../language-selector';

const Navbar = () => {
  const dispatch = useDispatch();
  const activeMenu = useSelector(selectActiveMenu);
  const isProfileOpen = useSelector(selectProfileOpen);
  const isNotificationOpen = useSelector(selectNotificationOpen);
  const NotificationsCount = useSelector(selectNotificationsCount);

  //Get username through redux toolkit
  const userName = useSelector((state) => state.user.firstName);
  const profileImage = useSelector((state) => state.user.profileImage);

  // Function to handle the click on the profile button
  const handleProfileClick = () => {
    dispatch(setProfileOpen(!isProfileOpen));
    dispatch(setNotificationOpen(false)); // Close notification when profile is opened
  };

  // Function to handle the click on the notification button
  const handleNotificationClick = () => {
    dispatch(setNotificationOpen(!isNotificationOpen));
    dispatch(setProfileOpen(false)); // Close profile when notification is opened
  };

  const toggleActiveMenu = () => {
    let nextActiveMenu;

    if (activeMenu === menuMode.open) {
      nextActiveMenu = menuMode.partiallyOpen;
    } else if (activeMenu === menuMode.partiallyOpen) {
      nextActiveMenu = menuMode.close;
    } else {
      nextActiveMenu = menuMode.open;
    }

    dispatch(setActiveMenu(nextActiveMenu));
  };

  return (
    <div className='flex justify-between xs:pl-2 pt-2 pb-2 pr-2 md:mr-6 relative'>
      <button
        type='button'
        className='relative text-xl rounded-full p-3  dark:text-white hover:bg-light-gray dark:hover:text-black'
        onClick={toggleActiveMenu}>
        <Bars3Icon className='h-6 w-6 cursor-pointer' />
      </button>

      <div className='flex'>
        <div className='hidden md:flex gap-2'>
          <LanguageSelector />
          <ThemeSettings />
        </div>
        <button
          type='button'
          className='relative text-xl rounded-full p-3 hover:bg-light-gray dark:text-white dark:hover:text-black'
          onClick={handleNotificationClick}>
          {NotificationsCount > 0 && (
            <span
              style={{ background: NotificationsCount > 0 ? 'red' : '' }}
              className='absolute inline-flex rounded-full right-1 top-1'>
              <span className='text-xs font-semibold text-white px-1'>{NotificationsCount}</span>
            </span>
          )}
          <BellIcon className='h-6 w-6 text-14' />
        </button>
        <div
          className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg'
          onClick={handleProfileClick}>
          <img className='rounded-full w-8 h-8' src={profileImage ? profileImage : avatar} alt='user-profile' />
          <p className='xxs:hidden sm:block'>
            <span className='text-gray-400 text-14 hidden md:inline-block'>Hi,</span>
            <span className='text-gray-400 font-bold ml-1 text-14'>
              <span className='md:hidden'>{userName.charAt(0)}</span>
              <span className='hidden md:inline'>{userName}</span>
            </span>
          </p>
          <ChevronDownIcon className='h-6 w-6 text-14 text-gray-400' />
        </div>
        {isProfileOpen && <UserProfile />}
        {isNotificationOpen && <Notification />}
      </div>
    </div>
  );
};

export default Navbar;
