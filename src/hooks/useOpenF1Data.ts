
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { openF1Api } from '@/services/openF1Api';

export const useOpenF1Radios = (params?: {
  year?: number;
  meeting_key?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['openf1-radios', params],
    queryFn: () => openF1Api.getRadiosWithDetails(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    retryDelay: 1000,
  });
};

export const useOpenF1Stats = () => {
  const [stats, setStats] = useState({
    totalRadios: 0,
    totalDrivers: 0,
    totalMeetings: 0,
    currentYear: 2024
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Buscando estatísticas da API OpenF1...');
        
        // Buscar reuniões de 2024
        const meetings = await openF1Api.getMeetings({ year: 2024 });
        
        // Buscar pilotos únicos
        const driversSet = new Set();
        let totalRadios = 0;
        
        // Para cada reunião, contar radios e pilotos únicos
        for (const meeting of meetings.slice(0, 3)) { // Limitar para não sobrecarregar
          try {
            const radios = await openF1Api.getTeamRadios({ 
              meeting_key: meeting.meeting_key 
            });
            const drivers = await openF1Api.getDrivers({ 
              meeting_key: meeting.meeting_key 
            });
            
            totalRadios += radios.length;
            drivers.forEach(driver => driversSet.add(driver.driver_number));
          } catch (error) {
            console.error(`Erro ao buscar estatísticas para reunião ${meeting.meeting_key}:`, error);
          }
        }
        
        setStats({
          totalRadios,
          totalDrivers: driversSet.size,
          totalMeetings: meetings.length,
          currentYear: 2024
        });
        
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        // Manter valores padrão em caso de erro
      }
    };

    fetchStats();
  }, []);

  return stats;
};
