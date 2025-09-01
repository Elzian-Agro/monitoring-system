import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import HistoryWeather from './index';
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

describe('History weather component', () => {
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

  it('fetch history weather correctly and display', async () => {
    const mokedHistoryWeather = [
      {
        'ELZ-0003-01': [
          {
            timestamp: '2024-12-16T04:37:00.000Z',
            temperature: 21.1,
            humidity: 57,
            rainfall: 7634,
            wind_speed: 35,
            wind_direction: 180,
            light: 299,
          },
          {
            timestamp: '2024-12-16T04:38:00.000Z',
            temperature: 20.6,
            humidity: 42,
            rainfall: 5554,
            wind_speed: 5,
            wind_direction: 180,
            light: 292,
          },
          {
            timestamp: '2024-12-16T04:39:00.000Z',
            temperature: 31,
            humidity: 31,
            rainfall: 5191,
            wind_speed: 53,
            wind_direction: 180,
            light: 21,
          },
        ],
      },
    ];

    mockUseFetch.mockReturnValue({
      loading: false,
      response: mokedHistoryWeather,
      recall: jest.fn(),
    });

    render(
      <MemoryRouter>
        <HistoryWeather />
      </MemoryRouter>
    );

    // Check display filter options
    expect(screen.getByText('Last 24 hours')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('shows message if history weather data not available', () => {
    mockUseFetch.mockReturnValue({
      loading: false,
      response: null,
      recall: jest.fn(),
    });

    render(
      <MemoryRouter>
        <HistoryWeather />
      </MemoryRouter>
    );

    expect(screen.getByText('There are no history weather data available!')).toBeInTheDocument();
  });
});
