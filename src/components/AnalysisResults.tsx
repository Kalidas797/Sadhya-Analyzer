import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Star, 
  Download, 
  Share2,
  Utensils,
  Heart,
  Award
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SadhyaCertificate } from '@/components/SadhyaCertificate';

export interface AnalysisResult {
  dishes: Array<{
    name: string;
    category: string;
  }>;
  missingItems: string[];
  duplicates: string[];
  rating: number;
  explanation: string;
  culturalInsight: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  imageFile: File;
  userName?: string;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, imageFile, userName }) => {
  const downloadPDF = async () => {
    const element = document.getElementById('analysis-results');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('sadhya-analysis.pdf');
      toast({
        title: "PDF Downloaded!",
        description: "Your Sadhya analysis has been saved as PDF.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareToWhatsApp = () => {
    const text = `Check out my Sadhya analysis! Rating: ${result.rating}/10 ⭐\n\nFound ${result.dishes.length} dishes on my banana leaf! 🍃\n\nAnalyzed with Sadhya Analyzer`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyResults = async () => {
    const text = `Sadhya Analysis Results
    
Rating: ${result.rating}/10 ⭐

Detected Dishes (${result.dishes.length}):
${result.dishes.map(dish => `• ${dish.name} (${dish.category})`).join('\n')}

${result.missingItems.length > 0 ? `Missing Traditional Items:
${result.missingItems.map(item => `• ${item}`).join('\n')}` : ''}

${result.duplicates.length > 0 ? `Duplicate Dishes:
${result.duplicates.map(item => `• ${item}`).join('\n')}` : ''}

Cultural Insight:
${result.culturalInsight}

Analysis:
${result.explanation}`;

    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Analysis results copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-green-600';
    if (rating >= 6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 8) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="festival" onClick={downloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" onClick={shareToWhatsApp} className="border-leaf-green text-leaf-green hover:bg-leaf-green hover:text-white">
          <Share2 className="mr-2 h-4 w-4" />
          Share on WhatsApp
        </Button>
        <Button variant="ghost" onClick={copyResults}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Results
        </Button>
      </div>

      {/* Results Container */}
      <Card id="analysis-results" className="p-8 bg-gradient-warm shadow-elegant">
        <div className="space-y-8">
          {/* Header with Rating */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Award className="h-8 w-8 text-festival-gold" />
              <h2 className="text-3xl font-bold text-leaf-green">Sadhya Analysis</h2>
              <Award className="h-8 w-8 text-festival-gold" />
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(result.rating / 2) 
                        ? 'text-festival-gold fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Badge className={`text-lg px-4 py-2 ${getRatingBadgeColor(result.rating)}`}>
                {result.rating}/10
              </Badge>
            </div>
          </div>

          <Separator className="bg-leaf-green/20" />

          {/* Detected Dishes */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Utensils className="h-5 w-5 text-leaf-green" />
              <h3 className="text-xl font-semibold text-leaf-green">
                Detected Dishes ({result.dishes.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.dishes.map((dish, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-leaf-green/20"
                >
                  <span className="font-medium text-leaf-green">{dish.name}</span>
                  <Badge variant="secondary" className="bg-festival-yellow/30 text-leaf-green">
                    {dish.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Items */}
          {result.missingItems.length > 0 && (
            <>
              <Separator className="bg-leaf-green/20" />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <h3 className="text-xl font-semibold text-leaf-green">Missing Traditional Items</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.missingItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-orange-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Duplicates */}
          {result.duplicates.length > 0 && (
            <>
              <Separator className="bg-leaf-green/20" />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Copy className="h-5 w-5 text-blue-500" />
                  <h3 className="text-xl font-semibold text-leaf-green">Duplicate Dishes</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.duplicates.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <Copy className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="text-blue-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-leaf-green/20" />

          {/* Cultural Insight */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="text-xl font-semibold text-leaf-green">Cultural Insight</h3>
            </div>
            
            <div className="p-4 bg-festival-yellow/20 rounded-lg border border-festival-gold/30">
              <p className="text-leaf-green leading-relaxed">{result.culturalInsight}</p>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="text-xl font-semibold text-leaf-green">Analysis Explanation</h3>
            </div>
            
            <div className="p-4 bg-white/60 rounded-lg border border-leaf-green/20">
              <p className="text-leaf-green leading-relaxed">{result.explanation}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Certificate Section - Only show if rating >= 7.0 */}
      {result.rating >= 7.0 && (
        <div className="space-y-6">
          <Separator className="bg-leaf-green/20" />
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-6 w-6 text-festival-gold" />
              <h2 className="text-2xl font-bold text-leaf-green">
                Congratulations! You've earned a Certificate of Excellence! 🏆
              </h2>
              <Award className="h-6 w-6 text-festival-gold" />
            </div>
            <p className="text-muted-foreground">
              Your Sadhya scored {result.rating}/10 - qualifying for our prestigious certificate!
            </p>
          </div>

          <SadhyaCertificate
            rating={result.rating}
            imageFile={imageFile}
            userName={userName || "Sadhya Enthusiast"}
            analysisDate={new Date()}
          />
        </div>
      )}
    </div>
  );
};