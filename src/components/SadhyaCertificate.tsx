import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Award, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

interface SadhyaCertificateProps {
  rating: number;
  imageFile: File;
  userName?: string;
  analysisDate: Date;
}

export const SadhyaCertificate: React.FC<SadhyaCertificateProps> = ({
  rating,
  imageFile,
  userName = "Sadhya Enthusiast",
  analysisDate
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const hasShownConfetti = useRef(false);

  useEffect(() => {
    // Show confetti animation only once when certificate is first displayed
    if (!hasShownConfetti.current) {
      const showConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B35', '#F7931E', '#FFD23F', '#06D6A0', '#118AB2']
        });
      };

      // Small delay to ensure component is mounted
      const timer = setTimeout(showConfetti, 500);
      hasShownConfetti.current = true;

      return () => clearTimeout(timer);
    }
  }, []);

  const downloadCertificatePDF = async () => {
    const element = certificateRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`sadhya-excellence-certificate-${userName.replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: "Certificate Downloaded!",
        description: "Your Sadhya Excellence Certificate has been saved as PDF.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate certificate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 ${
          i < fullStars 
            ? 'text-festival-gold fill-current' 
            : i === fullStars && hasHalfStar
            ? 'text-festival-gold fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Download Button */}
      <div className="flex justify-center">
        <Button 
          variant="festival" 
          onClick={downloadCertificatePDF}
          className="hover-scale"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Certificate as PDF
        </Button>
      </div>

      {/* Certificate */}
      <div className="flex justify-center">
        <Card 
          ref={certificateRef}
          className="w-full max-w-4xl p-12 bg-gradient-to-br from-festival-yellow/20 via-white to-festival-gold/10 border-4 border-festival-gold shadow-2xl"
        >
          <div className="space-y-8 text-center">
            {/* Header with Awards */}
            <div className="flex items-center justify-center space-x-4">
              <Award className="h-12 w-12 text-festival-gold" />
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-leaf-green">
                  Certificate of Sadhya Excellence
                </h1>
                <div className="w-32 h-1 bg-festival-gold mx-auto rounded-full"></div>
              </div>
              <Award className="h-12 w-12 text-festival-gold" />
            </div>

            {/* Decorative Border */}
            <div className="border-2 border-festival-gold/30 rounded-lg p-8 bg-white/60">
              <div className="space-y-6">
                {/* Presented To */}
                <div className="space-y-2">
                  <p className="text-lg text-leaf-green font-medium">This is proudly presented to</p>
                  <h2 className="text-3xl font-bold text-festival-gold">{userName}</h2>
                </div>

                {/* Sadhya Image */}
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-festival-gold shadow-lg">
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="Analyzed Sadhya" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Certificate Text */}
                <div className="space-y-4">
                  <p className="text-lg text-leaf-green leading-relaxed max-w-2xl mx-auto">
                    This is to proudly certify that the submitted Sadhya reflects exceptional variety, 
                    balance, and cultural authenticity. Keep up the delicious tradition!
                  </p>

                  {/* Rating Display */}
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex">
                      {getRatingStars(rating)}
                    </div>
                    <Badge className="text-xl px-6 py-3 bg-festival-gold text-white font-bold">
                      Rating: {rating}/10
                    </Badge>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <p className="text-sm text-leaf-green/70">Certified on</p>
                  <p className="text-lg font-semibold text-leaf-green">
                    {formatDate(analysisDate)}
                  </p>
                </div>

                {/* Signature Line */}
                <div className="pt-6 space-y-2">
                  <div className="w-48 h-px bg-leaf-green mx-auto"></div>
                  <p className="text-sm text-leaf-green/70">Sadhya Excellence Authority</p>
                </div>
              </div>
            </div>

            {/* Footer Badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className="text-festival-gold border-festival-gold px-4 py-2">
                Authenticated Digital Certificate
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};