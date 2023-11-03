import { BoredActivity } from "./interface";

async function fetchBoredActivity(): Promise<BoredActivity> {
  try {
    const response = await fetch('http://www.boredapi.com/api/activity?');
    if (response.ok) {
      const data: BoredActivity = await response.json();
      return data;
    } else {
      throw new Error('Failed to fetch activity');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchActivityImage(activityType: string): Promise<string | null> {
  try {
    const apiKey = 'wVfs9NhocZHtfwo5bT50ormvPGwZNflLHS0dJTVC7dumCK6daADG2dTf';
    const apiEndPoint = `https://api.pexels.com/v1/search?query=${activityType}&per_page=1`;

    const response = await fetch(apiEndPoint, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.medium; 
      }
    }
  } catch (error) {
    console.error('Error fetching activity image:', error);
  }

  return null; 
}

function getIconByValue(value: number, type: string): string {
  let icon: string;

  if (type === 'price') {
    switch (value) {
      case 1:
        icon = 'price-low-icon'; // Ícono para un precio bajo
        break;
      case 2:
        icon = 'price-medium-icon'; // Ícono para un precio medio
        break;
      case 3:
        icon = 'price-high-icon'; // Ícono para un precio alto
        break;
      default:
        icon = 'price-default-icon'; // Ícono predeterminado para valores desconocidos
        break;
    }
  } else if (type === 'accessibility') {
    switch (value) {
      case 1:
        icon = 'accessibility-low-icon'; // Ícono para baja accesibilidad
        break;
      case 2:
        icon = 'accessibility-medium-icon'; // Ícono para accesibilidad media
        break;
      case 3:
        icon = 'accessibility-high-icon'; // Ícono para alta accesibilidad
        break;
      default:
        icon = 'accessibility-default-icon'; // Ícono predeterminado para valores desconocidos
        break;
    }
  } else {
    icon = 'default-icon'; // Ícono predeterminado para cualquier otro tipo
  }

  return icon;
}

async function updateActivityInfo(): Promise<void> {
  try {
    const activityData: BoredActivity = await fetchBoredActivity();

    document.getElementById('activity')!.textContent = `Actividad: ${activityData.activity}`;
    document.getElementById('type')!.textContent = `Tipo: ${activityData.type}`;
    document.getElementById('participants')!.textContent = `Participantes: ${activityData.participants}`;
    document.getElementById('price')!.textContent = `Precio: ${getIconByValue(activityData.price, 'price')}`;
    document.getElementById('accessibility')!.textContent = `Accesibilidad: ${getIconByValue(activityData.accessibility, 'accessibility')}`;

    const imageUrl: string | null = await fetchActivityImage(activityData.type);
    if (imageUrl) {
      (document.getElementById('activity-image') as HTMLImageElement).src = imageUrl;
      (document.getElementById('activity-image') as HTMLImageElement).alt = `Imagen de ${activityData.type}`;
    } else {
      (document.getElementById('activity-image') as HTMLImageElement).src = '';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

updateActivityInfo();

const newActivityBtn = document.getElementById('newActivityBtn');
newActivityBtn?.addEventListener('click', updateActivityInfo);
