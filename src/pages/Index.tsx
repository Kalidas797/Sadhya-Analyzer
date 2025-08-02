import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Leaf, User } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResults, AnalysisResult } from '@/components/AnalysisResults';
import { geminiService } from '@/services/geminiService';
import { toast } from '@/hooks/use-toast';
import sadhyaHero from '@/assets/sadhya-hero.jpg';
import bananaLeafBg from '@/assets/banana-leaf-bg.jpg';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setAnalysisResult(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select a Sadhya image to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await geminiService.analyzeSadhyaImage(selectedImage);
      setAnalysisResult(result);
      
      toast({
        title: "Analysis Complete!",
        description: `Your Sadhya received a ${result.rating}/10 rating!`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze your Sadhya. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 z-0"
        style={{
          backgroundImage: `url(${bananaLeafBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="text-center py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Leaf className="h-10 w-10 text-leaf-green animate-leaf-sway" />
              <h1 className="text-4xl md:text-6xl font-bold text-leaf-green">
                Sadhya Analyzer
              </h1>
              <Sparkles className="h-10 w-10 text-festival-gold animate-pulse" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              AI-powered analysis of your traditional Kerala banana leaf feast
            </p>
            
            {/* Hero Image */}
            <div className="max-w-2xl mx-auto mb-8">
              <img
                src={sadhyaHero}
                alt="Traditional Onam Sadhya"
                className="w-full h-64 md:h-80 object-cover rounded-xl shadow-festival"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 pb-12">
          <div className="space-y-8">
            {/* Upload Section */}
            <div className="space-y-6">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                isAnalyzing={isAnalyzing}
              />

              {/* User Name Input */}
              {selectedImage && !analysisResult && (
                <Card className="p-6 bg-gradient-warm shadow-elegant">
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-leaf-green" />
                      <Label htmlFor="userName" className="text-leaf-green font-medium">
                        Your Name (for certificate)
                      </Label>
                    </div>
                    <Input
                      id="userName"
                      type="text"
                      placeholder="Enter your name..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="border-leaf-green/30 focus:border-leaf-green"
                    />
                    <p className="text-sm text-muted-foreground">
                      Optional: This will appear on your certificate if you score 7+ ⭐
                    </p>
                  </div>
                </Card>
              )}

              {/* Analyze Button */}
              {selectedImage && !analysisResult && (
                <div className="text-center">
                  <Button
                    variant="analyze"
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    size="lg"
                    className="shadow-festival hover:shadow-leaf"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Analyzing Your Sadhya...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        Analyze My Sadhya
                      </>
                    )}
                  </Button>
                  
                  {isAnalyzing && (
                    <p className="mt-4 text-muted-foreground animate-pulse">
                      Our AI is examining each dish on your banana leaf... ✨
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Results Section */}
            {analysisResult && selectedImage && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-leaf-green mb-4">
                    Your Sadhya Analysis is Ready! 🎉
                  </h2>
                  <Button
                    variant="outline"
                    onClick={resetAnalysis}
                    className="border-leaf-green text-leaf-green hover:bg-leaf-green hover:text-white"
                  >
                    Analyze Another Sadhya
                  </Button>
                </div>
                
                <AnalysisResults
                  result={analysisResult}
                  imageFile={selectedImage}
                  userName={userName || "Sadhya Enthusiast"}
                />
              </div>
            )}

            {/* Features Section */}
            {!selectedImage && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="p-6 bg-gradient-warm shadow-elegant text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-leaf-green/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-leaf-green" />
                  </div>
                  <h3 className="font-semibold text-leaf-green mb-2">AI-Powered Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced computer vision identifies each dish and categorizes them traditionally
                  </p>
                </Card>

                <Card className="p-6 bg-gradient-warm shadow-elegant text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-festival-gold/20 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-festival-gold" />
                  </div>
                  <h3 className="font-semibold text-leaf-green mb-2">Cultural Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about the cultural significance and nutritional value of your meal
                  </p>
                </Card>

                <Card className="p-6 bg-gradient-warm shadow-elegant text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                    <svg className="h-6 w-6 text-leaf-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-leaf-green mb-2">Completeness Check</h3>
                  <p className="text-sm text-muted-foreground">
                    Get feedback on traditional items and suggestions for the perfect Sadhya
                  </p>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
