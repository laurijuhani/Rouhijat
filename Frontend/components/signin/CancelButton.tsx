"use client";
import { Button } from '../ui/button';

const CancelButton = () => {
  return (
    <Button variant="outline" onClick={() => window.location.href = '/'}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#4a4b4d"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
      Takaisin
    </Button> 
  );
};

export default CancelButton;
