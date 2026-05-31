import { useState, useEffect } from 'react';

export function useProfileSettings() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('cleanpro_profile_v1');
    return saved ? JSON.parse(saved) : {
      businessName: 'Auto Limpeza Pro',
      whatsapp: '5531980252882',
      address: 'São José da Lapa, MG'
    };
  });

  useEffect(() => {
    localStorage.setItem('cleanpro_profile_v1', JSON.stringify(profile));
  }, [profile]);

  return { profile, setProfile };
}
