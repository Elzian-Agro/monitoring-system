import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PrimaryButton, ToggleButton } from 'pages/dashboard/components/base/Button';
import TextBox from 'pages/dashboard/components/base/TextBox';
import { ArrowLeftIcon, DevicePhoneMobileIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import useAxios from 'hooks/useAxios';
import Dropdown from 'pages/dashboard/components/base/Dropdown';
import MultiSelectDropdown from 'pages/dashboard/components/base/MultiSelectDropdown';
import { DeviceFactors, messages } from 'utils/constant';

const Form = ({ visible, onClose, device = null, formSubmission }) => {
  const [userList, setUserList] = useState([]);
  const [userId, setUserId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [deviceStatus, setDeviceStatus] = useState('');
  const [deviceFactors, setDeviceFactors] = useState([]);
  const [factors, setFactors] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isToggleClicked, setIsToggleClicked] = useState(false);

  const { t } = useTranslation();
  const { send } = useAxios();

  useEffect(() => {
    const getUsers = async () => {
      const users = await send({ endpoint: 'user', method: 'GET' });

      // Filter users where isDisabled is false
      const activeUsers = users.filter((user) => !user.isDisabled);

      // Map the active users to the desired format
      const userNames = activeUsers.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        value: user._id,
      }));

      setUserList(userNames);
    };

    getUsers();

    // Set form fields for edit mode
    if (device) {
      setUserId(device.userId?._id);
      setDeviceId(device.deviceId);
      setDeviceType(device.deviceType);
      setDeviceStatus(device.deviceStatus);
      setDeviceFactors(device.monitoringFactors);
      setIsDisabled(device.isDisabled);

      if (device?.userId) {
        setUserList((prevList) => [...prevList, { name: 'Deallocate', value: 'deallocate' }]);
      }
    }
    // eslint-disable-next-line
  }, [device]);

  useEffect(() => {
    if (deviceType) {
      // Only clear device factors if the form is in update mode and the deviceType has changed
      if (device && deviceType !== device.deviceType) {
        setDeviceFactors([]);
      }

      setFactors(DeviceFactors[deviceType] || []);
    }
  }, [deviceType, device]);

  const resetForm = () => {
    setUserId('');
    setDeviceId('');
    setDeviceType('');
    setDeviceStatus('');
    setDeviceFactors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      userId: userId === 'deallocate' || userId === '' ? null : userId,
      deviceId,
      deviceType,
      deviceStatus,
      monitoringFactors: deviceFactors,
      isDisabled,
    };

    const response = await send({
      endpoint: device ? `device/${device._id}` : `device`,
      method: device ? 'PUT' : 'POST',
      body: requestData,
    });

    if (response) {
      formSubmission(device ? messages.deviceUpdated : messages.deviceCreated);
      onClose();
    }
  };

  return (
    <>
      {!visible ? null : (
        <div className='flex flex-col p-2 sm:p-8 gap-8 min-h-full w-full shadow-lg bg-white dark:bg-secondary-dark-bg rounded-lg'>
          <div>
            <button
              className='flex justify-start bg-red-500 hover:brightness-110 self-end rounded-lg transition-transform'
              onClick={onClose}>
              <ArrowLeftIcon className='text-white w-6 h-6 mx-4 my-2 transform hover:-translate-x-2 duration-300' />
            </button>
          </div>
          <div>
            <h1 className='text-base text-center text-gray-700 dark:text-white'>
              {device ? t('UPDATE DEVICE DETAILS') : t('NEW DEVICE CREATION')}
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col justify-center'>
              <div className='grid lg:grid-cols-2 space-y-6 lg:space-y-0 w-full justify-center lg:gap-x-20 lg:px-28 xl:px-48 lg:gap-y-16'>
                <Dropdown
                  label='User Name'
                  Icon={IdentificationIcon}
                  defaltOptions='Allocate device'
                  value={userId}
                  setValue={setUserId}
                  options={userList}
                />

                <TextBox
                  placeholder='Ex: ELZ-XXXX-XX'
                  label='Device Id'
                  type='text'
                  Icon={IdentificationIcon}
                  value={deviceId}
                  setValue={setDeviceId}
                  required={true}
                />

                <Dropdown
                  label='Device Type'
                  Icon={DevicePhoneMobileIcon}
                  defaltOptions='Select a device type'
                  value={deviceType}
                  setValue={setDeviceType}
                  options={[
                    { name: 'Monitoring System', value: 'Monitoring System' },
                    { name: 'Portable Device', value: 'Portable Device' },
                    { name: 'Weather Station', value: 'Weather Station' },
                  ]}
                  required={true}
                />

                <MultiSelectDropdown
                  label='Monitoring Factors'
                  placeholder='Multiple selection'
                  Icon={DevicePhoneMobileIcon}
                  options={factors}
                  onChange={(values) => {
                    setDeviceFactors(values);
                  }}
                  selectedValues={deviceFactors}
                />

                <div className='flex flex-col sm:flex-row lg:flex-col gap-5'>
                  <label className='text-sm text-gray-400'>{t('Device Status')} :</label>
                  <div className='flex flex-row gap-x-4'>
                    <div>
                      <input
                        type='radio'
                        id='active'
                        name='status'
                        value='Active'
                        required
                        checked={deviceStatus === 'Active'}
                        onChange={() => setDeviceStatus('Active')}
                      />
                      <label htmlFor='active' className='text-sm text-gray-400 ml-2'>
                        {t('Active')}
                      </label>
                    </div>
                    <div>
                      <input
                        type='radio'
                        id='inactive'
                        name='status'
                        value='Inactive'
                        required
                        checked={deviceStatus === 'Inactive'}
                        onChange={() => setDeviceStatus('Inactive')}
                      />
                      <label htmlFor='inactive' className='text-sm text-gray-400 ml-2'>
                        {t('Inactive')}
                      </label>
                    </div>
                  </div>
                </div>

                {device?.isDisabled && (
                  <div className='flex flex-row items-center gap-4'>
                    <div className='text-gray-400'>{t('Enable device')} :</div>
                    <ToggleButton
                      value={isToggleClicked}
                      onChange={() => {
                        setIsToggleClicked(!isToggleClicked);
                        setIsDisabled(!isDisabled);
                      }}
                    />
                  </div>
                )}
              </div>

              <div className='flex justify-center pt-6'>
                <div className='flex justify-end gap-2 w-full xs:w-60 sm:w-64 md:w-80 lg:w-full lg:px-28 xl:px-48'>
                  {!device && <PrimaryButton color='bg-red-500 border-red-600' text='Clear' onClick={resetForm} />}
                  <PrimaryButton color='bg-blue-500 border-blue-600' text={device ? 'Update' : 'Submit'} />
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

Form.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  device: PropTypes.object,
  formSubmission: PropTypes.func.isRequired,
};

export default Form;
