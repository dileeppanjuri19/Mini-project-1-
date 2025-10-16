import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SoilCard from '@/components/SoilCard';
import { soilProfiles } from '@/data/soilProfiles';
import { SoilReading } from '@/types/soil';
import { analyzeMoisture, simulateMoistureReading } from '@/utils/soilAnalysis';
import { RefreshCw, Droplets } from 'lucide-react';

const Index = () => {
  const [readings, setReadings] = useState<SoilReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const generateReadings = () => {
    setIsRefreshing(true);
    
    const newReadings = soilProfiles.map(profile => {
      const moisture = simulateMoistureReading(profile);
      const analysis = analyzeMoisture(moisture, profile);
      
      return {
        soilType: profile.type,
        moisture,
        status: analysis.status,
        recommendation: analysis.recommendation,
        lastUpdated: new Date(),
      };
    });

    setReadings(newReadings);
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    generateReadings();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(generateReadings, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex items-center gap-3">
              <Droplets className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-pulse" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Soil Moisture Dashboard
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
              Real-time monitoring of soil moisture levels across different soil types. 
              Smart recommendations for optimal plant health.
            </p>
            
            <Button
              onClick={generateReadings}
              disabled={isRefreshing}
              size="lg"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh All Sensors'}
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soilProfiles.map((profile, index) => {
            const reading = readings.find(r => r.soilType === profile.type);
            
            if (!reading) return null;
            
            return (
              <div
                key={profile.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'backwards',
                }}
              >
                <SoilCard profile={profile} reading={reading} />
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 rounded-lg bg-card border border-border">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Understanding Soil Moisture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <h3 className="font-semibold text-destructive mb-2">Too Dry</h3>
              <p className="text-muted-foreground">Below minimum threshold - immediate watering required</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <h3 className="font-semibold text-warning mb-2">Dry</h3>
              <p className="text-muted-foreground">Below optimal range - watering needed soon</p>
            </div>
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <h3 className="font-semibold text-success mb-2">Optimal</h3>
              <p className="text-muted-foreground">Perfect moisture level - maintain current schedule</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h3 className="font-semibold text-accent mb-2">Moist</h3>
              <p className="text-muted-foreground">Above optimal - reduce watering frequency</p>
            </div>
            <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <h3 className="font-semibold text-accent mb-2">Too Wet</h3>
              <p className="text-muted-foreground">Above maximum - stop watering to prevent root rot</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
