"use client";
import { Button } from '../ui/button';

const BackButton = () => {
  return (
    <Button className='hover:bg-gray-700' variant="ghost" onClick={() => window.location.href = '/'}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
      Takaisin
    </Button> 
  );
};

export default BackButton;
