import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import WeatherStation from './index';

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

describe('Weather Station Page', () => {
  // Check page render properly
  it('page render correctly', async () => {
    render(
      <MemoryRouter>
        <WeatherStation />
      </MemoryRouter>
    );

    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check current weather component
    expect(screen.getByText('CURRENT WEATHER')).toBeInTheDocument();
    expect(screen.getByText(currentTime)).toBeInTheDocument();

    // Check history weather component
    expect(screen.getByText('HISTORY WEATHER')).toBeInTheDocument();
  });
});
