import { AnalysisResult } from '@/components/AnalysisResults';

const GEMINI_API_KEY = 'AIzaSyDcfEMytFfNxb-XGzO-w-qeEt76OlRTZO0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export class GeminiService {
  private async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix to get just the base64 data
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async analyzeSadhyaImage(imageFile: File): Promise<AnalysisResult> {
    try {
      const base64Image = await this.convertImageToBase64(imageFile);
      
      const prompt = `Analyze this traditional Kerala Sadhya (banana leaf meal) image and provide a detailed analysis in JSON format. 

Please analyze the image and return a JSON response with the following structure:
{
  "dishes": [
    {"name": "dish name", "category": "curry/thoran/pachadi/pickle/payasam/rice/other"}
  ],
  "missingItems": ["list of traditional Onam Sadhya items that are typically expected but not visible"],
  "duplicates": ["list of any dishes that appear multiple times"],
  "rating": number from 1-10,
  "explanation": "detailed explanation of the rating based on variety, visual appeal, completeness, and balance",
  "culturalInsight": "interesting cultural or nutritional insight about this meal or its components"
}

Traditional Onam Sadhya typically includes: Rice, Sambar, Rasam, Parippu, Avial, Thoran, Pachadi, Kichadi, Kootu, Olan, Erissery, Pulissery, Pickles (Upperi), Papadam, Banana chips, Payasam varieties, and other traditional items.

Rate based on:
- Variety of items (more diverse dishes = higher score)
- Visual appeal (colorful, well-presented = higher score) 
- Completeness (presence of traditional essential items = higher score)
- Balance between curries, sweets, sides, and accompaniments

Be encouraging but honest in your assessment. Focus on celebrating the cultural aspects while providing constructive insights.`;

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: imageFile.type,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        }
      };

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }

      const analysisResult = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!analysisResult.dishes || !Array.isArray(analysisResult.dishes)) {
        throw new Error('Invalid analysis result structure');
      }

      return {
        dishes: analysisResult.dishes || [],
        missingItems: analysisResult.missingItems || [],
        duplicates: analysisResult.duplicates || [],
        rating: Math.min(10, Math.max(1, analysisResult.rating || 5)),
        explanation: analysisResult.explanation || 'Analysis completed successfully.',
        culturalInsight: analysisResult.culturalInsight || 'This is a beautiful representation of Kerala\'s rich culinary tradition.'
      };

    } catch (error) {
      console.error('Error analyzing Sadhya image:', error);
      
      // Return a fallback response instead of throwing
      return {
        dishes: [
          { name: "Rice", category: "rice" },
          { name: "Sambar", category: "curry" },
          { name: "Rasam", category: "curry" }
        ],
        missingItems: ["Analysis incomplete - please try again"],
        duplicates: [],
        rating: 5,
        explanation: "Unable to complete full analysis due to technical issues. Please ensure your image is clear and try again.",
        culturalInsight: "Sadhya is a traditional feast that represents the cultural richness of Kerala, typically served during Onam celebrations."
      };
    }
  }
}

export const geminiService = new GeminiService();