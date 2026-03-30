import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      nav: {
        properties: "Nos Biens",
        agency: "L'Agence",
        contact: "Contact",
        admin: "Admin"
      },
      home: {
        hero: {
          badge: "Conciergerie d'Excellence à Agadir",
          title_part1: "Trouvez votre",
          title_italic: "Dweera",
          title_part2: "idéale avec Krilia.",
          subtitle: "Des séjours d'exception sur la côte atlantique. Évadez-vous dans un confort absolu."
        },
        search: {
          location_label: "Destination",
          location_placeholder: "Marina, Taghazout, Centre...",
          price_label: "Budget Max",
          price_unit: "Dhs"
        },
        timeline: {
          title: "Le Standard Krilia",
          subtitle: "De votre clic de réservation jusqu'à votre départ, nous avons repensé chaque détail pour vous garantir une sérénité absolue.",
          step1_title: "1. La Réservation",
          step1_desc: "Validation instantanée. Votre guide numérique Krilia et les instructions d'accès vous sont envoyés directement sur WhatsApp.",
          step2_title: "2. L'Accueil VIP",
          step2_desc: "Un membre de notre équipe vous attend sur place. Accueil chaleureux, remise des clés en main propre et visite de votre Dweera.",
          step3_title: "3. Le Séjour",
          step3_desc: "Une conciergerie privée à un message WhatsApp de distance. Profitez de l'océan, on s'occupe de tous les détails."
        },
        collection: {
          title: "Notre Collection",
          subtitle: "Sélectionnés pour leur design et leur emplacement.",
          results: "résultat",
          no_results: "Aucun bien ne correspond à vos envies.",
          reset_btn: "Voir tout le catalogue",
          view_btn: "Découvrir ce bien",
          loading: "Ouverture des portes..."
        }
      },
      footer: {
        description: "L'art de recevoir à Agadir. Krilia sélectionne pour vous des appartements d'exception pour des séjours mémorables sur la côte atlantique.",
        useful_links: "Liens Utiles",
        all_properties: "Tous nos biens",
        booking_terms: "Conditions de réservation",
        legal: "Mentions légales",
        owner_space: "Espace Propriétaire",
        contact_us: "Contactez-nous",
        address: "80000 Agadir, Maroc",
        rights: "Tous droits réservés.",
        developed_by: "Développé par",
        whatsapp_tooltip: "Une question ?"
      }
    }
  },
  en: {
    translation: {
      nav: {
        properties: "Properties",
        agency: "The Agency",
        contact: "Contact",
        admin: "Admin"
      },
      home: {
        hero: {
          badge: "Premium Concierge in Agadir",
          title_part1: "Find your",
          title_italic: "Perfect Dweera",
          title_part2: "with Krilia.",
          subtitle: "Exceptional stays on the Atlantic coast. Escape in absolute comfort."
        },
        search: {
          location_label: "Destination",
          location_placeholder: "Marina, Taghazout, Center...",
          price_label: "Max Budget",
          price_unit: "Dhs"
        },
        timeline: {
          title: "The Krilia Standard",
          subtitle: "From booking to departure, we've redesigned every detail to ensure absolute peace of mind.",
          step1_title: "1. Booking",
          step1_desc: "Instant validation. Your Krilia digital guide and access instructions are sent directly via WhatsApp.",
          step2_title: "2. VIP Welcome",
          step2_desc: "A team member meets you on-site. Warm welcome, hand-to-hand key exchange, and a tour of your Dweera.",
          step3_title: "3. The Stay",
          step3_desc: "A private concierge just one WhatsApp message away. Enjoy the ocean, we handle the rest."
        },
        collection: {
          title: "Our Collection",
          subtitle: "Selected for their design and location.",
          results: "result",
          no_results: "No properties match your criteria.",
          reset_btn: "View all catalog",
          view_btn: "Discover property",
          loading: "Opening doors..."
        }
      },
      footer: {
        description: "The art of hosting in Agadir. Krilia selects exceptional apartments for memorable stays on the Atlantic coast.",
        useful_links: "Useful Links",
        all_properties: "All our properties",
        booking_terms: "Booking Terms",
        legal: "Legal Notice",
        owner_space: "Owner Area",
        contact_us: "Contact Us",
        address: "80000 Agadir, Morocco",
        rights: "All rights reserved.",
        developed_by: "Developed by",
        whatsapp_tooltip: "Any questions?"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        properties: "عقاراتنا",
        agency: "الوكالة",
        contact: "اتصل بنا",
        admin: "الإدارة"
      },
      home: {
        hero: {
          badge: "خدمات كونسيرج فاخرة في أكادير",
          title_part1: "ابحث عن",
          title_italic: "الدويرة",
          title_part2: "المثالية مع كري ليا.",
          subtitle: "إقامات استثنائية على ساحل المحيط الأطلسي. استمتع براحة مطلقة."
        },
        search: {
          location_label: "الوجهة",
          location_placeholder: "المارينا، تغازوت، وسط المدينة...",
          price_label: "الميزانية القصوى",
          price_unit: "درهم"
        },
        timeline: {
          title: "معايير كري ليا",
          subtitle: "من لحظة الحجز حتى مغادرتكم، قمنا بإعادة ابتكار كل التفاصيل لضمان راحة بالكم المطلقة.",
          step1_title: "1. الحجز",
          step1_desc: "تأكيد فوري. نرسل لكم دليل كري ليا الرقمي وتعليمات الوصول مباشرة عبر الواتساب.",
          step2_title: "2. استقبال ملكي",
          step2_desc: "أحد أعضاء فريقنا سيكون في استقبالكم. ترحيب حار، تسليم المفاتيح يدًا بيد وجولة في دويرتكم.",
          step3_title: "3. الإقامة",
          step3_desc: "خدمة كونسيرج خاصة رهن إشارتكم عبر رسالة واتساب. استمتعوا بالبحر، ونحن نتكفل بالباقي."
        },
        collection: {
          title: "مجموعتنا",
          subtitle: "مختارة بعناية لتصميمها وموقعها المتميز.",
          results: "نتيجة",
          no_results: "لا توجد عقارات تطابق بحثكم.",
          reset_btn: "عرض الكتالوج كاملاً",
          view_btn: "اكتشف العقار",
          loading: "جارٍ فتح الأبواب..."
        }
      },
      footer: {
        description: "فن الضيافة في أكادير. تختار لكم كري ليا شققاً استثنائية لإقامات لا تُنسى على ساحل المحيط الأطلسي.",
        useful_links: "روابط مفيدة",
        all_properties: "جميع عقاراتنا",
        booking_terms: "شروط الحجز",
        legal: "إشعار قانوني",
        owner_space: "فضاء الملاك",
        contact_us: "اتصل بنا",
        address: "80000 أكادير، المغرب",
        rights: "جميع الحقوق محفوظة.",
        developed_by: "تطوير",
        whatsapp_tooltip: "هل لديك سؤال؟"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  const isRtl = lng === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;