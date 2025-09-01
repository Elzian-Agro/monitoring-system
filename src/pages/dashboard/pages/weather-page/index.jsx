import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from 'pages/dashboard/components/common/loader';
import { ArrowUpIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorModal } from 'error/slice/errorSlice';
import { selectUserData } from '../../slice/userSlice';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from 'pages/dashboard/components/base/Button';
import { selectTheme } from 'pages/dashboard/slice/dashboardLayoutSlice';
import Chart from './chart';
import Form from './form';
import { messages, weatherIcons } from 'utils/constant';

const WeatherComponent = () => {
  const [location, setLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currentdWeather, setCurrentdWeather] = useState({});
  const [selectedWeather, setSelectedWeather] = useState({});
  const [summaryWeather, setSummaryWeather] = useState([]);
  const [view, setView] = useState('summary');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const user = useSelector(selectUserData);
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.location?.latitude && user?.location?.longitude) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchData = async () => {
    try {
      const resLocation = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${user.location.latitude}&lon=${user.location.longitude}&limit=1&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`
      );

      if (resLocation?.data[0]) {
        setLocation(resLocation?.data[0]);

        const resWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${user.location.latitude}&lon=${user.location.longitude}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`
        );

        const weatherForecast = resWeather?.data?.list.map((item) => {
          return {
            date: item.dt_txt,
            temperature: item.main.temp,
            feels_like: item.main.feels_like,
            humidity: item.main.humidity,
            wind_speed: item.wind.speed,
            wind_deg: item.wind.deg,
            pressure: item.main.pressure,
            visibility: item.visibility,
            weather_description: item.weather[0].description,
            weather_icon: item.weather[0].icon,
          };
        });

        const currentWeather = weatherForecast.filter((weather) => {
          const timeDifference = Math.abs(new Date(weather.date) - new Date()) / (60 * 60 * 1000);
          return timeDifference <= 1.5;
        });

        const summaryWeather = weatherForecast.filter((weather) => {
          const dateTime = new Date(weather.date);
          return dateTime.getHours() === 12 && dateTime.getMinutes() === 0;
        });

        setWeatherData(weatherForecast);
        setCurrentdWeather(currentWeather);
        setSummaryWeather(summaryWeather);
      } else {
        setLocation(null);
        setWeatherData(null);
        dispatch(showErrorModal(messages.provideValidLocation));
      }
    } catch (error) {
      dispatch(showErrorModal(messages.failedFetchWeathering));
    }
  };

  const getWeatherIconUrl = (iconID) =>
    weatherIcons[iconID] || 'https://cdn-icons-png.flaticon.com/128/12607/12607703.png';

  return (
    <div className='flex flex-col gap-5 bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-gray-700 rounded-xl shadow-md mx-6 mt-3 p-4 min-h-screen'>
      <div className='flex flex-col rounded-md border border-gray-100 dark:border-gray-600 px-4 py-2 shadow-md'>
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-0 items-start sm:items-center justify-between'>
          <div className='flex flex-col xs:flex-row items-start xs:items-center'>
            <HomeIcon className='h-6 w-6 mr-2 text-md text-gray-700 dark:text-gray-300' />
            <h1 className='mr-2 text-md text-gray-700 dark:text-gray-300'>
              {`${location?.name || '__'}${location?.name ? ',' : ''} ${location?.state || ''}${
                location?.state ? ',' : ''
              } ${location?.country || ''}`}
            </h1>
          </div>
          {!isFormVisible && (
            <PrimaryButton
              type='button'
              text='Change'
              color='bg-blue-500 border-blue-600'
              onClick={() => setIsFormVisible(true)}
            />
          )}
        </div>

        {isFormVisible ? (
          <div className='flex justify-center mt-2'>
            <Form
              userLocation={user?.location}
              onClose={() => {
                setIsFormVisible(false);
              }}
            />
          </div>
        ) : null}
      </div>

      {!weatherData && (
        <div className='h-[70vh]'>
          <Loader />
        </div>
      )}

      {weatherData && (
        <div className='flex flex-col gap-5'>
          <div
            className='flex flex-col rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-md  overflow-x-auto'
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: currentTheme === 'Dark' ? '#c4c4c4 #616362' : '#c4c4c4 #edf2ef',
            }}>
            <h1 className='text-md text-gray-600 dark:text-gray-300'>{t('CURRENT WEATHER')}</h1>
            <p className='font-bold text-sm text-gray-600 dark:text-gray-300'>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>

            <div className='flex flex-col xl:flex-row xl:justify-center'>
              <div className='flex flex-col md:flex-row'>
                <div className='flex flex-row gap-2 items-center py-4 xl:mr-10'>
                  <img
                    src={getWeatherIconUrl(currentdWeather[0]?.weather_icon)}
                    alt='Weather Icon'
                    className='w-12 sm:w-16 lg:w-32'
                  />
                  <p className='font-semibold text-gray-600 dark:text-gray-300 text-5xl lg:text-6xl mr-5 lg:mr-10 ml-5'>
                    {currentdWeather[0]?.temperature}
                    <span className='text-gray-400'>°C</span>
                  </p>
                </div>

                <div className='flex flex-col item-center justify-center xl:mr-20'>
                  <p className='text-gray-400 text-md'>
                    {currentdWeather[0]?.weather_description
                      ?.split(' ')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </p>
                  <p className='text-sm min-w-28 lg:text-lg text-gray-600 dark:text-gray-300'>
                    {t('Feels like')}
                    <span className='font-semibold ml-2'>{currentdWeather[0]?.feels_like}</span>
                    <span className='font-extralight text-gray-400'>°C</span>
                  </p>
                </div>
              </div>
              <div className='flex flex-col justify-between mt-2'>
                <div className='flex flex-row'>
                  <p className='min-w-28 font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300'>
                    {t('Humidity')}
                  </p>
                  <p className='font-semibold font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300'>
                    {currentdWeather[0]?.humidity}
                    <span className='font-extralight text-gray-400'>%</span>
                  </p>
                </div>

                <div className='flex flex-row'>
                  <p className='min-w-28 font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300'>
                    {t('Wind Speed')}
                  </p>
                  <p className='font-semibold font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300 flex items-center'>
                    <span>{currentdWeather[0]?.wind_speed}</span>
                    <span className='font-extralight text-gray-400'>m/s</span>
                    <ArrowUpIcon
                      className='h-6 w-6 transform font-extralight text-gray-400 ml-1'
                      style={{ transform: `rotate(${currentdWeather[0]?.wind_deg || 0}deg)` }}
                    />
                  </p>
                </div>

                <div className='flex flex-row'>
                  <p className='min-w-28 font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300'>
                    {t('Pressure')}
                  </p>
                  <p className='font-semibold font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300'>
                    {currentdWeather[0]?.pressure}
                    <span className='font-extralight text-gray-400'>hPa</span>
                  </p>
                </div>

                <div className='flex flex-row'>
                  <p className='min-w-28 font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300'>
                    {t('Visibility')}
                  </p>
                  <p className='font-semibold font-md sm:font-lg lg:font-2xl text-gray-600 dark:text-gray-300'>
                    {(currentdWeather[0]?.visibility / 1000).toFixed(1)}
                    <span className='font-extralight text-gray-400'>km</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col rounded-md border border-gray-200 dark:border-gray-600 p-4 shadow-md'>
            <h1 className='text-md text-gray-600 dark:text-gray-300'>{t('5 DAY FORECAST')}</h1>

            <div
              className='grid grid-flow-col justify-between gap-4 auto-cols-max mt-4 overflow-x-auto'
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: currentTheme === 'Dark' ? '#c4c4c4 #616362' : '#c4c4c4 #edf2ef',
              }}>
              {summaryWeather.map((data, index) => {
                return (
                  <button
                    key={index}
                    className={`flex flex-row ${
                      selectedWeather && selectedWeather === data ? 'w-76' : 'w-44'
                    } items-center rounded-md border border-gray-100 dark:border-gray-600 p-3 shadow-sm`}
                    onClick={() => setSelectedWeather(data)}>
                    <div className='flex flex-row items-center'>
                      <img
                        src={getWeatherIconUrl(data?.weather_icon)}
                        alt='Weather Icon'
                        className='w-8 sm:w-12 mr-5 ml-4'
                      />
                      <div>
                        <p className='text-sm text-left text-gray-600 dark:text-gray-300'>
                          {new Date(data?.date).toLocaleString('en-US', {
                            weekday: 'short',
                            day: 'numeric',
                          }) ===
                          new Date().toLocaleString('en-US', {
                            weekday: 'short',
                            day: 'numeric',
                          })
                            ? 'Today'
                            : new Date(data?.date).toLocaleString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                              })}
                        </p>

                        <p className='font-semibold text-sm text-left text-gray-600 dark:text-gray-300'>
                          {data?.temperature}
                          <span className='font-extralight text-gray-400'>°C</span>
                        </p>
                        <p className='font-semibold text-sm text-left text-gray-600 dark:text-gray-300'>
                          {data?.humidity}
                          <span className='font-extralight text-gray-400'>%</span>
                        </p>
                      </div>
                    </div>

                    {selectedWeather && selectedWeather === data && (
                      <div className='flex flex-row justify-end w-full'>
                        <div className='flex flex-col w-32 p-2'>
                          <p className='font-semibold text-sm text-right text-gray-400'>
                            {data?.weather_description
                              ?.split(' ')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </p>
                          <div className='flex items-center justify-end'>
                            <p className='flex flex-row font-semibold text-sm text-gray-600 dark:text-gray-300'>
                              <ArrowUpIcon
                                className='h-4 w-4 transform font-extralight text-right text-gray-400 mr-1'
                                style={{ transform: `rotate(${data?.wind_deg || 0}deg)` }}
                              />
                              <span>{data?.wind_speed}</span>
                              <span className='font-extralight text-gray-400'>m/s</span>
                            </p>
                          </div>
                          <p className='font-semibold text-sm text-right text-gray-600 dark:text-gray-300'>
                            {data?.pressure}
                            <span className='font-extralight text-gray-400'>hPa</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className='rounded-md border border-gray-100 dark:border-gray-600 p-4 shadow-md'>
            <div className='flex flex-row gap-2'>
              <button
                className={`text-sm text-gray-600 dark:text-gray-300 mb-4 hover:underline underline-offset-4 ${
                  view === 'summary' && 'underline underline-offset-4 decoration-2'
                }`}
                onClick={() => setView('summary')}>
                {t('Summary')}
              </button>
              <button
                className={`text-sm text-gray-600 dark:text-gray-300 mb-4 hover:underline underline-offset-4 ${
                  view === 'hourly' && 'underline underline-offset-4 decoration-2'
                }`}
                onClick={() => setView('hourly')}>
                {t('Hourly')}
              </button>
            </div>

            {view === 'summary' && <Chart weatherData={weatherData} />}

            {view === 'hourly' && (
              <div className='flex flex-row gap-2 max-w-full'>
                <div
                  className='flex flex-nowrap space-x-2 overflow-x-auto'
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: currentTheme === 'Dark' ? '#c4c4c4 #616362' : '#c4c4c4 #edf2ef',
                  }}>
                  {weatherData.map((data, index) => (
                    <div key={index}>
                      <div className='flex flex-col justify-center items-center w-32 h-48 rounded-sm border border-gray-200 dark:border-gray-600 px-2'>
                        <img src={getWeatherIconUrl(data?.weather_icon)} alt='Weather Icon' className='w-12 mb-2' />
                        <p className='font-semibold text-sm text-gray-600 dark:text-gray-300'>
                          {data?.temperature}
                          <span className='font-extralight text-gray-400'>°C</span>
                        </p>
                        <p className='text-sm text-gray-400 text-center'>
                          {data?.weather_description
                            ?.split(' ')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </p>
                        <p className='font-semibold text-sm text-gray-600 dark:text-gray-300'>
                          {data?.humidity}
                          <span className='font-extralight text-gray-400'>%</span>
                        </p>
                        <p className='font-semibold text-sm text-gray-600 dark:text-gray-300 flex items-center'>
                          <ArrowUpIcon
                            className='h-4 w-4 transform font-extralight text-gray-400 mr-1'
                            style={{ transform: `rotate(${data?.wind_deg || 0}deg)` }}
                          />
                          <span>{data?.wind_speed}</span>
                          <span className='font-extralight text-gray-400'>m/s</span>
                        </p>
                        <p className='font-semibold text-sm text-gray-600 dark:text-gray-300'>
                          {data?.pressure}
                          <span className='font-extralight text-gray-400'>hPa</span>
                        </p>
                      </div>

                      <p className='text-center'>
                        {data?.date && (
                          <span className='text-sm text-gray-400'>
                            {new Date(data?.date).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true,
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
