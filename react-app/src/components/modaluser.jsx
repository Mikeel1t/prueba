import React, { useState, useId, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../apiConfig';

Modal.setAppElement('#root'); // Necesario para react-modal

const EditarUsuarioModal = ({ isOpen, onRequestClose }) => {
  const { usuario, editarUsuario } = useAuth();
  let usuarioSession = JSON.parse(localStorage.getItem('usuario'));
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [error, setError] = useState('');
  const nombreId = useId();
  const AgeId = useId();
  const EmailId = useId();
  const [email, setEmail] = useState('');
  const [nuevosDatos, setNuevosDatos] = useState({
    nombre: usuarioSession.FullName,
      email: usuarioSession.Email,
      edad: usuarioSession.Age,
  });

  const handleGuardarCambios = async () => {
    try {
      const response = await fetch(endpoints.actualizarUsuario, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: usuarioSession.id,
          nuevosDatos,
        }),
      });

      if (response.ok) {
        console.log('Usuario actualizado con éxito');
        editarUsuario(nuevosDatos);
        onRequestClose();
        usuarioSession.FullName = nuevosDatos.nombre;
        usuarioSession.Age = nuevosDatos.edad;
        usuarioSession.Email = nuevosDatos.email;
        localStorage.setItem('usuario', JSON.stringify(usuarioSession));
      } else {
        console.error('Error al actualizar el usuario');
        // Manejar el error en consecuencia
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      // Manejar el error en consecuencia
    }
  };

  const handleInputChange = (e) => {
    setNuevosDatos({
      ...nuevosDatos,
      [e.target.name]: e.target.value,
    });
  };

  const customStyles = {
    content: {
      width: '500px', // Puedes ajustar el ancho según tus preferencias
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <h2>Editar Usuario</h2>
      <form className="relative p-6 flex-auto" id='formularioModal'>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="relative z-0 w-full mb-5 group">
          <input type="text" value={nuevosDatos.nombre} onChange={handleInputChange} id={nombreId}
            name='nombre' className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
          />
          <label for={nombreId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full Name</label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className="relative z-0 w-full mb-5 group">
            <input type="number" min='0' value={nuevosDatos.edad} onChange={handleInputChange} id={AgeId}
              name='edad' className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
            />
            <label for={AgeId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Age</label>
          </div>
          <div className='relative z-0 w-full mb-5 group'>

            <input type="email" value={nuevosDatos.email} onChange={handleInputChange} id={EmailId}
              name='edad' className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
            />
            <label for={EmailId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Email Address</label>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
        <button
          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={onRequestClose}
        >
          Close
        </button>
        <button
          className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={handleGuardarCambios}
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditarUsuarioModal;