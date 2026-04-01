import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      nav: {
        properties: "Nos Appartements",
        agency: "L'Agence",
        contact: "Contact",
        admin: "Espace Admin"
      },
      footer: {
        description: "Votre partenaire de confiance pour la location de courts séjours tout confort à Agadir. Des appartements meublés, propres et prêts à vous accueillir.",
        useful_links: "Liens Utiles",
        all_properties: "Tous nos biens",
        booking_terms: "Conditions de réservation",
        legal: "Mentions Légales",
        owner_space: "Espace Propriétaire",
        contact_us: "Nous Contacter",
        address: "Quartier Salam, Agadir, Maroc",
        rights: "Tous droits réservés.",
        developed_by: "Développé par",
        whatsapp_tooltip: "Discutons sur WhatsApp !"
      },
      common: {
        no_photo: "Sans photo"
      },
      home: {
        hero: {
          badge: "Séjours tout confort à Agadir",
          title_part1: "Sentez-vous",
          title_italic: "chez vous",
          title_part2: ", tout simplement.",
          subtitle: "Découvrez notre sélection d'appartements meublés. Un design soigné, des emplacements stratégiques et des tarifs accessibles."
        },
        search: {
          location_label: "Où souhaitez-vous aller ?",
          location_placeholder: "Ex: Quartier Salam, Marina...",
          price_label: "Budget Max",
          price_unit: "Dhs"
        },
        timeline: {
          title: "Comment ça marche ?",
          subtitle: "Réserver votre prochain séjour n'a jamais été aussi simple.",
          step1_title: "1. Choisissez votre bien",
          step1_desc: "Parcourez nos appartements meublés et trouvez celui qui vous correspond.",
          step2_title: "2. Réservez facilement",
          step2_desc: "Envoyez votre demande. Notre équipe vous répond instantanément.",
          step3_title: "3. Profitez de votre séjour",
          step3_desc: "Récupérez vos clés et profitez d'un appartement prêt à vivre."
        },
        collection: {
          title: "Nos Appartements",
          subtitle: "Trouvez le logement idéal pour votre séjour.",
          results: "résultats",
          loading: "Chargement des appartements...",
          empty: "Aucun appartement trouvé.",
          view_btn: "Voir l'appartement"
        },
        engagements: {
          clean_title: "Propreté Irréprochable",
          clean_desc: "Chaque appartement est minutieusement préparé avant votre arrivée.",
          secure_title: "Réservation Sécurisée",
          secure_desc: "Pas de mauvaises surprises. Les photos correspondent à la réalité.",
          price_title: "Le Juste Prix",
          price_desc: "Des tarifs transparents et compétitifs pour un séjour de qualité."
        }
      },
      apartment: {
        loading: "Chargement...",
        not_found: "Bien introuvable.",
        back_button: "Retour à la collection",
        main_image: "Image principale",
        thumbnail: "Miniature",
        no_property_available: "Aucun bien disponible pour le moment.",
        included_amenities: "Équipements inclus",
        per_night: "nuit",
        nights: "nuits",
        total: "Total",
        select_dates: "Veuillez sélectionner vos dates",
        request_booking: "Demander une réservation",
        dialog: {
          title: "Finaliser la demande",
          desc_part1: "Pour un séjour de",
          desc_part2: "nuits",
          desc_part3: "Nous vous recontacterons pour confirmer."
        },
        form: {
          name_label: "Nom complet",
          email_label: "Email",
          phone_label: "Téléphone (WhatsApp)",
          sending: "Envoi en cours...",
          submit_btn: "Confirmer la demande"
        },
        toast: {
          success_title: "Demande envoyée avec succès !",
          success_desc: "Nous vous contacterons très vite pour confirmer.",
          error_title: "Erreur lors de la réservation",
          error_desc: "Veuillez réessayer ou nous contacter directement."
        }
      },
      listing: {
        title: "Nos Appartements",
        results: "logements trouvés",
        no_results: "Aucun appartement ne correspond à vos critères.",
        show_all: "Voir tous les biens",
        sort: {
          recent: "Plus récents",
          price_asc: "Prix croissant",
          price_desc: "Prix décroissant"
        },
        filter: {
          search: "Recherche",
          search_placeholder: "Marina, Salam...",
          price: "Budget par nuit",
          amenities: "Équipements",
          reset: "Effacer les filtres"
        }
      },
      agency: {
        hero: {
          badge: "L'excellence immobilière à Agadir",
          title_part1: "Redéfinir l'art de ",
          title_italic: "recevoir",
          subtitle: "Krilia n'est pas qu'une agence. C'est une promesse de sérénité pour les propriétaires et la garantie d'un séjour inoubliable pour les voyageurs."
        },
        guests: {
          title: "Vous cherchez un séjour parfait ?",
          desc: "Oubliez les mauvaises surprises. Chez Krilia, chaque appartement est rigoureusement sélectionné, inspecté et préparé pour vous offrir un confort digne de l'hôtellerie.",
          feat1_title: "Standards Hôteliers",
          feat1_desc: "Linge de maison premium et propreté clinique garantie.",
          feat2_title: "Support 24/7",
          feat2_desc: "Une équipe dédiée à votre écoute durant tout votre séjour.",
          feat3_title: "Check-in Autonome",
          feat3_desc: "Arrivez à l'heure qui vous convient en toute liberté.",
          cta: "Voir nos appartements"
        },
        owners: {
          title: "Propriétaires, maximisez vos revenus.",
          desc: "Confiez-nous vos clés. Nous transformons votre bien immobilier en une machine à générer des revenus passifs, sans aucun effort de votre part.",
          feat1_title: "Rentabilité Optimisée",
          feat1_desc: "Ajustement dynamique des prix pour maximiser le taux d'occupation et vos revenus.",
          feat2_title: "Gestion Intégrale",
          feat2_desc: "Ménage, maintenance, communication voyageurs : on s'occupe de tout à 100%.",
          feat3_title: "Transparence Totale",
          feat3_desc: "Accédez à un tableau de bord pour suivre vos réservations et revenus en temps réel."
        },
        cta: {
          title: "Prêt à franchir le cap ?",
          desc: "Que vous souhaitiez réserver un séjour ou confier votre bien, notre équipe est à votre disposition sur WhatsApp.",
          button: "Discuter avec nous"
        }
      }
    }
  },
  en: {
    translation: {
      nav: {
        properties: "Our Apartments",
        agency: "The Agency",
        contact: "Contact",
        admin: "Admin Space"
      },
      footer: {
        description: "Your trusted partner for comfortable short-term rentals in Agadir. Clean, furnished apartments ready to welcome you.",
        useful_links: "Useful Links",
        all_properties: "All Properties",
        booking_terms: "Booking Terms",
        legal: "Legal Notice",
        owner_space: "Owner Area",
        contact_us: "Contact Us",
        address: "Salam District, Agadir, Morocco",
        rights: "All rights reserved.",
        developed_by: "Developed by",
        whatsapp_tooltip: "Chat with us on WhatsApp!"
      },
      common: {
        no_photo: "No photo"
      },
      home: {
        hero: {
          badge: "Comfortable stays in Agadir",
          title_part1: "Feel",
          title_italic: "at home",
          title_part2: ", simply.",
          subtitle: "Discover our selection of furnished apartments. Careful design, strategic locations, and affordable rates."
        },
        search: {
          location_label: "Where do you want to go?",
          location_placeholder: "Ex: Salam District, Marina...",
          price_label: "Max Budget",
          price_unit: "MAD"
        },
        timeline: {
          title: "How does it work?",
          subtitle: "Booking your next stay has never been easier.",
          step1_title: "1. Choose your property",
          step1_desc: "Browse our furnished apartments and find the one that suits you.",
          step2_title: "2. Book easily",
          step2_desc: "Send your request. Our team replies instantly.",
          step3_title: "3. Enjoy your stay",
          step3_desc: "Get your keys and enjoy a ready-to-live apartment."
        },
        collection: {
          title: "Our Apartments",
          subtitle: "Find the ideal accommodation for your stay.",
          results: "results",
          loading: "Loading apartments...",
          empty: "No apartments found.",
          view_btn: "View apartment"
        },
        engagements: {
          clean_title: "Spotless Cleanliness",
          clean_desc: "Each apartment is thoroughly prepared before your arrival.",
          secure_title: "Secure Booking",
          secure_desc: "No bad surprises. The photos match the reality.",
          price_title: "Fair Price",
          price_desc: "Transparent and competitive rates for a quality stay."
        }
      },
      apartment: {
        loading: "Loading...",
        not_found: "Property not found.",
        back_button: "Back to collection",
        main_image: "Main image",
        thumbnail: "Thumbnail",
        no_property_available: "No property available at the moment.",
        included_amenities: "Included amenities",
        per_night: "night",
        nights: "nights",
        total: "Total",
        select_dates: "Please select your dates",
        request_booking: "Request booking",
        dialog: {
          title: "Finalize request",
          desc_part1: "For a stay of",
          desc_part2: "nights",
          desc_part3: "We will contact you to confirm."
        },
        form: {
          name_label: "Full Name",
          email_label: "Email",
          phone_label: "Phone (WhatsApp)",
          sending: "Sending...",
          submit_btn: "Confirm request"
        },
        toast: {
          success_title: "Request sent successfully!",
          success_desc: "We will contact you soon to confirm.",
          error_title: "Booking error",
          error_desc: "Please try again or contact us directly."
        }
      },
      listing: {
        title: "Our Apartments",
        results: "properties found",
        no_results: "No apartments match your criteria.",
        show_all: "View all properties",
        sort: {
          recent: "Most recent",
          price_asc: "Price: Low to High",
          price_desc: "Price: High to Low"
        },
        filter: {
          search: "Search",
          search_placeholder: "Marina, Salam...",
          price: "Budget per night",
          amenities: "Amenities",
          reset: "Clear filters"
        }
      },
      agency: {
        hero: {
          badge: "Real Estate Excellence in Agadir",
          title_part1: "Redefining the art of ",
          title_italic: "hosting",
          subtitle: "Krilia is more than an agency. It's a promise of peace of mind for owners and the guarantee of an unforgettable stay for guests."
        },
        guests: {
          title: "Looking for the perfect stay?",
          desc: "Forget bad surprises. At Krilia, every apartment is carefully selected, inspected, and prepared to offer you hotel-grade comfort.",
          feat1_title: "Hotel Standards",
          feat1_desc: "Premium linens and guaranteed clinical cleanliness.",
          feat2_title: "24/7 Support",
          feat2_desc: "A dedicated team at your service throughout your stay.",
          feat3_title: "Self Check-in",
          feat3_desc: "Arrive at the time that suits you with complete freedom.",
          cta: "View our apartments"
        },
        owners: {
          title: "Owners, maximize your revenue.",
          desc: "Hand us your keys. We turn your real estate into a passive income generating machine, with zero effort on your part.",
          feat1_title: "Optimized Profitability",
          feat1_desc: "Dynamic pricing adjustment to maximize occupancy rate and your income.",
          feat2_title: "Full Management",
          feat2_desc: "Cleaning, maintenance, guest communication: we handle it all 100%.",
          feat3_title: "Total Transparency",
          feat3_desc: "Access a dashboard to track your bookings and revenue in real-time."
        },
        cta: {
          title: "Ready to take the leap?",
          desc: "Whether you want to book a stay or entrust us with your property, our team is available on WhatsApp.",
          button: "Chat with us"
        }
      }
    }
  },
  ar: {
    translation: {
      nav: {
        properties: "شققنا",
        agency: "الوكالة",
        contact: "اتصل بنا",
        admin: "لوحة التحكم"
      },
      footer: {
        description: "شريكك الموثوق للإيجارات القصيرة الأجل والمريحة في أكادير. شقق مفروشة ونظيفة وجاهزة لاستقبالك.",
        useful_links: "روابط مفيدة",
        all_properties: "جميع العقارات",
        booking_terms: "شروط الحجز",
        legal: "إشعار قانوني",
        owner_space: "مساحة المالك",
        contact_us: "اتصل بنا",
        address: "حي السلام، أكادير، المغرب",
        rights: "جميع الحقوق محفوظة.",
        developed_by: "تم التطوير بواسطة",
        whatsapp_tooltip: "تحدث معنا عبر الواتساب!"
      },
      common: {
        no_photo: "بدون صورة"
      },
      home: {
        hero: {
          badge: "إقامات مريحة في أكادير",
          title_part1: "اشعر وكأنك",
          title_italic: "في بيتك",
          title_part2: "، بكل بساطة.",
          subtitle: "اكتشف مجموعتنا من الشقق المفروشة. تصميم أنيق، مواقع استراتيجية، وأسعار في المتناول."
        },
        search: {
          location_label: "إلى أين تريد الذهاب؟",
          location_placeholder: "مثال: حي السلام، مارينا...",
          price_label: "الميزانية القصوى",
          price_unit: "درهم"
        },
        timeline: {
          title: "كيف تعمل؟",
          subtitle: "حجز إقامتك القادمة لم يكن أبداً بهذه السهولة.",
          step1_title: "1. اختر عقارك",
          step1_desc: "تصفح شققنا المفروشة واعثر على ما يناسبك.",
          step2_title: "2. احجز بسهولة",
          step2_desc: "أرسل طلبك. فريقنا يرد فوراً.",
          step3_title: "3. استمتع بإقامتك",
          step3_desc: "استلم مفاتيحك واستمتع بشقة جاهزة للعيش."
        },
        collection: {
          title: "شققنا",
          subtitle: "ابحث عن السكن المثالي لإقامتك.",
          results: "نتائج",
          loading: "جاري تحميل الشقق...",
          empty: "لم يتم العثور على شقق.",
          view_btn: "عرض الشقة"
        },
        engagements: {
          clean_title: "نظافة لا تشوبها شائبة",
          clean_desc: "يتم تجهيز كل شقة بعناية فائقة قبل وصولك.",
          secure_title: "حجز آمن",
          secure_desc: "لا مفاجآت سيئة. الصور تتطابق مع الواقع.",
          price_title: "السعر المناسب",
          price_desc: "أسعار شفافة وتنافسية لإقامة ذات جودة عالية."
        }
      },
      apartment: {
        loading: "جاري التحميل...",
        not_found: "العقار غير موجود.",
        back_button: "العودة إلى المجموعة",
        main_image: "الصورة الرئيسية",
        thumbnail: "صورة مصغرة",
        no_property_available: "لا توجد عقارات متاحة في الوقت الحالي.",
        included_amenities: "المرافق المشمولة",
        per_night: "ليلة",
        nights: "ليالي",
        total: "المجموع",
        select_dates: "يرجى تحديد التواريخ الخاصة بك",
        request_booking: "طلب حجز",
        dialog: {
          title: "إتمام الطلب",
          desc_part1: "لإقامة مدتها",
          desc_part2: "ليالي",
          desc_part3: "سنتصل بك للتأكيد."
        },
        form: {
          name_label: "الاسم الكامل",
          email_label: "البريد الإلكتروني",
          phone_label: "الهاتف (واتساب)",
          sending: "جاري الإرسال...",
          submit_btn: "تأكيد الطلب"
        },
        toast: {
          success_title: "تم إرسال الطلب بنجاح!",
          success_desc: "سنتصل بك قريباً للتأكيد.",
          error_title: "خطأ في الحجز",
          error_desc: "يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة."
        }
      },
      listing: {
        title: "شققنا",
        results: "عقارات وجدت",
        no_results: "لا توجد شقق تطابق معاييرك.",
        show_all: "عرض جميع العقارات",
        sort: {
          recent: "الأحدث",
          price_asc: "السعر: من الأقل للأعلى",
          price_desc: "السعر: من الأعلى للأقل"
        },
        filter: {
          search: "بحث",
          search_placeholder: "مارينا، السلام...",
          price: "الميزانية لليلة",
          amenities: "المرافق",
          reset: "مسح الفلاتر"
        }
      },
      agency: {
        hero: {
          badge: "التميز العقاري في أكادير",
          title_part1: "إعادة تعريف فن ",
          title_italic: "الضيافة",
          subtitle: "كريليا ليست مجرد وكالة. إنها وعد براحة البال للملاك وضمان إقامة لا تُنسى للمسافرين."
        },
        guests: {
          title: "تبحث عن إقامة مثالية؟",
          desc: "انسَ المفاجآت السيئة. في كريليا، يتم اختيار كل شقة وفحصها وتجهيزها بعناية لتوفر لك راحة تضاهي الفنادق.",
          feat1_title: "معايير فندقية",
          feat1_desc: "بياضات فاخرة ونظافة سريرية مضمونة.",
          feat2_title: "دعم على مدار الساعة",
          feat2_desc: "فريق مخصص لخدمتك طوال فترة إقامتك.",
          feat3_title: "تسجيل دخول ذاتي",
          feat3_desc: "صل في الوقت الذي يناسبك بكل حرية.",
          cta: "شاهد شققنا"
        },
        owners: {
          title: "أيها الملاك، ضاعفوا أرباحكم.",
          desc: "سلمونا مفاتيحكم. نحن نحول عقاركم إلى آلة لتوليد الدخل السلبي، دون أي جهد من جانبكم.",
          feat1_title: "ربحية مُحسَّنة",
          feat1_desc: "تعديل ديناميكي للأسعار لزيادة معدل الإشغال ودخلك.",
          feat2_title: "إدارة شاملة",
          feat2_desc: "التنظيف والصيانة والتواصل مع الضيوف: نحن نتكفل بكل شيء بنسبة 100٪.",
          feat3_title: "شفافية تامة",
          feat3_desc: "قم بالوصول إلى لوحة معلومات لتتبع حجوزاتك وإيراداتك في الوقت الفعلي."
        },
        cta: {
          title: "هل أنت مستعد لأخذ هذه الخطوة؟",
          desc: "سواء كنت ترغب في حجز إقامة أو تكليفنا بعقارك، فريقنا تحت تصرفك على واتساب.",
          button: "تحدث معنا"
        }
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

export default i18n;