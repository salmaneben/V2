// src/lib/notificationUtils.ts

/**
 * This file is a stub that disables browser notifications
 * All notifications now use the in-app toast component instead
 */

export const isNotificationSupported = (): boolean => {
    return false; // Always return false to prevent browser notifications
  };
  
  export const requestNotificationPermission = async (): Promise<boolean> => {
    return false; // Always return false to prevent browser notifications
  };
  
  export const showNotification = (
    title: string,
    options: NotificationOptions = {}
  ): void => {
    // Do nothing - we're using Toast notifications instead
    console.log('Browser notifications disabled. Using in-app toasts instead.');
  };