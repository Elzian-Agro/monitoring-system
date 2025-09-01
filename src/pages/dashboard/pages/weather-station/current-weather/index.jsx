import React, { useState, useEffect } from 'react';
import useFetch from 'hooks/useFetch';
import { useTranslation } from 'react-i18next';
import Loader from 'pages/dashboard/components/common/loader';
import SoilMoistureIcon from 'assets/images/weather-indicator/soil-moisture.png';
import UvRadiationIcon from 'assets/images/weather-indicator/uv-radiation.png';
import WindIcon from 'assets/images/weather-indicator/wind.png';
import RainfallIcon from 'assets/images/weather-indicator/rain.png';
import HumidityIcon from 'assets/images/weather-indicator/humidity.png';
import TemperatureIcon from 'assets/images/weather-indicator/temperature.png';
import IlluminationIcon from 'assets/images/weather-indicator/illumination.png';
import instantWindSpeedIcon from 'assets/images/weather-indicator/instantaneous-wind-speed.png';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const CurrentWeather = () => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedWeatherData, setSelectedWeatherData] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMinute, setCurrentMinute] = useState(currentTime.getMinutes());

  const { t } = useTranslation();

  const { response: currentWeatherData, isLoading } = useFetch({
    endpoint: 'weather-station/current',
    method: 'GET',
    call: 1,
    requestBody: {},
    dependency: [currentMinute],
  });

  useEffect(() => {
    if (currentWeatherData) {
      setSelectedDevice(currentWeatherData[0]?.deviceId);
      setSelectedWeatherData(currentWeatherData[0]);
    }

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = new Date();
        if (newTime.getMinutes() !== prevTime.getMinutes()) {
          setCurrentMinute(newTime.getMinutes());
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentWeatherData]);

  const handleDeviceChange = (e) => {
    const deviceId = e.target.value;
    setSelectedDevice(deviceId);

    // Find the selected device data from the weatherData array
    setSelectedWeatherData(currentWeatherData?.find((device) => device.deviceId === deviceId));
  };

  return (
    <div>
      <div className='flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between md:items-center mb-4'>
        <div>
          <h2 className='text-md text-gray-600 dark:text-gray-300'>{t('CURRENT WEATHER')}</h2>
          <div className='flex flex-row gap-4'>
            <p className='font-bold text-sm text-gray-600 dark:text-gray-300'>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div>
              {currentWeatherData && selectedWeatherData?.batteryLevel && (
                <div className='flex items-center space-x-1'>
                  {/* Battery Level Indicator */}
                  <div className='relative w-8 h-4 bg-gray-300 dark:bg-gray-700 rounded-md'>
                    <div
                      className='h-full bg-green-500 rounded-sm'
                      style={{ width: `${selectedWeatherData.batteryLevel}%` }}></div>
                  </div>

                  <p className='font-bold text-sm text-gray-600 dark:text-gray-300'>
                    {selectedWeatherData.batteryLevel}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isLoading && Array.isArray(currentWeatherData) && currentWeatherData.length > 0 && (
          <select
            className='border border-gray-300 dark:border-gray-500 rounded-md p-2 focus:outline-none dark:bg-secondary-dark-bg dark:text-white'
            value={selectedDevice || ''}
            onChange={handleDeviceChange}>
            {currentWeatherData?.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.deviceId}
              </option>
            ))}
          </select>
        )}
      </div>

      {isLoading && <Loader />}

      {!isLoading && !currentWeatherData && (
        <div className='flex justify-center bg-white dark:bg-secondary-dark-bg rounded-lg p-8'>
          <p className='text-sm dark:text-white justify-center'>{t('There are no current weather data available!')}</p>
        </div>
      )}

      {!isLoading && currentWeatherData && (
        <div className='grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
          {/* Temperature */}
          {selectedWeatherData?.temperature && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={TemperatureIcon} alt='soil' className='h-auto w-12' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>{t('Temperature')}</h3>
                <p className='text-2xl font-semibold text-red-500'>{selectedWeatherData.temperature}°C</p>
              </div>
            </div>
          )}

          {/* Humidity */}
          {selectedWeatherData?.humidity && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={HumidityIcon} alt='soil' className='w-auto h-[50px]' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>{t('Humidity')}</h3>
                <p className='text-2xl font-semibold' style={{ color: '#00DCFC' }}>
                  {selectedWeatherData.humidity}%
                </p>
              </div>
            </div>
          )}

          {/* Soil Moisture */}
          {selectedWeatherData?.soil_moisture && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={SoilMoistureIcon} alt='soil moisture' className='w-auto h-16' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>{t('Soil Moisture')}</h3>
                <p className='text-2xl font-semibold' style={{ color: '#66a3ff' }}>
                  {selectedWeatherData.soil_moisture}%
                </p>
              </div>
            </div>
          )}

          {/* Rainfall  */}
          {selectedWeatherData?.rainfall && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={RainfallIcon} alt='soil moisture' className='w-auto h-16' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>{t('Rainfall')}</h3>
                <p className='text-2xl font-semibold' style={{ color: '#538cc6' }}>
                  {selectedWeatherData.rainfall}mm
                </p>
              </div>
            </div>
          )}

          {/* Wind */}
          {selectedWeatherData?.soil_moisture && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={WindIcon} alt='soil moisture' className='w-auto h-[50px]' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>{t('Wind Speed')}</h3>
                <div className='flex flex-row'>
                  <p className='text-2xl font-semibold text-green-500'>{selectedWeatherData.wind_speed}m/s</p>
                  <ArrowUpIcon
                    className='h-auto w-6 transform font-bold text-gray-400 ml-1 mt-1'
                    style={{ transform: `rotate(${selectedWeatherData.wind_direction || 0}deg)` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* UV Radiation  */}
          {selectedWeatherData?.uv_radiation && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={UvRadiationIcon} alt='soil moisture' className='w-16 h-16' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>{t('UV Radiation')}</h3>
                <p className='text-2xl font-semibold text-yellow-500'>{selectedWeatherData.uv_radiation}W/m²</p>
              </div>
            </div>
          )}

          {/* Instantaneous Wind Speed  */}
          {selectedWeatherData?.instantaneous_wind_speed && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={instantWindSpeedIcon} alt='soil moisture' className='w-auto h-16' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>
                  {t('Instantaneous Wind Speed')}
                </h3>
                <p className='text-2xl font-semibold' style={{ color: '#538cc6' }}>
                  {selectedWeatherData.instantaneous_wind_speed}m/s
                </p>
              </div>
            </div>
          )}

          {/* Illumination  */}
          {selectedWeatherData?.illumination && (
            <div className='flex flex-row rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-sm'>
              <div className='flex items-end'>
                <img src={IlluminationIcon} alt='soil moisture' className='w-auto h-16' />
              </div>

              <div className='flex flex-col justify-end pl-4'>
                <h3 className='text-sm font-medium text-gray-600 dark:text-gray-100'>{t('Illumination')}</h3>
                <p className='text-2xl font-semibold text-yellow-500'>{selectedWeatherData.illumination}lux</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;
