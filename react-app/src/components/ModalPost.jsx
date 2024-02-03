import React, { useState } from 'react';
import Modal from 'react-modal';
import { obtenerPublicaciones, useAuth } from '../context/AuthContext';
import { endpoints } from '../apiConfig';

const EditModal = ({ isOpen, onClose, postId, initialData, onEditSubmit }) => {

    const [editedData, setEditedData] = useState(initialData);
    const { obtenerPublicaciones } = useAuth();

    const handleChange = (e) => {
        // Manejar cambios en los campos de edición
        const { name, value } = e.target;
        setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleEditarPost = async () => {
        try {
          const response = await fetch(endpoints.editarPost, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: postId,
              nuevosDatos:editedData,
            }),
          });
    
          if (response.ok) {
            console.log('Post actualizado con éxito');
            obtenerPublicaciones();
            onClose();
          } else {
            console.error('Error al actualizar el usuario');
            // Manejar el error en consecuencia
          }
        } catch (error) {
          console.error('Error al realizar la solicitud:', error);
          // Manejar el error en consecuencia
        }
      };
      
    const customStyles = {
        content: {
          width: '50%', // Puedes ajustar el ancho según tus preferencias
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      };
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      <h2>Editar Post {postId}</h2>
      <div class='rounded h-100 mb-4'>
                <div class="grid grid-cols-1 gap-4 mb-4">
                    <div class="flex items-center ">
                        <br></br>
                        <label>Título:</label>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <input name='Title' width="100%" type="text" value={editedData.Title} onChange={handleChange} />
                    </div>
                    <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label>Comentario:</label>
                            <textarea value={editedData.Content} onChange={handleChange}
                                name="Content" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="" required></textarea>
                        </div>
                        <div class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                            <button onClick={handleEditarPost} type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                Actualizar
                            </button>
                            <div class="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </Modal>
  );
};

export default EditModal;