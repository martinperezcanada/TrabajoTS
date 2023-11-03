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

async function imagenesAPI(activityType: string): Promise<string | null> {
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

function getIconByValue(value: number, type: string) {
  let icon: string;

}

async function actualizarInformacion(): Promise<void> {
  try {
    const informacion: BoredActivity = await fetchBoredActivity();

    document.getElementById('activity')!.textContent = `Actividad: ${informacion.activity}`;
    document.getElementById('type')!.textContent = `Tipo: ${informacion.type}`;
    document.getElementById('participants')!.textContent = `Participantes: ${informacion.participants}`;
    document.getElementById('price')!.textContent = `Precio: ${getIconByValue(informacion.price, 'price')}`;
    document.getElementById('accessibility')!.textContent = `Accesibilidad: ${getIconByValue(informacion.accessibility, 'accessibility')}`;

    const imageUrl: string | null = await imagenesAPI(informacion.type);
    if (imageUrl) {
      (document.getElementById('activity-image') as HTMLImageElement).src = imageUrl;
      (document.getElementById('activity-image') as HTMLImageElement).alt = `Imagen de ${informacion.type}`;
    } else {
      (document.getElementById('activity-image') as HTMLImageElement).src = '';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

actualizarInformacion();

const newActivityBtn = document.getElementById('newActivityBtn');
newActivityBtn?.addEventListener('click', actualizarInformacion);
