export const getResponsivePopupProperties = (): string => {
  const widthPercentage = 50;
  const heightPercentage = 80;

  const popupWidth = (window.innerWidth * widthPercentage) / 100;
  const popupHeight = (window.innerHeight * heightPercentage) / 100;

  const left = window.innerWidth / 2 - popupWidth / 2 + window.screenX;
  const top = window.innerHeight / 2 - popupHeight / 2 + window.screenY;

  const popupFeatures = `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=no,location=no`;

  return popupFeatures;
};
