import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import { subscribePushNotification, unsubscribePushNotification } from '../data/api';

// console.log(subscribePushNotification);

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    alert('sudah berlangganan push notification.');
    return;
  }

  console.log('mulai berlangganan push notification...');

  const failureSubscribeMessage = 'Langganan push nofification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push nofification berhasil diaktifkan.';

  let pushSubscription;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());

    const { endpoint, keys } = pushSubscription.toJSON();
    console.log({ endpoint, keys });
    const Response = await subscribePushNotification({ endpoint, keys });

    if (!Response.ok) {
      console.error('subscribe: response:', Response);
      alert(failureSubscribeMessage);

      await pushSubscription.unsubscribe();

      return;
    }

    alert(successSubscribeMessage);
  } catch (error) {
    console.error('subsribe: error:', error);
    alert(failureSubscribeMessage);

    await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() {
  const failureSubscribeMessage = 'Langganan push notification gagal dinonaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil dinonaktifkan.';

  try {
    const pushSubscription = await getPushSubscription();

    if (!pushSubscription) {
      alert('Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.');
      return;
    }

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      alert(failureSubscribeMessage);
      console.error('unsubscribe: response:', response);

      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();

    if (!unsubscribed) {
      alert(failureSubscribeMessage);
      await subscribePushNotification({ endpoint, keys });

      return;
    }

    alert(successSubscribeMessage);
  } catch (error) {
    alert(failureSubscribeMessage);
    console.error('unsubscribe: error:', error);
  }
}
