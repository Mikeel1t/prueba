import React, { useState } from 'react';
import { endpoints } from '../apiConfig';
import { obtenerPublicaciones, useAuth } from '../context/AuthContext';

const PostForm = ({ onAddPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { obtenerPublicaciones } = useAuth();

    let usuarioSession = JSON.parse(localStorage.getItem('usuario'));
    

    const handleGuardarPost = async () => {
        try {
          const response = await fetch(endpoints.guardarPost, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: usuarioSession.id,
              title,
              content,
            }),
          });
    
          if (response.ok) {
            console.log('Post guardado con éxito');
            setTitle('');
            setContent('');
            obtenerPublicaciones();
          } else {
            console.error('Error al guardar el post');
            // Manejar el error en consecuencia
          }
        } catch (error) {
          console.error('Error al realizar la solicitud:', error);
          // Manejar el error en consecuencia
        }
      };

    return (

        <div className='post-form'>
            <h1>Publicar Post</h1>
            <div class='rounded h-100 mb-4'>
                <div class="grid grid-cols-1 gap-4 mb-4">
                    <div class="flex items-center ">
                        <br></br>
                        <label>Título:</label>
                    </div>
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <input width="100%" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div class="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label>Comentario:</label>
                            <textarea value={content} onChange={(e) => setContent(e.target.value)}
                                id="comment" rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="" required></textarea>
                        </div>
                        <div class="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                            <button onClick={handleGuardarPost} type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                                Publicar
                            </button>
                            <div class="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">

                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    );
};

export default PostForm;