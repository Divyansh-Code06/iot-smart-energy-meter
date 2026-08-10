// File: src/components/layout/Header.jsx
import { useRef, useState } from 'react';
import { Menu, Bell, MoreVertical, User, Info, Settings as SettingsIcon, LogOut, Zap, AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useLiveData } from '../../context/LiveDataContext';
import { useAlerts } from '../../context/AlertsContext';

const BOARD_STATUS_COPY = {
  connected: { text: 'Board: Online', dotClass: 'bg-emerald-500', pulse: true },
  mock: { text: 'Board: Online (demo data)', dotClass: 'bg-emerald-500', pulse: true },
  connecting: { text: 'Board: Connecting…', dotClass: 'bg-amber-400', pulse: true },
  disconnected: { text: 'Board: Offline', dotClass: 'bg-red-500', pulse: false },
};

const ALERT_ICON = { warning: AlertTriangle, critical: ShieldAlert, resolved: ShieldCheck };
const ALERT_COLOR = { warning: 'text-amber-500', critical: 'text-red-500', resolved: 'text-emerald-500' };

export function Header({ onToggleSidebar }) {
  const { connectionStatus } = useLiveData();
  const { alerts, unreadCount, markAllRead } = useAlerts();

  const [kebabOpen, setKebabOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const kebabRef = useRef(null);
  const notifRef = useRef(null);
  useClickOutside(kebabRef, () => setKebabOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));

  const boardStatus = BOARD_STATUS_COPY[connectionStatus] ?? BOARD_STATUS_COPY.disconnected;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white/95 px-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <Zap className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#111827]">SMART METER</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="mr-2 hidden items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 sm:flex">
          <span className="relative flex h-2 w-2">
            {boardStatus.pulse && (
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${boardStatus.dotClass}`} />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${boardStatus.dotClass}`} />
          </span>
          {boardStatus.text}
        </div>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              const opening = !notifOpen;
              setNotifOpen(opening);
              setKebabOpen(false);
              if (opening) markAllRead();
            }}
            aria-label="Alerts"
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors
              ${notifOpen ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <Bell className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
              <div className="border-b border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#111827]">Safety Alerts</div>
              {alerts.length === 0 ? (
                <p className="px-4 py-6 text-center text-[13px] text-gray-400">No alerts yet — watching live readings.</p>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {alerts.map((a) => {
                    const Icon = ALERT_ICON[a.level];
                    return (
                      <li key={a.id} className="flex gap-2.5 border-b border-gray-50 px-4 py-3 last:border-0">
                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${ALERT_COLOR[a.level]}`} />
                        <div>
                          <p className="text-[13px] leading-snug text-[#111827]">{a.message}</p>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            {new Date(a.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={kebabRef}>
          <button
            type="button"
            onClick={() => { setKebabOpen((v) => !v); setNotifOpen(false); }}
            className="ml-1 flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-gray-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111827] text-xs font-semibold text-white">DV</div>
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
          {kebabOpen && (
            <div className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-lg">
              {[
                { label: 'Profile', icon: User },
                { label: 'Account Information', icon: Info },
                { label: 'App Settings', icon: SettingsIcon },
              ].map((item) => (
                <button key={item.label} type="button" className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-[#111827] hover:bg-gray-50">
                  <item.icon className="h-4 w-4 text-gray-400" />
                  {item.label}
                </button>
              ))}
              <div className="my-1 border-t border-gray-100" />
              <button type="button" className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
