export const getGpuRenderer = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'HEADLESS_ENV_DETECTED';
    
    // Type assertion for WebGLRenderingContext to access debug info
    const extension = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
    if (extension) {
      const renderer = (gl as WebGLRenderingContext).getParameter(extension.UNMASKED_RENDERER_WEBGL);
      return renderer || 'GENERIC_RENDERER_01';
    }
    return 'WEBGL_MASKED';
  } catch (e) {
    return 'ERR_GPU_ACCESS_DENIED';
  }
};
