
export const shippingConfig = {
    freeShippingThreshold: 500, 
    shippingCost: 35,           
  };
  
  // Función para actualizar valores
  export const setShippingConfig = (newConfig) => {
    if (newConfig.freeShippingThreshold !== undefined) {
      shippingConfig.freeShippingThreshold = newConfig.freeShippingThreshold;
    }
    if (newConfig.shippingCost !== undefined) {
      shippingConfig.shippingCost = newConfig.shippingCost;
    }
  };
  