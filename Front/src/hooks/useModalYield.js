import { useState } from 'react'

const useModalYield = (initialValue = false) => {

  const [isOpenModalYield, setIsOpenModalYield] = useState(initialValue);

  const openModalYield = () => {
    setIsOpenModalYield(true);
  }
  
  const closeModalYield = () => {
    setIsOpenModalYield(false);
  }


    return [isOpenModalYield, openModalYield ,closeModalYield ];
    
}

export default useModalYield
