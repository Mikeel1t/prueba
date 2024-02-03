const apiUrl = 'http://localhost:3001/'; // Cambia la URL según tu configuración

export const endpoints = {
  actualizarUsuario: `${apiUrl}actualizar-usuario`,
  login: `${apiUrl}login`,
  guardarUsuario: `${apiUrl}register`,
  guardarPost: `${apiUrl}guardar_post`,
  consultarPost: `${apiUrl}consultar_post_all`,
  editarLike: `${apiUrl}actualizar_like`,
  editarPost: `${apiUrl}actualizar_post`,
  eliminarPost: `${apiUrl}eliminar_post`,
  consultaPostId: `${apiUrl}consultar_post_id`,
  
};