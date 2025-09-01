import './index.css';
import Navbar from 'components/common/navbar';
import Sidebar from 'components/common/sidebar';
import { useSelector } from 'react-redux';
import { selectActiveMenu, selectTheme } from '../../../slice/dashboardLayoutSlice';
import { useEffect } from 'react';
import Loader from '../loader';
import useNotification from 'hooks/useNotification';
import { Outlet } from 'react-router';
import useAxios from 'hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { getNewAccessToken } from 'pages/dashboard/utils/getAccessToken';
import useUserData from 'hooks/useUserData';
import GlobalErrorModal from 'error';

const getSidebarWidth = (activeMenu) => {
  switch (activeMenu) {
    case 'open':
      return 'w-60';
    case 'onlyIcon':
      return 'w-20';
    default:
      return 'w-0';
  }
};

const getMainContentMargin = (activeMenu) => {
  switch (activeMenu) {
    case 'open':
      return 'sm:ml-60';
    case 'onlyIcon':
      return 'ml-20';
    default:
      return 'ml-0';
  }
};

const Layout = () => {
  const activeMenu = useSelector(selectActiveMenu);
  const sidebarWidth = getSidebarWidth(activeMenu);
  const mainContentMargin = getMainContentMargin(activeMenu);
  const currentTheme = useSelector(selectTheme);
  const { isLoading, setUserFetch } = useUserData();
  const { setNotificationFetch } = useNotification();
  const navigate = useNavigate();
  const { send } = useAxios();

  useEffect(() => {
    getNewAccessToken();
    const verifyUser = async () => {
      const response = await send({ endpoint: 'auth/verify', method: 'POST' });
      if (response?.code !== 14017) {
        setTimeout(() => {
          navigate('/login');
        }, 0);
      } else {
        setUserFetch(true);
        setNotificationFetch(true);
      }
    };

    verifyUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentTheme === 'Dark') {
      document.body.style.backgroundColor = '#20232A';
    } else {
      document.body.style.backgroundColor = '#FAFBFB';
    }
  }, [currentTheme]);

  return (
    <div className={currentTheme === 'Dark' ? 'dark' : ''}>
      {isLoading ? (
        <div className='h-screen'>
          <Loader />
        </div>
      ) : (
        <div>
          <Navbar mainContentMargin={mainContentMargin} />
          <div className={`${mainContentMargin} mt-16 ease-linear duration-300`}>
            <Outlet />
            <GlobalErrorModal />
          </div>
          <Sidebar sidebarWidth={sidebarWidth} />
        </div>
      )}
    </div>
  );
};

export default Layout;
