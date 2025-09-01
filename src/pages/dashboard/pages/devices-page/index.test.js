import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeviceManagement from './index';
import { MemoryRouter } from 'react-router-dom';
import { messages } from 'utils/constant';
import { downloadCSV } from '../../utils/download';

// Mocked device response
const mockedDevices = [
  {
    _id: '65cb9899e28e2fab066269fd',
    userId: {
      _id: '65c2717c3262b9d512f2b011',
      firstName: 'test',
      lastName: 'user',
    },
    deviceId: 'ELZ-0001-01',
    deviceType: 'monitoring-system-v1',
    deviceStatus: 'Inactive',
    isDeleted: false,
    isDisabled: false,
    deviceCreatedAt: '2024-02-13T16:28:09.451Z',
    deviceUpdatedAt: '2024-04-09T11:26:09.501Z',
    deviceDeletedAt: '2024-02-29T08:46:04.327Z',
    monitoringFactors: ['Temperature', 'Humidity', 'Soil Moisture', 'Gas Detection'],
  },
  {
    _id: '65cb99bab11a41f88ac56dce',
    userId: {
      _id: '65c2717c3262b9d512f2b011',
      firstName: 'test',
      lastName: 'user',
    },
    deviceId: 'ELZ-0001-02',
    deviceType: 'monitoring-system-v2',
    deviceStatus: 'Inactive',
    deviceDeletedAt: '2024-02-29T08:46:15.052Z',
    isDeleted: false,
    isDisabled: true,
    deviceCreatedAt: '2024-02-13T16:32:58.470Z',
    deviceUpdatedAt: '2024-04-30T09:18:01.352Z',
    monitoringFactors: ['Temperature', 'Humidity', 'Gas Detection', 'Soil Moisture'],
  },
];

// Mock user response
const mockedUsers = [
  {
    _id: '65c2717c3262b9d512f2b011',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    _id: '65c2717c3262b9d512f2b012',
    firstName: 'Jane',
    lastName: 'Smith',
  },
];

// Mock Redux
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn(),
}));

// Mock useFetch
jest.mock('hooks/useFetch', () => () => ({
  loading: false,
  response: { result: mockedDevices },
  recall: jest.fn().mockReturnValue(null),
}));

// Mock useAxios get users
jest.mock('hooks/useAxios', () => () => ({
  loading: false,
  send: jest.fn().mockResolvedValue(mockedUsers),
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Dowload button mocked
jest.mock('../../utils/download', () => ({
  downloadCSV: jest.fn(),
}));

describe('Manage Device Page', () => {
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

  // Check page render properly
  it('fetches devices on component mount', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    // Check table header
    expect(screen.getByText('DEVICE ID')).toBeInTheDocument();
    expect(screen.getByText('DEVICE TYPE')).toBeInTheDocument();

    // Check table body
    expect(screen.getByText('ELZ-0001-01')).toBeInTheDocument();
    expect(screen.getByText('monitoring-system-v1')).toBeInTheDocument();
  });

  // Check open and submit device form for the admin
  it('opens form modal when Add Device is clicked', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    // Ensure the 'Add Device' button is present
    expect(screen.getByText('Add Device')).toBeInTheDocument();

    // Simulate add device button click
    fireEvent.click(screen.getByText('Add Device'));

    // Wait for the device form to load
    await waitFor(() => {
      expect(screen.getByText('NEW DEVICE CREATION')).toBeInTheDocument();
    });

    // Simulate Submit form
    fireEvent.click(screen.getByText('Submit'));

    // Assuming an alert is shown after creating
    await waitFor(() => {
      expect(screen.getByText(messages.deviceCreated)).toBeInTheDocument();
    });
  });

  // Check not shown the add device button for farmers
  it('does not show the Add Device button for farmers', async () => {
    const useSelectorMock = require('react-redux').useSelector;
    useSelectorMock.mockImplementation((selectorFn) => {
      if (selectorFn.toString().includes('state => state.user.userType')) {
        return 'farmer';
      }
      return {};
    });

    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    // Ensure the 'Add Device' button is not present
    await waitFor(() => {
      expect(screen.queryByText('Add Device')).not.toBeInTheDocument();
    });
  });

  it('triggers download CSV on button click', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    const downloadButton = screen.getByText('Download');
    fireEvent.click(downloadButton);

    // Verify that the downloadCSV function was called
    expect(downloadCSV).toHaveBeenCalled();
  });

  it('search devices correctly', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    // Simulate typing into the search box
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ELZ-0001-01' } });

    expect(screen.getByText('ELZ-0001-01')).toBeInTheDocument();
    expect(screen.queryByText('ELZ-0001-02')).not.toBeInTheDocument();
  });

  it('displays a no results message when the search fields no matches', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    // Simulate typing into the search box
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ELZ-0001-05' } });

    expect(screen.getByText('There are no records to display')).toBeInTheDocument();
  });

  it('shows confirmation modal on delete and deletes user on confirm', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    // Click the delete button of the first device
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      // Check if the confirmation modal is displayed
      expect(screen.getByText('Are you sure want to delete?')).toBeInTheDocument();
    });

    // Simulate device confirming the deletion
    fireEvent.click(screen.getByText('YES'));

    await waitFor(() => {
      // Assuming an alert is shown after deletion
      expect(screen.getByText('Device deleted successfully')).toBeInTheDocument();
    });
  });

  it('shows confirmation modal on disable and disable device on confirm', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );

    // Click the desable button of the first device
    const deleteButtons = screen.getAllByText('Disable');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      // Check if the confirmation modal is displayed
      expect(screen.getByText('Are you sure you want to disable?')).toBeInTheDocument();
    });

    // Simulate device confirming the deletion
    fireEvent.click(screen.getByText('YES'));

    await waitFor(() => {
      // Assuming an alert is shown after deletion
      expect(screen.getByText('Device disabled successfully')).toBeInTheDocument();
    });
  });

  it('opens edit form with selected device data on Edit button click and edits device data on confirm', async () => {
    render(
      <MemoryRouter>
        <DeviceManagement />
      </MemoryRouter>
    );
    // Assuming your users are rendered and there is an "Edit" button for each
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons[0]).toBeInTheDocument();

    // Simulate clicking the first "Edit" button
    fireEvent.click(editButtons[0]);

    // Simulate Update button click
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Device updated successfully')).toBeInTheDocument();
    });
  });
});
