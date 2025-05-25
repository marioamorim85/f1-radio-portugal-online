
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOpenF1Meetings, useOpenF1Drivers } from "@/hooks/useOpenF1Data";
import { Filter, X } from "lucide-react";

interface RadioFiltersProps {
  selectedMeeting?: number;
  selectedDriver?: number;
  onMeetingChange: (meetingKey?: number) => void;
  onDriverChange: (driverNumber?: number) => void;
  onClearFilters: () => void;
}

const RadioFilters = ({ 
  selectedMeeting, 
  selectedDriver, 
  onMeetingChange, 
  onDriverChange, 
  onClearFilters 
}: RadioFiltersProps) => {
  const { data: meetings = [], isLoading: loadingMeetings } = useOpenF1Meetings(2025);
  const { data: drivers = [], isLoading: loadingDrivers } = useOpenF1Drivers(selectedMeeting);

  const hasActiveFilters = selectedMeeting || selectedDriver;

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar Filtros
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Grande Prémio
            </label>
            <Select 
              value={selectedMeeting?.toString() || ""} 
              onValueChange={(value) => onMeetingChange(value ? parseInt(value) : undefined)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={loadingMeetings ? "Carregando..." : "Todos os GPs"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Grandes Prémios</SelectItem>
                {meetings.map((meeting) => (
                  <SelectItem key={meeting.meeting_key} value={meeting.meeting_key.toString()}>
                    {meeting.meeting_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Piloto
            </label>
            <Select 
              value={selectedDriver?.toString() || ""} 
              onValueChange={(value) => onDriverChange(value ? parseInt(value) : undefined)}
              disabled={!selectedMeeting}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={
                  !selectedMeeting ? "Escolha um GP primeiro" : 
                  loadingDrivers ? "Carregando..." : 
                  "Todos os pilotos"
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Pilotos</SelectItem>
                {drivers.map((driver) => (
                  <SelectItem key={driver.driver_number} value={driver.driver_number.toString()}>
                    {driver.full_name} ({driver.name_acronym})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RadioFilters;
