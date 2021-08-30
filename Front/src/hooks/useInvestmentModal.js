import { useState, useEffect} from "react";

const useInvestmentModal = (initialValue = false) => {
  const [isOpenInvestmentModal, setIsOpenInvestmentModal] = useState(initialValue);

  const openInvestmentModal = () => {
    setIsOpenInvestmentModal(true);
  };

  const closeInvestmentModal = () => {
    setIsOpenInvestmentModal(false);
  };

  useEffect(() => {
    
    return () => {
      
    }
  }, [ ])

  return [isOpenInvestmentModal, openInvestmentModal, closeInvestmentModal];
};

export default useInvestmentModal;