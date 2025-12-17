import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import DashboardPage from './index';
import { MemoryRouter } from 'react-router-dom';

const mockedResponse = [
  {
    deviceId: 'mockDevice-01',
    data: [
      {
        timestamp: '2024-06-09T12:00:00.000Z',
        temperature: 32,
        soil_moisture: 638,
        humidity: 88.6,
        gas_detection: 379,
      },
      {
        timestamp: '2024-06-10T12:00:00.000Z',
        temperature: 31,
        soil_moisture: 847,
        humidity: 43.4,
        gas_detection: 184,
      },
    ],
  },
  {
    deviceId: 'mockDevice-02',
    data: [],
  },
  {
    deviceId: 'mockDevice-03',
    data: [],
  },
];

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (key) => key,
    };
  },
}));

// Mock Redux and useAxios hook
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

jest.mock('hooks/useFetch', () => () => ({
  loading: false,
  response: mockedResponse,
  recall: jest.fn().mockReturnValue(null),
}));

describe('About US Page', () => {
  it('renders user data correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Weather Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Weather Prediction')).toBeInTheDocument();
    expect(screen.getByText('Soil Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Smart Agro Assistant')).toBeInTheDocument();

    // Check temperature chart
    // expect(screen.getByText('Temperature')).toBeInTheDocument();
    // expect(screen.getAllByText('mockDevice-01')).toHaveLength(4);

    // Check humudity chart
    // expect(screen.getByText('Humidity')).toBeInTheDocument();
    // expect(screen.getAllByText('mockDevice-01')).toHaveLength(4);
  });
});
