import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import WeatherStation from './index';
import useFetch from 'hooks/useFetch';

// Mock useFetch dynamically
jest.mock('hooks/useFetch', () => jest.fn());

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

describe('Current weather component', () => {
  const mockUseFetch = useFetch;

  beforeEach(() => {
    const useSelectorMock = require('react-redux').useSelector;
    useSelectorMock.mockImplementation((selectorFn) => {
      if (selectorFn.toString().includes('state => state.user.userType')) {
        return 'admin'; // Mocking userType as 'admin'
      }
      return {};
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetch current weather correctly and display', () => {
    const mokedCurrentWeather = [
      {
        _id: '675fb087b18597a3c1be2b32',
        deviceId: 'ELZ-0003-01',
        temperature: 29.8,
        humidity: 61,
        rainfall: 7538,
        wind_speed: 31,
        wind_direction: 180,
        light: 264,
        dateTime: '2024-12-16T04:45:59.916Z',
      },
      {
        _id: '675fb087b18597a3c1be2b35',
        deviceId: 'ELZ-0003-02',
        temperature: 24.8,
        humidity: 64,
        rainfall: 7238,
        wind_speed: 35,
        wind_direction: 120,
        light: 267,
        dateTime: '2024-12-16T04:45:59.916Z',
      },
    ];

    mockUseFetch.mockReturnValue({
      loading: false,
      response: mokedCurrentWeather,
      recall: jest.fn(),
    });

    render(
      <MemoryRouter>
        <WeatherStation />
      </MemoryRouter>
    );

    // Check display data
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('29.8°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('61%')).toBeInTheDocument();
  });

  it('shows message if current weather data not available', () => {
    mockUseFetch.mockReturnValue({
      loading: false,
      response: null,
      recall: jest.fn(),
    });

    render(
      <MemoryRouter>
        <WeatherStation />
      </MemoryRouter>
    );

    expect(screen.getByText('There are no current weather data available!')).toBeInTheDocument();
  });
});
