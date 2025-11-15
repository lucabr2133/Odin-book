import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa desde 'react-router-dom'
import React from 'react';
function GitHubRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {

      localStorage.setItem('authToken', token);




      navigate('/');
    } else {

      console.error('No se encontró un token de autenticación en la URL.');
      navigate('/login'); 
    }
  }, [navigate]); 

  return <div>Procesando autenticación...</div>;
}

export default GitHubRedirect;