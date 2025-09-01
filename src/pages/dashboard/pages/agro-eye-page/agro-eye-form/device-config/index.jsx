import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CheckBox from 'pages/dashboard/components/base/CheckBox';
import { IdentificationIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Dropdown from 'pages/dashboard/components/base/Dropdown';
import { useTranslation } from 'react-i18next';

const DeviceConfig = ({ device, setDevices, index, deviceList, devices }) => {
  const { t } = useTranslation();

  // Initialize availableFactors if deviceId is already set
  useEffect(() => {
    if (device.deviceId && !device.availableFactors) {
      const matchingDevice = deviceList.find((deviceInfo) => deviceInfo.name === device.deviceId);
      if (matchingDevice) {
        const updatedDevices = [...devices];
        updatedDevices[index].availableFactors = matchingDevice.factors;
        setDevices(updatedDevices);
      }
    }
  }, [device.deviceId, device.availableFactors, deviceList, devices, index, setDevices]);

  const isSelected = (value) => device.factors.includes(value);

  return (
    <div className='w-full xs:w-60 sm:w-64 md:w-80 lg:w-full'>
      <div className='flex justify-end'>
        <XMarkIcon
          className='h-3 w-3 text-red-600 curser-pointer'
          onClick={() => {
            const updatedDevices = [...devices];
            updatedDevices.splice(index, 1);
            setDevices(updatedDevices);
          }}
        />
      </div>
      <Dropdown
        label='Device Id'
        Icon={IdentificationIcon}
        defaltOptions='Select a device'
        value={device.deviceId}
        setValue={(value) => {
          const updatedDevices = [...devices];
          updatedDevices[index].deviceId = value;
          updatedDevices[index].availableFactors =
            deviceList.find((deviceInfo) => deviceInfo.name === value)?.factors || [];
          setDevices(updatedDevices);
        }}
        options={deviceList}
        required={true}
      />
      <div className='my-4'>
        <p className='text-sm text-gray-400 mb-2'>{t('Factors')}</p>
        <div className='grid grid-cols-2'>
          {device.availableFactors?.map((factor) => (
            <CheckBox
              key={factor}
              label={t(factor)}
              onChange={() => {
                const updatedDevices = [...devices];
                if (!updatedDevices[index].factors.includes(factor)) {
                  updatedDevices[index].factors.push(factor);
                } else {
                  updatedDevices[index].factors = updatedDevices[index].factors.filter((f) => f !== factor);
                }
                setDevices(updatedDevices);
              }}
              checked={isSelected(factor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

DeviceConfig.propTypes = {
  device: PropTypes.shape({
    deviceId: PropTypes.string.isRequired,
    factors: PropTypes.arrayOf(PropTypes.string).isRequired,
    availableFactors: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setDevices: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  deviceList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      factors: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  devices: PropTypes.arrayOf(
    PropTypes.shape({
      deviceId: PropTypes.string.isRequired,
      factors: PropTypes.arrayOf(PropTypes.string).isRequired,
      availableFactors: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default DeviceConfig;
