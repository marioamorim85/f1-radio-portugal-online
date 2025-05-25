
export interface TeamRadio {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  recording_url: string;
}

export interface Driver {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
}

export interface Meeting {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
}

const BASE_URL = 'https://api.openf1.org/v1';

export const openF1Api = {
  // Buscar team radios
  async getTeamRadios(params?: {
    driver_number?: number;
    meeting_key?: number;
    session_key?: number;
  }): Promise<TeamRadio[]> {
    const searchParams = new URLSearchParams();
    if (params?.driver_number) searchParams.append('driver_number', params.driver_number.toString());
    if (params?.meeting_key) searchParams.append('meeting_key', params.meeting_key.toString());
    if (params?.session_key) searchParams.append('session_key', params.session_key.toString());
    
    const response = await fetch(`${BASE_URL}/team_radio?${searchParams}`);
    if (!response.ok) throw new Error('Erro ao buscar team radios');
    return response.json();
  },

  // Buscar pilotos
  async getDrivers(params?: {
    driver_number?: number;
    meeting_key?: number;
    session_key?: number;
  }): Promise<Driver[]> {
    const searchParams = new URLSearchParams();
    if (params?.driver_number) searchParams.append('driver_number', params.driver_number.toString());
    if (params?.meeting_key) searchParams.append('meeting_key', params.meeting_key.toString());
    if (params?.session_key) searchParams.append('session_key', params.session_key.toString());
    
    const response = await fetch(`${BASE_URL}/drivers?${searchParams}`);
    if (!response.ok) throw new Error('Erro ao buscar pilotos');
    return response.json();
  },

  // Buscar reuniões/GPs
  async getMeetings(params?: {
    meeting_key?: number;
    year?: number;
    country_name?: string;
  }): Promise<Meeting[]> {
    const searchParams = new URLSearchParams();
    if (params?.meeting_key) searchParams.append('meeting_key', params.meeting_key.toString());
    if (params?.year) searchParams.append('year', params.year.toString());
    if (params?.country_name) searchParams.append('country_name', params.country_name);
    
    const response = await fetch(`${BASE_URL}/meetings?${searchParams}`);
    if (!response.ok) throw new Error('Erro ao buscar reuniões');
    return response.json();
  },

  // Buscar dados combinados para exibição
  async getRadiosWithDetails(params?: {
    year?: number;
    meeting_key?: number;
    driver_number?: number;
    limit?: number;
  }): Promise<any[]> {
    try {
      console.log('Buscando team radios da API OpenF1 para 2025...');
      
      // Primeiro, buscar as reuniões do ano atual ou especificado
      const meetings = await this.getMeetings({ 
        year: params?.year || 2025 
      });
      
      if (meetings.length === 0) return [];
      
      // Se meeting_key específico foi fornecido, usar apenas esse
      const targetMeetings = params?.meeting_key 
        ? meetings.filter(m => m.meeting_key === params.meeting_key)
        : meetings.slice(-5); // Últimas 5 reuniões
      
      const allRadios = [];
      
      for (const meeting of targetMeetings) {
        try {
          // Buscar radios para esta reunião
          const radioParams: any = { meeting_key: meeting.meeting_key };
          if (params?.driver_number) {
            radioParams.driver_number = params.driver_number;
          }
          
          const radios = await this.getTeamRadios(radioParams);
          
          // Buscar pilotos para esta reunião
          const drivers = await this.getDrivers({ 
            meeting_key: meeting.meeting_key 
          });
          
          // Combinar dados
          const radiosWithDetails = radios.map(radio => {
            const driver = drivers.find(d => d.driver_number === radio.driver_number);
            return {
              id: `${radio.meeting_key}-${radio.session_key}-${radio.driver_number}-${radio.date}`,
              title: `Rádio de ${driver?.full_name || 'Piloto'} - ${meeting.meeting_name}`,
              pilot: driver?.full_name || 'Piloto Desconhecido',
              team: driver?.team_name || 'Equipa Desconhecida',
              gp: meeting.meeting_name,
              duration: '0:30', // A API não fornece duração, usar placeholder
              legendary: Math.random() > 0.7, // Marcar alguns como lendários aleatoriamente
              description: `Team radio do ${driver?.full_name || 'piloto'} durante ${meeting.meeting_name}`,
              date: radio.date,
              recording_url: radio.recording_url,
              driver_number: radio.driver_number,
              team_colour: driver?.team_colour || '#000000'
            };
          });
          
          allRadios.push(...radiosWithDetails);
        } catch (error) {
          console.error(`Erro ao buscar dados para reunião ${meeting.meeting_key}:`, error);
        }
      }
      
      // Limitar resultados se especificado
      const limitedRadios = params?.limit 
        ? allRadios.slice(0, params.limit)
        : allRadios;
      
      console.log(`Encontrados ${limitedRadios.length} team radios`);
      return limitedRadios;
      
    } catch (error) {
      console.error('Erro ao buscar dados da API OpenF1:', error);
      return [];
    }
  }
};
