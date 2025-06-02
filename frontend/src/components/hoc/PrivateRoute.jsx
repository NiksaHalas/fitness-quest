// frontend/src/components/hoc/PrivateRoute.jsx
// Autor: Tvoje Ime
// Datum: 02.06.2025.
// Svrha: Komponenta za zaštitu ruta, omogućava pristup samo prijavljenim korisnicima.

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Proveravamo da li postoji 'userInfo' u localStorage-u
  // To je token i ostali podaci koje smo sačuvali prilikom prijave
  const userInfo = localStorage.getItem('userInfo');

  return userInfo ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;