import React, { useState, useEffect } from 'react';
import { PrimaryButton } from '../../base/Button';
import TextBox from '../../base/TextBox';
import { identifyError, isValidPassword } from 'pages/auth/utils';
import axios from 'axios';
import { LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import ErrorMessage from 'pages/auth/components/base/ErrorMessage';
import { errorType } from 'constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { tokenise } from 'utils/rsa.encrypt';
import { updateEmail } from 'pages/auth/slice/emailSlice';

const ResetForm = ({ onClose, user = null, formSubmission }) => {
  const [tempPass, setTempPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState(null);
  const email = useSelector((state) => state.email.value);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(60);
  const [success, setSuccess] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tempPass) {
      setError('Please enter the temporary password sent to your email');
      return 0;
    } else if (!isValidPassword(newPass)) {
      setError(
        'Password too weak. Should contain atleast 8 characters including upper and lower case letters + numbers + special chars.'
      );
      return 0;
    } else if (newPass !== confirmPass) {
      setError('Passwords do not match');
      return 0;
    }

    const data = {
      email: email,
      temporaryPassword: tempPass,
      newPassword: newPass,
    };

    let token;

    try {
      token = await tokenise(data);
    } catch (error) {
      setError('An error occured! Please try agian');
      return;
    }

    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/reset-password`, { token })
      .then(() => {
        setError(null);
        dispatch(updateEmail(null));
        setSuccess(true);
      })
      .catch((error) => {
        if (error.response?.data?.code === errorType.userBlocked.code) setBlocked(true);
        else setError(identifyError(error.response?.data?.code));
      });
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendEmail = () => {
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/auth/forget-password`, {
        email: email,
      })
      .then(() => {
        setTimer(60);
      })
      .catch((error) => {
        if (error.response?.data?.code === errorType.userBlocked.code) setBlocked(true);
        else setError(identifyError(error.response?.data?.code));
      });
  };

  const resetForm = () => {
    setTempPass('');
    setNewPass('');
    setConfirmPass('');
    setError(null);
  };

  return (
    <div className='flex flex-col p-4 gap-4 min-h-full w-full shadow-lg bg-white dark:bg-gray-800 rounded-lg'>
      <div>
        <button
          className='prevbutton flex justify-start bg-red-500 hover:brightness-110 rounded-lg transition-transform'
          onClick={() => {
            console.log('Clicked');
            navigate('/profile');
          }}>
          <ArrowLeftIcon className='text-white w-6 h-6 mx-4 my-2 transform hover:-translate-x-2 duration-300' />
        </button>
      </div>

      {email && !success && !blocked && (
        <div>
          <h1 className='font-zenkaku text-center font-black text-[#212121] dark:text-white text-[18px] sm:text-[26px] leading-5 sm:leading-10'>
            {t('RESET PASSWORD')}
          </h1>
          <p className='font-zenkaku font-normal text-center text-[#999] text-[10px] sm:text-[16px] leading-5 xxs:leading-10'>
            {t('TEMPORARY PASSWORD HAS BEEN SENT TO YOUR EMAIL')}
          </p>
          <form className='grid space-y-4 max-w-[800px] px-12 sm:px-24 md:px-44 lg:ml-44  lg:px-40 lg:space-y-0 lg:gap-x-24 lg:gap-y-6'>
            <TextBox
              placeholder='Enter Temporary Password'
              label='Temporary Password'
              type='password'
              Icon={LockClosedIcon}
              value={tempPass}
              setValue={setTempPass}
            />

            <TextBox
              placeholder='Enter New Password'
              label='New Password'
              type='password'
              Icon={LockClosedIcon}
              value={newPass}
              setValue={setNewPass}
            />

            <TextBox
              placeholder='Enter New Password Again'
              label='Confirm Password'
              type='password'
              Icon={LockClosedIcon}
              value={confirmPass}
              setValue={setConfirmPass}
            />

            {error && <ErrorMessage message={error} />}
          </form>
          <div>
            {timer > 0 ? (
              <p className='font-zenkaku font-light text-[12px] text-center dark:text-gray-300'>
                {t("Email Sent! Didn't Recieve? Resend Email in", { val: timer })}
              </p>
            ) : (
              <button onClick={handleResendEmail} className='text-blue-500 hover:text-blue-700 font-zenkaku'>
                {t('Resend Email')}
              </button>
            )}
          </div>
          <div className='flex justify-end gap-2 px-12 sm:px-24 md:px-44 lg:px-40'>
            <PrimaryButton bgEffect='bg-red-500 border-red-600' size='w-24' text='Clear' onClick={resetForm} />
            <PrimaryButton bgEffect='bg-blue-500 border-blue-600' text='Submit' onClick={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetForm;