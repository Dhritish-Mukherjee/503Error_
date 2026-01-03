export const detectDeviceModel = (gpuRenderer: string): string => {
  const ua = navigator.userAgent || '';
  const width = window.screen.width;
  const height = window.screen.height;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Normalize dimensions (portrait)
  const shortEdge = Math.min(width, height);
  const longEdge = Math.max(width, height);

  // 1. APPLE IDENTIFICATION
  // iPadOS often masquerades as MacIntel
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  if (isIOS) {
    // iPhone 15 Pro Max / 14 Pro Max / 15 Plus / 14 Plus
    if (longEdge === 932 && pixelRatio === 3) return "APPLE_IPHONE_14_15_PRO_MAX";
    // iPhone 15 Pro / 14 Pro / 15 / 14
    if (longEdge === 852 && pixelRatio === 3) return "APPLE_IPHONE_14_15_PRO";
    // iPhone 13 Pro Max / 12 Pro Max
    if (longEdge === 926 && pixelRatio === 3) return "APPLE_IPHONE_12_13_PRO_MAX";
    // iPhone 13 / 13 Pro / 12 / 12 Pro
    if (longEdge === 844 && pixelRatio === 3) return "APPLE_IPHONE_12_13_PRO";
    // iPhone 11 Pro Max / XS Max
    if (longEdge === 896 && pixelRatio === 3) return "APPLE_IPHONE_11_PRO_MAX";
    // iPhone 11 / XR
    if (longEdge === 896 && pixelRatio === 2) return "APPLE_IPHONE_11_XR";
    // iPhone X / XS / 11 Pro
    if (longEdge === 812 && pixelRatio === 3) return "APPLE_IPHONE_X_XS";
    // iPhone 6/7/8 Plus
    if (longEdge === 736 && pixelRatio === 3) return "APPLE_IPHONE_PLUS_SERIES";
    // iPhone 6/7/8/SE
    if (longEdge === 667 && pixelRatio === 2) return "APPLE_IPHONE_STD_SERIES";
    
    if (Math.min(window.innerWidth, window.innerHeight) >= 768) return "APPLE_IPAD_GENERIC";

    return "APPLE_GENERIC_IOS_DEVICE";
  }

  // 2. ANDROID IDENTIFICATION
  // Samsung (SM-xxxx)
  const samsungMatch = ua.match(/SM-[A-Z0-9]+/i);
  if (samsungMatch) {
    return `SAMSUNG_${samsungMatch[0].toUpperCase()}`;
  }

  // Pixel
  const pixelMatch = ua.match(/Pixel\s([0-9a-zA-Z\s]+)/i);
  if (pixelMatch) {
    const model = pixelMatch[1].trim().replace(/\s+/g, '_').toUpperCase();
    return `GOOGLE_PIXEL_${model}`;
  }

  // OnePlus
  if (/OnePlus/i.test(ua)) {
     const opMatch = ua.match(/OnePlus\s([A-Z0-9]+)/i);
     return `ONEPLUS_${opMatch ? opMatch[1] : 'GENERIC'}`;
  }
  
  // Generic Android Model in typical format: "; <Model> Build/"
  const genericMatch = ua.match(/;\s([^;]+?)\s+Build\//);
  if (genericMatch && genericMatch[1].length < 30) {
      // Clean up common prefixes
      let rawModel = genericMatch[1].replace(/Samsung/i, '').trim();
      return `ANDROID_${rawModel.replace(/[\s\(\)]+/g, '_').toUpperCase()}`;
  }

  // 3. GPU/ARCH FALLBACK
  if (gpuRenderer.includes('Adreno')) return "QUALCOMM_ADRENO_HANDSET";
  if (gpuRenderer.includes('Mali')) return "ARM_MALI_HANDSET";
  if (gpuRenderer.includes('Apple')) return "APPLE_SILICON_DEVICE";
  if (gpuRenderer.includes('Intel')) return "DESKTOP_INTEL_ARCH";
  if (gpuRenderer.includes('NVIDIA')) return "DESKTOP_NVIDIA_ARCH";

  return "GENERIC_HANDSET_TYPE_01";
};