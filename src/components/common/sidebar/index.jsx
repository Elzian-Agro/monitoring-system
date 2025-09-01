import React from 'react';
import { ArrowUpTrayIcon, ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import logo from 'assets/images/logo.png';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveMenu, setActiveMenu } from 'pages/dashboard/slice/dashboardLayoutSlice';
import SidebarLinks from './sidebarConstants';
import { useTranslation } from 'react-i18next';
import { clearUserData } from 'pages/dashboard/slice/userSlice';
import PropTypes from 'prop-types';

const Sidebar = ({ sidebarWidth }) => {
  const dispatch = useDispatch();
  const activeMenu = useSelector(selectActiveMenu);
  const { t } = useTranslation();
  const translatedSidebarLinks = SidebarLinks({ t });

  // This function for check if the active menu is 'open' if so will return true
  const isOpenMenu = () => activeMenu === 'open';

  const logout = () => {
    localStorage.removeItem('jwtAccessToken');
    localStorage.removeItem('jwtRefreshToken');
    localStorage.removeItem('Email');
    localStorage.removeItem('Password');
    dispatch(clearUserData());
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white bg-green-500 text-sm m-2';
  const normalLink =
    'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-sm text-black dark:text-white dark:hover:text-black hover:bg-gray-100 m-2 hover:translate-x-2 duration-300';

  return (
    <div className={`${sidebarWidth} fixed top-0 h-full z-20 ease-linear duration-300`}>
      <div className='flex flex-col h-full overflow-hidden bg-white dark:bg-secondary-dark-bg shadow-lg dark:border-r  dark:border-gray-600'>
        <div className='flex justify-between items-center mt-4 ml-4'>
          <a href='https://agro.elzian.com' target='_blank' rel='noopener noreferrer' className='flex flex-row gap-2'>
            <img className='xxs:w-10 md:w-14 ' src={logo} alt='Elzian Agro logo' />
            <div className='flex items-center'>
              {isOpenMenu() && (
                <span className='text-base md:text-lg font-extrabold tracking-tight text-slate-900 dark:text-green-600 '>
                  Elzian Agro
                </span>
              )}
            </div>
          </a>

          {activeMenu === 'open' && (
            <button
              type='button'
              onClick={() => {
                if (activeMenu === 'open') {
                  dispatch(setActiveMenu('onlyIcon'));
                } else if (activeMenu === 'onlyIcon') {
                  dispatch(setActiveMenu('close'));
                }
              }}
              className='sm:hidden text-xl rounded-full pr-3 hover:bg-light-gray block group'>
              <ArrowLeftCircleIcon className='h-6 w-6 dark:text-white dark:group-hover:text-black' />
            </button>
          )}
        </div>
        <div className='flex flex-col justify-between mt-2 h-5/6'>
          <div className='flex-grow sidebar-items overflow-y-auto'>
            {translatedSidebarLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? activeLink : normalLink)}>
                <link.icon className='h-6 w-6' />
                {isOpenMenu() && link.text}
              </NavLink>
            ))}
          </div>

          <div>
            {/* Logout */}
            <NavLink
              to='/login'
              className='flex items-center pl-5 pt-3 pb-2.5 gap-4 rounded-lg text-sm text-black dark:text-white hover:bg-red-500 m-2 duration-300'
              onClick={logout}>
              <ArrowUpTrayIcon className='h-6 w-6 rotate-90' />
              {isOpenMenu() && t('Logout')}
            </NavLink>
          </div>
        </div>
        {isOpenMenu() && (
          <footer className='text-gray-400 text-xs text-center p-2'>
            <p
              dangerouslySetInnerHTML={{
                __html: t(`Copyright Elzian Agro. All Rights Reserved`, { val: new Date().getFullYear() }),
              }}></p>
          </footer>
        )}
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  sidebarWidth: PropTypes.string.isRequired,
};

export default Sidebar;
