import React, {useState} from 'react';
import { obtenerPublicaciones, useAuth } from '../context/AuthContext';
import { endpoints } from '../apiConfig';
import EditModal from './ModalPost';

const PostCard = ({ post, onEdit }) => {
  const [modalVisible, setModalVisible] = useState(false);

  let usuarioSession = JSON.parse(localStorage.getItem('usuario'));
  const { obtenerPublicaciones } = useAuth();
  const validarUsuario = post.userId === usuarioSession.id ? true : false;  

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(endpoints.eliminarPost, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id
        }),
      });

      if (response.ok) {
        obtenerPublicaciones();
      } else {
        console.error('Error al actualizar el like');
        // Manejar el error en consecuencia
      }
    } catch (error) {

    }
  };

  const handleLike = async (id, like) => {
    try {
      like = like + 1;
      const response = await fetch(endpoints.editarLike, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          like,
        }),
      });

      if (response.ok) {
        console.log('like actualizado');
        obtenerPublicaciones();
      } else {
        console.error('Error al actualizar el like');
        // Manejar el error en consecuencia
      }
    } catch (error) {

    }
  };

  return (
    <div>
      <a href="#" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div class="flex flex-col justify-between p-4 leading-normal">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.Title}</h5>
          <span class="text-sm text-gray-500 dark:text-gray-400">{post.FullName} {`Fecha de Publicación: ${post.createdAt}`}</span>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{post.Content}</p>
          <div class="flex  mt-4 md:mt-6">
            {validarUsuario ? (
              <>
            <a onClick={handleEdit} id='delete' class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Editar</a>
            <a onClick={() => handleDelete(post.id)} id='editar' class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 ms-3">Eliminar</a>
              </>
            ):
            <></>
            }
            <a onClick={() => handleLike(post.id, post.Likes)} type="button" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg class="h-4 w-4 text-white-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
              <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                {post.Likes}
              </span>
            </a>
          </div>
        </div>
      </a>
      <div className='padding'></div>
      <EditModal
        isOpen={modalVisible}
        onClose={handleModalClose}
        postId={post.id}
        initialData={post}  // Pasa los datos iniciales del post a la modal
        onEditSubmit={onEdit} // Pasa la función de edición al submit
      />
    </div>
  );
};

export default PostCard;