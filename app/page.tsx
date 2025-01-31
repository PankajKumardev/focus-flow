'use client';
import { useState } from 'react';

export default function form() {
  const [formState, setFormState] = useState({
    name: '',
    password: '',
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">

    </div>
  );
}
