import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData, clearUserData } from '../../slice/userSlice';
import { useTranslation } from 'react-i18next';
import avatar from 'assets/images/avatar.png';
import coverImage from 'assets/images/cover.jpg';
import Modal from 'components/common/modal';
import useAxios from 'hooks/useAxios';
import UpdateProfileForm from './update-profile-form';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from 'pages/dashboard/components/base/Button';
import SocialLink from './social-link';
import Loader from 'pages/dashboard/components/common/loader';
import useFetch from 'hooks/useFetch';
import { messages } from 'utils/constant';

const UserProfilePage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isDisableAlertVisible, setIsDisableAlertVisible] = useState(false);
  const [message, setMessage] = useState('');

  const { loading, send } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    response: user,
    isLoading,
    recall,
  } = useFetch({
    endpoint: 'user/profile',
    method: 'GET',
    call: 1,
    requestBody: {},
    dependency: [],
  });

  useEffect(() => {
    dispatch(setUserData(user));
    // eslint-disable-next-line
  }, [user]);

  const formSubmission = async (message) => {
    setMessage(message);
    setIsAlertVisible(true);
    recall();
  };

  // Disable
  const confirmDialogCloseDisable = (result) => {
    if (result) {
      handleDisable();
    }
    setIsConfirmVisible(false);
  };

  const handleDisable = async () => {
    const response = await send({
      endpoint: `user/disable/${user._id}`,
      method: 'POST',
      body: { isDisabled: true },
    });

    if (response) {
      setMessage(messages.accountDisabled);
      setIsDisableAlertVisible(true);
      //Removed locally sotored user data
      localStorage.removeItem('jwtAccessToken');
      localStorage.removeItem('jwtRefreshToken');
      dispatch(clearUserData());
    }
  };

  return (
    <div className='mt-3 mx-6 min-h-screen'>
      {isFormVisible && (
        <UpdateProfileForm
          onClose={() => {
            setIsFormVisible(false);
            recall();
          }}
          visible={isFormVisible}
          user={user}
          formSubmission={formSubmission}
        />
      )}

      {(loading || isLoading) && (
        <div className='h-[90vh]'>
          <Loader />
        </div>
      )}

      {!isFormVisible && !loading && !isLoading && user && (
        <div className='flex flex-col justify-center items-center bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-gray-700 rounded-xl shadow-md mb-6'>
          <div className='relative flex justify center h-48 w-full'>
            <img src={coverImage} alt='farmLand' className='w-full h-full object-cover rounded-tr-xl rounded-tl-xl ' />
            <div className='absolute bottom-[-30px] left-1/2 transform -translate-x-1/2'>
              <img
                src={`${user.profileImage || avatar}?timestamp=${new Date().getTime()}`}
                alt='Profile'
                className='w-32 h-32 rounded-full object-cover'
              />
            </div>
          </div>

          <div className='relative flex flex-col gap-5 m-8'>
            {user.socialMedia && (
              <div className='absolute flex flex-row top-0 right-0'>
                <SocialLink
                  link={user.socialMedia.facebook}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='30' height='30' viewBox='0 0 48 48'>
                      <path
                        fill='#3F51B5'
                        d='M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z'></path>
                      <path
                        fill='#FFF'
                        d='M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z'></path>
                    </svg>
                  }
                />
                <SocialLink
                  link={user.socialMedia.linkedIn}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='30' height='30' viewBox='0 0 48 48'>
                      <path
                        fill='#0078d4'
                        d='M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5	V37z'></path>
                      <path
                        d='M30,37V26.901c0-1.689-0.819-2.698-2.192-2.698c-0.815,0-1.414,0.459-1.779,1.364	c-0.017,0.064-0.041,0.325-0.031,1.114L26,37h-7V18h7v1.061C27.022,18.356,28.275,18,29.738,18c4.547,0,7.261,3.093,7.261,8.274	L37,37H30z M11,37V18h3.457C12.454,18,11,16.528,11,14.499C11,12.472,12.478,11,14.514,11c2.012,0,3.445,1.431,3.486,3.479	C18,16.523,16.521,18,14.485,18H18v19H11z'
                        opacity='.05'></path>
                      <path
                        d='M30.5,36.5v-9.599c0-1.973-1.031-3.198-2.692-3.198c-1.295,0-1.935,0.912-2.243,1.677	c-0.082,0.199-0.071,0.989-0.067,1.326L25.5,36.5h-6v-18h6v1.638c0.795-0.823,2.075-1.638,4.238-1.638	c4.233,0,6.761,2.906,6.761,7.774L36.5,36.5H30.5z M11.5,36.5v-18h6v18H11.5z M14.457,17.5c-1.713,0-2.957-1.262-2.957-3.001	c0-1.738,1.268-2.999,3.014-2.999c1.724,0,2.951,1.229,2.986,2.989c0,1.749-1.268,3.011-3.015,3.011H14.457z'
                        opacity='.07'></path>
                      <path
                        fill='#fff'
                        d='M12,19h5v17h-5V19z M14.485,17h-0.028C12.965,17,12,15.888,12,14.499C12,13.08,12.995,12,14.514,12	c1.521,0,2.458,1.08,2.486,2.499C17,15.887,16.035,17,14.485,17z M36,36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698	c-1.501,0-2.313,1.012-2.707,1.99C24.957,25.543,25,26.511,25,27v9h-5V19h5v2.616C25.721,20.5,26.85,19,29.738,19	c3.578,0,6.261,2.25,6.261,7.274L36,36L36,36z'></path>
                    </svg>
                  }
                />
                <SocialLink
                  link={user.socialMedia.youtube}
                  icon={
                    <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='30' height='30' viewBox='0 0 48 48'>
                      <path
                        fill='#FF3D00'
                        d='M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z'></path>
                      <path fill='#FFF' d='M20 31L20 17 32 24z'></path>
                    </svg>
                  }
                />
              </div>
            )}

            <p className='text-gray-600 dark:text-white text-center text-xl mt-8 xs:mt-6 md:mt-4 '>
              {user.firstName} {user.lastName}
            </p>

            <p className='text-gray-600 dark:text-white text-center'>
              {user.userType && user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </p>

            <div className='flex justify-center xs:px-4 md:px-20 lg:px-20 xl:px-30'>
              <p className='text-gray-600 dark:text-white text-justify'>{user.userBio}</p>
            </div>

            <div className='grid justify-center lg:grid-cols-2 space-y-3 lg:space-y-0 lg:gap-y-5 lg:gap-x-8 lg:px-10 xl:px-20'>
              <div className='flex flex-col xs:flex-row justify-center'>
                <div className='flex justify-between w-32'>
                  <label className='text-black dark:text-white'>{t('NIC')}</label>
                  <span className='pr-5 dark:text-white'>:</span>
                </div>
                <p className='text-gray-600 dark:text-white w-40'>{user.nic}</p>
              </div>

              <div className='flex flex-col xs:flex-row justify-center'>
                <div className='flex justify-between w-32'>
                  <label className='text-black dark:text-white'>{t('Email')}</label>
                  <span className='pr-5 dark:text-white'>:</span>
                </div>
                <p className='text-gray-600 dark:text-white w-40'>{user.email}</p>
              </div>

              <div className='flex flex-col xs:flex-row justify-center'>
                <div className='flex justify-between w-32'>
                  <label className='text-black dark:text-white'>{t('Phone No')}</label>
                  <span className='pr-5 dark:text-white'>:</span>
                </div>
                <p className='text-gray-600 dark:text-white w-40'>{user.phoneNum}</p>
              </div>

              <div className='flex flex-col xs:flex-row justify-center'>
                <div className='flex justify-between w-32'>
                  <label className='text-black dark:text-white'>{t('Address')}</label>
                  <span className='pr-5 dark:text-white'>:</span>
                </div>
                <p className='text-gray-600 dark:text-white w-40'>{user.address}</p>
              </div>

              <div className='flex flex-col xs:flex-row justify-center'>
                <div className='flex justify-between w-32'>
                  <label className='text-black dark:text-white'>{t('Organization')}</label>
                  <span className='pr-5 dark:text-white'>:</span>
                </div>
                <p className='text-gray-600 dark:text-white w-40'>{user.orgName}</p>
              </div>

              <div className='flex flex-col xs:flex-row justify-center'>
                <div className='flex justify-between w-32'>
                  <label className='text-black dark:text-white'>{t('Status')}</label>
                  <span className='pr-5 dark:text-white'>:</span>
                </div>
                <p className={`${user.isVerified ? 'text-green-500' : 'text-red-500'} w-40`}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>

            <div className='flex flex-row justify-end gap-2'>
              <PrimaryButton
                color='bg-blue-500 border-blue-600'
                text='Update'
                onClick={() => {
                  setIsFormVisible(true);
                }}
              />
              <PrimaryButton
                color='bg-red-500 border-red-600'
                text='Disable'
                onClick={() => {
                  setIsConfirmVisible(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Disable confirmation */}
      <Modal
        isOpen={isConfirmVisible}
        message={messages.accountConfirmDisable}
        onClose={(result) => confirmDialogCloseDisable(result)}
        type='confirmation'
      />
      {/* Alert message Popup */}
      <Modal
        isOpen={isAlertVisible}
        message={`${message}`}
        onClose={() => {
          setIsAlertVisible(false);
        }}
        type='alert'
      />
      {/* Disable Success message Popup */}
      <Modal
        isOpen={isDisableAlertVisible}
        message={`${message}`}
        onClose={() => {
          setIsDisableAlertVisible(false);
          navigate('/');
        }}
        type='alert'
      />
    </div>
  );
};

export default UserProfilePage;
