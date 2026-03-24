export type BusinessType = 'Hotel' | 'Agriculture' | 'Shop' | 'Service';
export type LanguageOption = 'English' | 'Hindi' | 'Kannada';

export type FormDataShape = {
  businessType: BusinessType;
  businessName: string;
  location: string;
  description: string;
  offer: string;
  targetAudience: string;
  language: LanguageOption;
};

export type GeneratedContent = {
  whatsapp: string;
  instagram: string;
  linkedin: string;
};
