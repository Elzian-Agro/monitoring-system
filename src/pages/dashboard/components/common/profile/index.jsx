import React from 'react';
import { XCircleIcon, ArrowUpTrayIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { setProfileOpen } from 'pages/dashboard/slice/dashboardLayoutSlice';
import { useDispatch, useSelector } from 'react-redux';
import ThemeSettings from '../theme-settings';
import LanguageSelector from 'components/common/language-selector';
import { useTranslation } from 'react-i18next';
import avatar from 'assets/images/avatar.png';
import { clearUserData } from 'pages/dashboard/slice/userSlice';
import ClickOutsideHandler from 'pages/dashboard/utils/ClickOutsideHandler';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  //Capitalize the text
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const firstName = useSelector((state) => state.user.firstName);
  const lastName = useSelector((state) => state.user.lastName);
  const userType = useSelector((state) => capitalize(state.user.userType));
  const organizationName = useSelector((state) => state.user.orgName);
  const profileImage = useSelector((state) => state.user.profileImage);

  const closeProfile = () => {
    dispatch(setProfileOpen(false));
  };

  const logout = () => {
    localStorage.removeItem('jwtAccessToken');
    localStorage.removeItem('jwtRefreshToken');
    localStorage.removeItem('Email');
    localStorage.removeItem('Password');
    dispatch(clearUserData());
  };

  return (
    <ClickOutsideHandler callback={closeProfile}>
      {(ref) => (
        <div
          className='nav-item absolute right-1 top-16 shadow-lg bg-white dark:bg-secondary-dark-bg p-6 md:p-6 rounded-lg w-72 md:w-[22rem] z-[999]'
          ref={ref}>
          <div className='flex justify-between items-center'>
            <p className='font-semibold md:text-lg dark:text-white'>{t('My Profile')}</p>
            <button onClick={closeProfile}>
              <XCircleIcon className='h-6 w-6 dark:text-white' />
            </button>
          </div>

          <div className='flex gap-5 items-center mt-6 border-color border-b-1 pb-6'>
            <img
              className='rounded-full h-20 md:h-24 md:w-24'
              src={`${profileImage || avatar}?timestamp=${new Date().getTime()}`}
              alt='user-profile'
            />
            <div>
              <p className='font-semibold md:text-lg dark:text-white'>
                {firstName} {lastName}
              </p>
              <p className='text-gray-500 text-sm'> {userType} </p>
              <p className='text-gray-500 text-sm font-semibold'> {organizationName} </p>
            </div>
          </div>
          <NavLink to='/profile'>
            <div className='flex gap-5 border-b-1 border-color p-4 rounded-lg hover:bg-[#F7F7F7] dark:hover:bg-green-500 cursor-pointer'>
              <button
                type='button'
                style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                className=' text-xl rounded-lg p-3 hover:bg-light-gray'>
                <ChatBubbleBottomCenterIcon className='h-6 w-6' />
              </button>

              <div>
                <p className='font-semibold dark:text-white'>{t('My Profile')}</p>
                <p className='text-gray-500 text-sm '> {t('Account Settings')} </p>
              </div>
            </div>
          </NavLink>
          <div className='flex md:hidden p-4 h-20 mt-6'>
            <ThemeSettings />
          </div>
          <div className='md:hidden'>
            <LanguageSelector />
          </div>
          <div className='mt-5'>
            <NavLink
              to='/login'
              className='flex mt-12 items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-sm md:text-base text-black dark:text-white  hover:bg-red-500 m-2 duration-300'
              onClick={logout}>
              <ArrowUpTrayIcon className='h-6 w-6 rotate-90' />
              {t('Logout')}
            </NavLink>
          </div>
        </div>
      )}
    </ClickOutsideHandler>
  );
};

export default UserProfile;
