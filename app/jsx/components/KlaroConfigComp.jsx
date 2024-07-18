// KlaroConfigComponent.jsx
import { useEffect } from 'react';
import Klaro from 'klaro';

const KlaroConfigComponent = () => {
  const klaroConfig = {
    cookieConsent: {
      languages: ['en'],
      consentTypes: [
        { name: "analytics", description: "eScholarship uses Matomo" },
      ],
      onAccept: () => console.log('User accepted all cookies'),
      onDecline: () => console.log('User declined all cookies')
    }
  };

  useEffect(() => {
    Klaro.init(klaroConfig);
  }, []);

  return null; // This component doesn't render anything itself
};

export default KlaroConfigComponent;
