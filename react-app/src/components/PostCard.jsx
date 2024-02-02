import React from 'react';

const PostCard = ({ post }) => {
  const handleEdit = () => {
    // Implementar lógica de edición (puedes abrir un modal o navegar a otra página)
  };

  const handleDelete = () => {
    // Implementar lógica de eliminación
  };

  return (
    <div>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <p>{`Publicado por: Usuario (Reemplaza con el nombre del usuario)`}</p>
      <p>{`Fecha de Publicación: ${post.date}`}</p>
      <div>
        {/* Agregar opciones de edición/eliminación solo para los posts del propio usuario */}
        <button onClick={handleEdit}>Editar</button>
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
};

export default PostCard;