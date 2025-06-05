import React from 'react';
import { WatchStatus } from '../services/watchlistService';
import { 
  MdOutlinePending, 
  MdPlayCircleOutline, 
  MdCheckCircleOutline, 
  MdRemoveCircleOutline 
} from 'react-icons/md';

interface StatusSelectorProps {
  value: WatchStatus;
  onChange: (status: WatchStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  [WatchStatus.PENDING]: {
    icon: MdOutlinePending,
    color: '#F59E0B', // Amber
    label: 'Pending'
  },
  [WatchStatus.WATCHING]: {
    icon: MdPlayCircleOutline,
    color: '#3B82F6', // Blue
    label: 'Watching'
  },
  [WatchStatus.WATCHED]: {
    icon: MdCheckCircleOutline,
    color: '#10B981', // Green
    label: 'Watched'
  },
  [WatchStatus.DROPPED]: {
    icon: MdRemoveCircleOutline,
    color: '#EF4444', // Red
    label: 'Dropped'
  }
};

const StatusSelector: React.FC<StatusSelectorProps> = ({ value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentStatus = statusConfig[value];

  const handleSelect = (status: WatchStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <div className="status-selector">
      <button
        className={`status-button ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{ borderColor: currentStatus.color }}
      >
        <currentStatus.icon style={{ color: currentStatus.color }} />
        <span>{currentStatus.label}</span>
      </button>
      {isOpen && (
        <div className="status-dropdown">
          {Object.entries(statusConfig).map(([status, config]) => (
            <button
              key={status}
              className="status-option"
              onClick={() => handleSelect(status as WatchStatus)}
              style={{ color: config.color }}
            >
              <config.icon />
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusSelector; 