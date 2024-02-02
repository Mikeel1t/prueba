import React, { useState, useId} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState('');
  const [token, setToken] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [contra, setContra] = useState('');
  const [confirmarContra, setConfirmarContra] = useState('');
  const [error, setError] = useState('');
  const nombreId = useId();
  const AgeId = useId();
  const EmailId = useId();
  const ContraId = useId();
  const ConfirmContraId = useId();

  const handleLogin = async () => {
    try {

      const response = await axios.post('http://localhost:3001/login', {
        username,
        password,
      });
      if (response.data.login) {
        onLogin();
    	navigate('/home');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.response.data.error);
    }
  };

  

  const handleGuardarDatos = async () => {
    try {
      // Validaciones del formulario
      if (!nombre || !edad || !email || !contra || !confirmarContra) {
        setError('Todos los campos son obligatorios');
        return;
      }

      // Validación de edad numérica
      if (isNaN(edad) || edad <= 0) {
        setError('La edad debe ser un número válido y mayor que cero');
        return;
      }

      // Validación de formato de correo electrónico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Ingrese un correo electrónico válido');
        return;
      }

      if (contra !== confirmarContra) {
        setError('Las contraseñas no coinciden');
        return;
      }

      setError('');

      // Registro de usuario y obtención del token
      const response = await axios.post('http://localhost:3001/register', {
        nombre,
        edad,
        email,
        contra,
      });
      setToken(response.data.token);
      setShowModal(false);
      alert('Se registro el usuario ingrese con su correo');
      nombreId.valueOf = '';
    } catch (error) {
      console.error('Error al registrar usuario:', error.response.data.error);
    }
  };

  const handleCerrarModal = () =>{
    setShowModal(false)
  }
  return (
    <div className='body'>
        <div className='container'>
      <div className='form' id='login'>
          <h1 className='text-3xl font-bold'>Login</h1>
        </div>
      <div className='form__input-group'>
       <input
            type="text"
            required
            className="form__input"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
      </div>
      <div className='form__input-group'>
        <input className="form__input" type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="form__button" onClick={handleLogin}>Login</button>
      <div className='padding'></div>
      <button className="form__button" onClick={() => setShowModal(true)}>Crear Usuario</button>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Registrar Usuario
                    </h3>
                  </div>
                  <form className="relative p-6 flex-auto" id='formularioModal'>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="relative z-0 w-full mb-5 group">
                      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} id={nombreId}
                      name={nombreId} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                      />
                      <label for={nombreId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full Name</label>
                    </div>
                    <div className='grid md:grid-cols-2 md:gap-6'>
                        <div className="relative z-0 w-full mb-5 group">
                        <input type="number" min='0' value={edad} onChange={(e) => setEdad(e.target.value)} id={AgeId}
                        name={AgeId} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                        />
                        <label for={AgeId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Age</label>
                        </div>
                        <div className='relative z-0 w-full mb-5 group'>

                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id={EmailId}
                        name={EmailId} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                        />
                        <label for={EmailId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Email Address</label>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-2 md:gap-6'>
                        <div className='relative z-0 w-full mb-5 group'>

                        <input type="password" value={contra} onChange={(e) => setContra(e.target.value)} id={ContraId}
                        name={ContraId} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                        />
                        <label for={ContraId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Password</label>
                        </div>
                        <div className='relative z-0 w-full mb-5 group'>
                        <input type="password" value={confirmarContra} onChange={(e) => setConfirmarContra(e.target.value)} id={ConfirmContraId}
                        name={ConfirmContraId} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "
                        />
                        <label for={ConfirmContraId} className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >Confirm Password</label>
                        </div>
                    </div>
    
            
                  </form>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleCerrarModal}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleGuardarDatos}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
    </div>
    </div>
    
  );
};

export default LoginForm;