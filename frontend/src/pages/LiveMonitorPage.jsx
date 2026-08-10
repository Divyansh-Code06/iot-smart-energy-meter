// File: src/pages/LiveMonitorPage.jsx
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useLiveData } from '../context/LiveDataContext';
import { LiveMonitorGrid } from '../components/analytics/LiveMonitorGrid';

const CONNECTION_COPY = {
  connected: { text: 'Live', icon: Wifi, classes: 'text-emerald-600' },
  mock: { text: 'Demo data', icon: Wifi, classes: 'text-gray-400' },
  connecting: { text: 'Connecting…', icon: Loader2, classes: 'text-gray-400 animate-spin' },
  disconnected: { text: 'Disconnected', icon: WifiOff, classes: 'text-red-500' },
};

export function LiveMonitorPage() {
  const { metrics, connectionStatus, lastUpdated } = useLiveData();
  const status = CONNECTION_COPY[connectionStatus] ?? CONNECTION_COPY.disconnected;
  const StatusIcon = status.icon;

  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#111827]">Live Monitor</h1>
          <p className="mt-0.5 text-[13px] text-gray-500">
            Real-time readings from the PZEM-004T sensor, each checked against its safe operating range.
          </p>
        </div>
        <div className={`flex items-center gap-1.5 text-[13px] font-medium ${status.classes}`}>
          <StatusIcon className="h-4 w-4" />
          {status.text}
          {lastUpdated && (
            <span className="font-normal text-gray-400">
              · updated{' '}
              {new Date(lastUpdated).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </span>
          )}
        </div>
      </header>

      <LiveMonitorGrid metrics={metrics} />
    </div>
  );
}
