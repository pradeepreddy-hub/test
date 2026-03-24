export function buildPrompts(data) {
  const commonContext = `Business type: ${data.businessType}
Business name: ${data.businessName}
Location: ${data.location}
Product/service: ${data.description}
Offer/price: ${data.offer || 'Not provided'}
Target audience: ${data.targetAudience || 'General local audience'}
Language: ${data.language}`;

  return {
    whatsapp: `Generate a WhatsApp promotional message for a ${data.businessType} in ${data.location} selling ${data.description} with offer ${
      data.offer || 'not specified'
    }. Keep it simple, friendly, direct, easy to forward, and include suitable emojis. Max 80 words.\n${commonContext}`,
    instagram: `Generate an Instagram caption for the same business. Start with a catchy opening line, keep it short, add a clear CTA, and include 5-8 relevant hashtags.\n${commonContext}`,
    linkedin: `Generate a LinkedIn post for the same business. Use a professional, storytelling style for business audience. Mention local impact and trust. Max 140 words.\n${commonContext}`
  };
}

export function normalizeGeneratedResponse(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid model output shape.');
  }

  const candidate = input;
  const whatsapp = toStringOrThrow(candidate.whatsapp, 'whatsapp');
  const instagram = toStringOrThrow(candidate.instagram, 'instagram');
  const linkedin = toStringOrThrow(candidate.linkedin, 'linkedin');

  return {
    whatsapp: whatsapp.trim(),
    instagram: instagram.trim(),
    linkedin: linkedin.trim()
  };
}

export function buildFallbackContent(data) {
  const offerText = data.offer ? ` ${localized(data.language, 'Offer')}: ${data.offer}.` : '';
  const audienceText = data.targetAudience ? ` ${localized(data.language, 'PerfectFor')} ${data.targetAudience}.` : '';

  if (data.language === 'Hindi') {
    return {
      whatsapp: `🌟 ${data.location} में ${data.businessName}! हम ${data.description} प्रदान करते हैं।${offerText}${audienceText} अधिक जानकारी और बुकिंग के लिए अभी संदेश करें। 📲`,
      instagram: `✨ ${data.location} का भरोसेमंद नाम: ${data.businessName}\n${data.description}.${offerText}\nअभी DM करें।\n#${slugTag(data.location)} #LocalBusiness #SupportLocal #SmallBusiness #ShopLocal`,
      linkedin: `${data.businessName} (${data.location}) में हमारा लक्ष्य ${data.description} के माध्यम से स्थानीय समुदाय की सेवा करना है। ${
        data.offer ? `इस समय हमारा ऑफर है: ${data.offer}. ` : ''
      }हम मानते हैं कि भरोसा, गुणवत्ता और निरंतर सेवा ही स्थानीय व्यवसाय को बढ़ाती है। जुड़ने के लिए स्वागत है।`
    };
  }

  if (data.language === 'Kannada') {
    return {
      whatsapp: `🌟 ${data.location} ನಲ್ಲಿ ${data.businessName}! ನಾವು ${data.description} ನೀಡುತ್ತೇವೆ.${offerText}${audienceText} ವಿವರಗಳು ಮತ್ತು ಬುಕ್ಕಿಂಗ್‌ಗಾಗಿ ಇಂದೇ ಸಂದೇಶಿಸಿ. 📲`,
      instagram: `✨ ${data.location}ಯಲ್ಲಿ ${data.businessName}\n${data.description}.${offerText}\nಇನ್ನಷ್ಟು ಮಾಹಿತಿಗೆ DM ಮಾಡಿ.\n#${slugTag(data.location)} #LocalBusiness #SupportLocal #SmallBusiness #ShopLocal`,
      linkedin: `${data.location} ನಲ್ಲಿ ಇರುವ ${data.businessName} ನಮ್ಮ ಸಮುದಾಯಕ್ಕೆ ${data.description} ಮೂಲಕ ಮೌಲ್ಯ ನೀಡಲು ಕಟಿಬದ್ಧವಾಗಿದೆ. ${
        data.offer ? `ಪ್ರಸ್ತುತ ವಿಶೇಷ ಆಫರ್: ${data.offer}. ` : ''
      }ಗುಣಮಟ್ಟ, ವಿಶ್ವಾಸ ಮತ್ತು ದೀರ್ಘಕಾಲಿಕ ಸಂಬಂಧಗಳೇ ಸ್ಥಳೀಯ ಬೆಳವಣಿಗೆಯ ಆಧಾರ ಎಂದು ನಾವು ನಂಬುತ್ತೇವೆ.`
    };
  }

  return {
    whatsapp: `🌟 ${data.businessName} in ${data.location}! We offer ${data.description}.${offerText}${audienceText} Message us today for quick details and booking. 📲`,
    instagram: `✨ Discover ${data.businessName}, ${data.location}!\n${data.description}.${offerText}\nDM now for details.\n#${slugTag(data.location)} #LocalBusiness #SupportLocal #SmallBusiness #ShopLocal`,
    linkedin: `At ${data.businessName} (${data.location}), we are focused on serving our community through ${data.description}. ${
      data.offer ? `This season we are offering ${data.offer}. ` : ''
    }We believe local businesses grow when quality, trust, and customer relationships come first. If you are looking for dependable local partners, we would love to connect.`
  };
}

export function localized(language, key) {
  const dictionary = {
    English: { Offer: 'Offer', PerfectFor: 'Perfect for' },
    Hindi: { Offer: 'ऑफर', PerfectFor: 'उपयुक्त' },
    Kannada: { Offer: 'ಆಫರ್', PerfectFor: 'ಯಾರಿಗೆ ಸೂಕ್ತ' }
  };

  return dictionary[language][key];
}

export function slugTag(input) {
  return input.replace(/\s+/g, '');
}

function toStringOrThrow(value, key) {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${key} output.`);
  }

  return value;
}
