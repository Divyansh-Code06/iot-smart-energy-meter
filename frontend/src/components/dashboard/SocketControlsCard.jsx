// File: src/components/dashboard/SocketControlsCard.jsx
import { Plug } from 'lucide-react';
import { Card, CardLabel } from '../ui/Card';
import { Toggle } from '../ui/Toggle';

function SocketRow({ name, watts, checked, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${checked ? 'bg-emerald-50' : 'bg-gray-50'}`}>
          <Plug className={`h-[18px] w-[18px] ${checked ? 'text-emerald-600' : 'text-gray-400'}`} />
        </div>
        <div>
          <p className="text-[13.5px] font-medium text-[#111827]">{name}</p>
          <p className="text-[12px] text-gray-400">{checked ? `${watts} W · Active` : 'Off'}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={`Toggle ${name}`} />
    </div>
  );
}

export function SocketControlsCard({ sockets, onToggle }) {
  return (
    <Card className="flex flex-col">
      <CardLabel icon={Plug}>Socket Controls</CardLabel>
      <div className="flex flex-1 flex-col justify-center gap-3">
        {sockets.map((socket) => (
          <SocketRow
            key={socket.id}
            name={socket.name}
            watts={socket.watts}
            checked={socket.on}
            onChange={() => onToggle(socket.id)}
          />
        ))}
      </div>
    </Card>
  );
}
