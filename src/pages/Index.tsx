import { useState } from "react";
import { Search, Play, Calendar, Users, Trophy, Mic, Radio, Star, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOpenF1Radios, useOpenF1Stats } from "@/hooks/useOpenF1Data";
import RadioFilters from "@/components/RadioFilters";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState<number | undefined>();
  const [selectedDriver, setSelectedDriver] = useState<number | undefined>();
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Buscar dados reais da API OpenF1 para 2025
  const { data: featuredRadios = [], isLoading, error } = useOpenF1Radios({
    year: 2025,
    meeting_key: selectedMeeting,
    driver_number: selectedDriver,
    limit: selectedMeeting || selectedDriver ? undefined : 12
  });
  
  const stats = useOpenF1Stats();

  const recentBlogPosts = [
    {
      id: 1,
      title: "Os 10 Rádios Mais Icônicos da História da F1",
      excerpt: "Uma análise profunda dos momentos que marcaram a Fórmula 1 através dos team radios mais memoráveis.",
      date: "15 de janeiro, 2025",
      author: "João Silva"
    },
    {
      id: 2,
      title: "A Evolução da Comunicação na F1",
      excerpt: "Como os team radios transformaram a estratégia e a narrativa das corridas ao longo das décadas.",
      date: "12 de janeiro, 2025",
      author: "Maria Santos"
    }
  ];

  const filteredRadios = featuredRadios.filter(radio =>
    radio.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    radio.pilot?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    radio.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    radio.gp?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayRadio = (radio: any) => {
    if (radio.recording_url) {
      // Se já está a tocar este rádio, pausar
      if (currentlyPlaying === radio.id && audioElement) {
        audioElement.pause();
        setCurrentlyPlaying(null);
        return;
      }

      // Se há outro áudio a tocar, pausar primeiro
      if (audioElement) {
        audioElement.pause();
      }

      // Criar novo elemento de áudio
      const audio = new Audio(radio.recording_url);
      audio.crossOrigin = "anonymous";
      
      // Event listeners
      audio.onloadstart = () => {
        console.log('Carregando áudio...');
      };
      
      audio.oncanplay = () => {
        console.log('Áudio pronto para tocar');
        audio.play().catch(error => {
          console.error('Erro ao reproduzir áudio:', error);
          setCurrentlyPlaying(null);
        });
      };
      
      audio.onplay = () => {
        setCurrentlyPlaying(radio.id);
      };
      
      audio.onended = () => {
        setCurrentlyPlaying(null);
        setAudioElement(null);
      };
      
      audio.onerror = (error) => {
        console.error('Erro ao carregar áudio:', error);
        setCurrentlyPlaying(null);
        setAudioElement(null);
      };

      setAudioElement(audio);
    } else {
      console.log('URL de gravação não disponível para este rádio');
    }
  };

  const handleClearFilters = () => {
    setSelectedMeeting(undefined);
    setSelectedDriver(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-red-900/20 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Radio className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">F1 Rádio PT</h1>
                <p className="text-red-200">Arquivo completo de team radios em português</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" className="text-white hover:text-red-400">
                Arquivo
              </Button>
              <Button variant="ghost" className="text-white hover:text-red-400">
                Blog
              </Button>
              <Button variant="ghost" className="text-white hover:text-red-400">
                Sobre
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Reviva os Momentos <span className="text-red-500">Épicos</span> de 2025
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubra e explore os team radios mais marcantes da temporada 2025 da Fórmula 1
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Pesquisar por piloto, equipa, GP ou palavras-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Mic className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalRadios}</h3>
              <p className="text-gray-300">Rádios Arquivados</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalDrivers}</h3>
              <p className="text-gray-300">Pilotos</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.totalMeetings}</h3>
              <p className="text-gray-300">Grandes Prémios</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{stats.currentYear}</h3>
              <p className="text-gray-300">Temporada Atual</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Radios */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-white">Rádios de 2025</h3>
          <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
            Ver Todos
          </Button>
        </div>

        {/* Filtros */}
        <RadioFilters
          selectedMeeting={selectedMeeting}
          selectedDriver={selectedDriver}
          onMeetingChange={setSelectedMeeting}
          onDriverChange={setSelectedDriver}
          onClearFilters={handleClearFilters}
        />

        {isLoading && (
          <div className="text-center py-12">
            <div className="text-white text-lg">Carregando rádios da API OpenF1...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 text-lg">Erro ao carregar dados da API OpenF1</div>
            <div className="text-gray-400 text-sm mt-2">Verifique sua conexão com a internet</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRadios.map((radio) => (
            <Card key={radio.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {radio.legendary && (
                        <Badge className="bg-yellow-500 text-black">
                          <Star className="h-3 w-3 mr-1" />
                          Lendário
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-red-500 text-red-400">
                        {radio.duration}
                      </Badge>
                      {currentlyPlaying === radio.id && (
                        <Badge className="bg-green-500 text-white">
                          A tocar
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-lg mb-1">{radio.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {radio.pilot} • {radio.team}
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handlePlayRadio(radio)}
                  >
                    {currentlyPlaying === radio.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-3">{radio.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-red-400 font-medium">{radio.gp}</span>
                  {radio.team_colour && (
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: `#${radio.team_colour}` }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRadios.length === 0 && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Nenhum rádio encontrado</div>
            <div className="text-gray-500 text-sm mt-2">Tente ajustar os filtros ou termos de pesquisa</div>
          </div>
        )}
      </section>

      {/* Blog Section */}
      <section className="container mx-auto px-4 py-12">
        <h3 className="text-3xl font-bold text-white mb-8">Análises e Notícias</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentBlogPosts.map((post) => (
            <Card key={post.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-xl">{post.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">{post.excerpt}</p>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                  Ler Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-red-900/20 bg-black/40 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Radio className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">F1 Rádio PT</h4>
                <p className="text-gray-400 text-sm">Preservando a história da F1</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 F1 Rádio PT. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
