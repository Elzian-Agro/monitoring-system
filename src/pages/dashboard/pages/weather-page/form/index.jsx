import React, { useState } from 'react';
import TextBox from 'pages/dashboard/components/base/TextBox';
import { PrimaryButton } from 'pages/dashboard/components/base/Button';
import { useDispatch } from 'react-redux';
import { setUserData } from 'pages/dashboard/slice/userSlice';
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAxios from 'hooks/useAxios';
import PropTypes from 'prop-types';

const Form = ({ userLocation, onClose }) => {
  const [location, setLocation] = useState({
    latitude: userLocation?.latitude || 0,
    longitude: userLocation?.longitude || 0,
  });

  const { send } = useAxios();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await send({
      endpoint: 'user/profile',
      method: 'PUT',
      body: {
        location: { latitude: location.latitude, longitude: location.longitude },
      },
    });

    if (response) {
      dispatch(setUserData({ location: { latitude: location.latitude, longitude: location.longitude } }));
      onClose();
    }
  };

  return (
    <form className='flex flex-col lg:w-80' onSubmit={handleSubmit}>
      <div className='flex justify-end cursor-pointer'>
        <XMarkIcon
          className='h-4 w-4 text-red-600'
          onClick={() => {
            onClose();
          }}
        />
      </div>
      <div>
        <TextBox
          placeholder='Eg. 6.02145'
          label='Latitude'
          type='number'
          Icon={MapPinIcon}
          value={location?.latitude}
          setValue={(value) => setLocation({ ...location, latitude: value })}
        />

        <TextBox
          placeholder='Eg. 6.02145'
          label='Longitude'
          type='number'
          Icon={MapPinIcon}
          value={location?.longitude}
          setValue={(value) => setLocation({ ...location, longitude: value })}
        />
      </div>

      <div className='w-full xs:w-60 sm:w-64 md:w-80 lg:w-full my-2'>
        <p className='text-gray-400 text-xs'>
          {t('Location Description')}
          <a
            className='text-blue-500 underline ml-1'
            href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
            rel='noreferrer'
            target='_blank'>
            {t('click')}
          </a>
        </p>
      </div>
      <div className='w-full xs:w-60 sm:w-64 md:w-80 lg:w-full flex justify-end'>
        <PrimaryButton type='submit' text='Submit' color='bg-blue-500 border-blue-600' />
      </div>
    </form>
  );
};

Form.propTypes = {
  userLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
};

export default Form;
